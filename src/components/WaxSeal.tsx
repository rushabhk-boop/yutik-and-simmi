import { forwardRef, useImperativeHandle, useRef } from "react"
import { easeSoft, play } from "../lib/animate"

export type WaxSealHandle = {
  press: () => Promise<void>
  release: () => Promise<void>
  dismiss: () => Promise<void>
}

type WaxSealProps = {
  pulsing: boolean
  interactive: boolean
  onOpen: () => void
}

const burstCount = 8

export const WaxSeal = forwardRef<WaxSealHandle, WaxSealProps>(function WaxSeal(
  { pulsing, interactive, onOpen },
  ref,
) {
  const rootRef = useRef<HTMLButtonElement>(null)
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([])

  useImperativeHandle(ref, () => ({
    async press() {
      await play(rootRef.current, { scale: 0.97 }, { duration: 0.14, ease: "easeIn" })
    },
    async release() {
      const bursts = dotsRef.current.map((dot, index) => {
        const angle = (index / burstCount) * Math.PI * 2
        return play(
          dot,
          {
            opacity: [0, 1, 0],
            x: Math.cos(angle) * 54,
            y: Math.sin(angle) * 36,
            scale: [0.3, 1],
          },
          { duration: 0.7, ease: "easeOut" },
        )
      })
      await Promise.all([play(rootRef.current, { scale: 1 }, { duration: 0.28, ease: easeSoft }), ...bursts])
    },
    async dismiss() {
      await play(rootRef.current, { opacity: 0 }, { duration: 0.25, ease: easeSoft })
    },
  }))

  return (
    <button
      ref={rootRef}
      type="button"
      className="relative h-[46vh] max-h-[520px] w-[min(78vw,340px)] bg-transparent"
      aria-label="Tap to open the invitation"
      tabIndex={interactive ? 0 : -1}
      onClick={onOpen}
    >
      <span
        className={`pointer-events-none absolute top-[30%] left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ${
          pulsing ? "brooch-glow" : ""
        }`}
      />
      {Array.from({ length: burstCount }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            dotsRef.current[index] = node
          }}
          className="absolute top-[30%] left-1/2 h-1 w-1 rounded-full bg-[#f6e7c1] opacity-0"
          style={{ marginLeft: -2, marginTop: -2, boxShadow: "0 0 6px #f3e2b8" }}
        />
      ))}
    </button>
  )
})
