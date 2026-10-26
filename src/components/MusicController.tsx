import { Volume2, VolumeX } from "lucide-react"
import { useSyncExternalStore } from "react"
import { getMusicSnapshot, subscribeMusic, toggleMusic } from "../lib/audio"

export function MusicController() {
  const music = useSyncExternalStore(subscribeMusic, getMusicSnapshot, getMusicSnapshot)
  if (!music.started && !music.unavailable) return null

  const muted = music.muted || music.unavailable
  const label = music.unavailable
    ? "Background music is unavailable"
    : music.muted
      ? "Unmute music"
      : "Mute music"

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-pressed={!muted}
      aria-label={label}
      disabled={music.unavailable}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#e7d7b8] bg-[#fbf6ef] text-[#241410] disabled:opacity-60"
    >
      {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
    </button>
  )
}
