import { forwardRef, useImperativeHandle, useRef, type RefObject } from "react"
import { easeDoor, play } from "../lib/animate"

export type CurtainRevealHandle = {
  open: (reduced: boolean) => Promise<void>
}

export const CurtainReveal = forwardRef<CurtainRevealHandle>(function CurtainReveal(_, ref) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    async open(reduced: boolean) {
      const distance = reduced ? "-100%" : "-78%"
      const duration = reduced ? 0.45 : 1.6
      await Promise.all([
        play(leftRef.current, { x: distance }, { duration, ease: easeDoor }),
        play(rightRef.current, { x: reduced ? "100%" : "78%" }, { duration, ease: easeDoor }),
      ])
    },
  }))

  return (
    <div className="absolute inset-0 z-[3]" aria-hidden="true">
      <Panel side="left" panelRef={leftRef} />
      <Panel side="right" panelRef={rightRef} />
    </div>
  )
})

function Panel({
  side,
  panelRef,
}: {
  side: "left" | "right"
  panelRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={panelRef}
      className={`absolute top-0 h-full w-[54%] overflow-hidden ${side === "left" ? "left-0" : "right-0"}`}
    >
      <div className={`silk-sway h-full w-full ${side === "right" ? "-scale-x-100" : ""}`}>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#e7c3c4_0%,#f6e4df_18%,#f8efe8_46%,rgba(246,228,223,0.2)_100%)]" />
        <div className="absolute inset-y-0 left-[8%] w-px bg-white/50" />
        <div className="absolute inset-y-0 left-[18%] w-px bg-[#c8a46a]/30" />
      </div>
      <div
        className={`absolute inset-y-0 w-3 ${side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} from-[#c8a46a]/80 to-transparent`}
      />
    </div>
  )
}
