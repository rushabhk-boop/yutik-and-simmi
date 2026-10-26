import { weddingConfig } from "../data/weddingConfig"

export type MusicSnapshot = {
  started: boolean
  muted: boolean
  unavailable: boolean
}

const STORAGE_KEY = "yutik-simmi-music-muted"
const listeners = new Set<() => void>()

let audio: HTMLAudioElement | null = null
let fadeFrame = 0
let snapshot: MusicSnapshot = {
  started: false,
  muted: readMuted(),
  unavailable: false,
}

function readMuted() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function writeMuted(muted: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, muted ? "1" : "0")
  } catch {
    /* Private browsing can block storage. The preference still lasts for this page view. */
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

function update(partial: Partial<MusicSnapshot>) {
  snapshot = { ...snapshot, ...partial }
  emit()
}

export function subscribeMusic(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getMusicSnapshot() {
  return snapshot
}

function fadeTo(target: number, milliseconds: number) {
  if (!audio) return
  cancelAnimationFrame(fadeFrame)
  const start = audio.volume
  const began = performance.now()
  const step = (now: number) => {
    if (!audio) return
    const progress = Math.min(1, (now - began) / milliseconds)
    audio.volume = start + (target - start) * progress
    if (progress < 1) fadeFrame = requestAnimationFrame(step)
  }
  fadeFrame = requestAnimationFrame(step)
}

/** Call from the invitation tap so playback stays inside the user gesture. */
export function startMusic() {
  if (snapshot.unavailable) return
  if (!audio) {
    audio = new Audio(weddingConfig.music.src)
    audio.loop = true
    audio.preload = "auto"
    audio.volume = 0
    audio.addEventListener("error", () => {
      update({ started: false, unavailable: true })
    })
  }

  update({ started: true })
  void audio.play().catch(() => {
    update({ started: false, unavailable: true })
  })

  if (snapshot.muted) {
    audio.volume = 0
    return
  }
  fadeTo(weddingConfig.music.volume, 1500)
}

export function toggleMusic() {
  if (snapshot.unavailable) return
  const muted = !snapshot.muted
  writeMuted(muted)
  update({ muted })
  if (!audio) return
  if (muted) {
    fadeTo(0, 280)
    return
  }
  if (audio.paused) {
    void audio.play().catch(() => update({ unavailable: true }))
  }
  fadeTo(weddingConfig.music.volume, 800)
}

let soundContext: AudioContext | null = null

function context() {
  const Ctx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  soundContext ??= new Ctx()
  if (soundContext.state === "suspended") void soundContext.resume()
  return soundContext
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
  delay = 0,
) {
  const ctx = context()
  if (!ctx) return
  const start = ctx.currentTime + delay
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(Math.max(gainValue, 0.0002), start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)
}

export function playSealSound() {
  tone(196, 0.09, "sine", 0.045)
  tone(392, 0.14, "triangle", 0.018, 0.03)
}

export function playOpeningSound() {
  tone(523.25, 0.42, "sine", 0.028)
  tone(783.99, 0.5, "sine", 0.016, 0.06)
  tone(1046.5, 0.55, "triangle", 0.01, 0.1)
}

export function playCurtainSound() {
  const ctx = context()
  if (!ctx) return
  const length = Math.floor(ctx.sampleRate * 0.5)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < length; index += 1) {
    const envelope = Math.sin((index / length) * Math.PI)
    data[index] = (Math.random() * 2 - 1) * envelope
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.setValueAtTime(380, ctx.currentTime)
  filter.frequency.linearRampToValueAtTime(1600, ctx.currentTime + 0.5)
  const gain = ctx.createGain()
  gain.gain.value = 0.035
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start()
}
