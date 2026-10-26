import { CalendarPlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { weddingConfig } from "../data/weddingConfig"
import { downloadWeddingCalendar } from "../lib/calendar"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { GoldButton, SampleNote, Section } from "./ornaments"

export function SaveTheDate() {
  const { ceremony, copy, couple } = weddingConfig
  const reduced = usePrefersReducedMotion()
  const [revealed, setRevealed] = useState(reduced)

  return (
    <Section id="save-the-date" eyebrow={copy.invited} title="Scratch to Reveal">
      <div className="mx-auto flex max-w-xl flex-col items-center px-2 text-center">
        <p className="font-serif text-lg text-brown italic">A small surprise, just for you.</p>
        <div className="relative mt-6 h-[230px] w-[260px]">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={revealed ? undefined : { clipPath: HEART_CLIP }}
          >
            <p className="font-label text-[0.55rem] tracking-[0.28em] text-terracotta uppercase">{ceremony.weekday}</p>
            <p className="font-serif text-5xl leading-none text-terracotta">{ceremony.day}</p>
            <p className="font-serif text-xl leading-tight text-terracotta italic">{ceremony.month}</p>
            <p className="font-label text-[0.62rem] tracking-[0.22em] text-brown">{ceremony.year}</p>
            <p className="font-serif text-base text-brown">{ceremony.timeLabel}</p>
          </div>
          {revealed ? null : (
            <ScratchFoil
              onReveal={() => setRevealed(true)}
            />
          )}
        </div>
        {revealed ? null : (
          <button
            type="button"
            className="mt-2 font-serif text-sm text-brown underline decoration-gold underline-offset-4"
            onClick={() => setRevealed(true)}
          >
            Show the date
          </button>
        )}
        <p className="mt-4 font-serif text-lg text-brown italic">
          {couple.groom.firstName} & {couple.bride.firstName}
        </p>
        <div className="mt-6">
          <GoldButton onClick={downloadWeddingCalendar}>
            <CalendarPlus size={15} aria-hidden="true" />
            Save the Date
          </GoldButton>
        </div>
        {ceremony.isSampleSchedule ? <SampleNote>{copy.scheduleNote}</SampleNote> : null}
      </div>
    </Section>
  )
}

const HEART_CLIP = "path('M 130 207 C 2 137 52 33 130 95 C 208 33 258 137 130 207 Z')"

function ScratchFoil({ onReveal }: { onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const finishing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const foilPixels = useRef(0)
  const moves = useRef(0)
  const [lifting, setLifting] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d", { willReadFrequently: true })
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(260 * dpr)
    canvas.height = Math.round(230 * dpr)
    paintFoil(ctx, canvas.width, canvas.height)
    foilPixels.current = countOpaque(ctx, canvas)
  }, [])

  function locate(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return null
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  function scrape(from: { x: number; y: number }, to: { x: number; y: number }) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || finishing.current) return
    const brush = Math.min(canvas.width, canvas.height) * 0.072
    ctx.save()
    ctx.globalCompositeOperation = "destination-out"
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "rgba(0,0,0,1)"
    ctx.lineWidth = brush
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
    moves.current += 1
    if (moves.current % 4 === 0 && clearedEnough(ctx, canvas, foilPixels.current)) finish()
  }

  function finish() {
    if (finishing.current) return
    finishing.current = true
    drawing.current = false
    setLifting(true)
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${lifting ? "opacity-0" : "opacity-100"}`}
      role="application"
      aria-label="Scratch the heart to reveal the date"
      onTransitionEnd={() => {
        if (lifting) onReveal()
      }}
      onPointerDown={(event) => {
        if (finishing.current) return
        drawing.current = true
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          /* The scratch still follows the pointer if capture is unavailable. */
        }
        const spot = locate(event.clientX, event.clientY)
        if (!spot) return
        last.current = spot
        scrape(spot, { x: spot.x + 0.01, y: spot.y })
      }}
      onPointerMove={(event) => {
        if (!drawing.current || finishing.current) return
        const native = event.nativeEvent
        const samples = native.getCoalescedEvents?.() ?? [native]
        for (const sample of samples) {
          const spot = locate(sample.clientX, sample.clientY)
          const previous = last.current
          if (!spot || !previous) continue
          scrape(previous, spot)
          last.current = spot
        }
      }}
      onPointerUp={(event) => {
        drawing.current = false
        last.current = null
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx && clearedEnough(ctx, canvas, foilPixels.current)) finish()
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      }}
      onPointerCancel={() => {
        drawing.current = false
        last.current = null
      }}
    />
  )
}

function paintFoil(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, width, height)
  heartPath(ctx, width, height)
  ctx.fillStyle = "#e7d3bc"
  ctx.fill()
  ctx.save()
  heartPath(ctx, width, height)
  ctx.clip()
  ctx.fillStyle = "rgba(90, 58, 42, 0.72)"
  ctx.font = `500 ${Math.round(width * 0.05)}px "Cormorant Garamond", serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("Scratch", width / 2, height * 0.5)
  ctx.restore()
}

function heartPath(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const sx = width / 260
  const sy = height / 230
  ctx.beginPath()
  ctx.moveTo(130 * sx, 207 * sy)
  ctx.bezierCurveTo(2 * sx, 137 * sy, 52 * sx, 33 * sy, 130 * sx, 95 * sy)
  ctx.bezierCurveTo(208 * sx, 33 * sy, 258 * sx, 137 * sy, 130 * sx, 207 * sy)
  ctx.closePath()
}

function countOpaque(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let opaque = 0
  for (let index = 3; index < data.length; index += 16 * 4) {
    if (data[index] > 24) opaque += 1
  }
  return opaque
}

function clearedEnough(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, foilPixels: number) {
  if (foilPixels <= 0) return false
  return countOpaque(ctx, canvas) / foilPixels < 0.32
}
