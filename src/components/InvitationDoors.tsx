import { forwardRef, useImperativeHandle, useRef, type RefObject } from "react"
import { weddingConfig } from "../data/weddingConfig"
import { easeDoor, play } from "../lib/animate"

export type InvitationDoorsHandle = {
  press: () => Promise<void>
  open: (reduced: boolean) => Promise<void>
}

export const InvitationDoors = forwardRef<InvitationDoorsHandle>(function InvitationDoors(_, ref) {
  const shellRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const leftShadeRef = useRef<HTMLDivElement>(null)
  const rightShadeRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    async press() {
      await play(shellRef.current, { scale: 0.992 }, { duration: 0.14, ease: "easeIn" })
      await play(shellRef.current, { scale: 1 }, { duration: 0.34, ease: "easeOut" })
    },
    async open(reduced: boolean) {
      if (reduced) {
        await Promise.all([
          play(leftRef.current, { opacity: 0 }, { duration: 0.45, ease: easeDoor }),
          play(rightRef.current, { opacity: 0 }, { duration: 0.45, ease: easeDoor }),
        ])
        return
      }

      await Promise.all([
        play(leftRef.current, { rotateY: 102, z: 36 }, { duration: 1.55, ease: easeDoor }),
        play(rightRef.current, { rotateY: -102, z: 36 }, { duration: 1.55, ease: easeDoor }),
        play(leftShadeRef.current, { opacity: 0.72 }, { duration: 1.55, ease: "easeIn" }),
        play(rightShadeRef.current, { opacity: 0.72 }, { duration: 1.55, ease: "easeIn" }),
      ])
    },
  }))

  return (
    <div
      ref={shellRef}
      className="pointer-events-none absolute inset-0 z-[12]"
      style={{ perspective: "1600px" }}
      aria-hidden="true"
    >
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        <Door side="left" panelRef={leftRef} shadeRef={leftShadeRef} />
        <Door side="right" panelRef={rightRef} shadeRef={rightShadeRef} />
      </div>
    </div>
  )
})

function Door({
  side,
  panelRef,
  shadeRef,
}: {
  side: "left" | "right"
  panelRef: RefObject<HTMLDivElement | null>
  shadeRef: RefObject<HTMLDivElement | null>
}) {
  const hinge = side === "left" ? "left center" : "right center"
  return (
    <div
      ref={panelRef}
      className={`absolute top-0 h-full w-1/2 ${side === "left" ? "left-0" : "right-0"}`}
      style={{ transformOrigin: hinge, transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
        <img
          src={weddingConfig.assets.gate}
          alt=""
          draggable={false}
          className={`absolute top-0 h-full object-cover ${side === "left" ? "left-0" : "right-0"}`}
          style={{ width: "100vw", maxWidth: "none", objectPosition: "center 46%" }}
        />
        <div
          ref={shadeRef}
          className={`absolute inset-0 opacity-0 ${
            side === "left"
              ? "bg-gradient-to-r from-transparent to-black/40"
              : "bg-gradient-to-l from-transparent to-black/40"
          }`}
        />
      </div>
      <div
        className="absolute inset-0 bg-[#efe4d4]"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      />
    </div>
  )
}

