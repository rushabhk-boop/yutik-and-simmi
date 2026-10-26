import { ChevronDown } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { weddingConfig } from "../data/weddingConfig"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { easeSoft, nextFrame, play, stopAnimations } from "../lib/animate"
import { playCurtainSound, playOpeningSound, playSealSound, startMusic } from "../lib/audio"
import { CurtainReveal, type CurtainRevealHandle } from "./CurtainReveal"
import { InvitationDoors, type InvitationDoorsHandle } from "./InvitationDoors"
import { WeddingHero, type WeddingHeroHandle } from "./WeddingHero"
import { WaxSeal, type WaxSealHandle } from "./WaxSeal"

export type InvitationPhase =
  | "CLOSED"
  | "SEAL_PRESSED"
  | "SEAL_RELEASED"
  | "DOORS_OPENING"
  | "DOORS_OPEN"
  | "CURTAINS_OPENING"
  | "INVITATION_REVEALING"
  | "INVITATION_VISIBLE"

const order: InvitationPhase[] = [
  "CLOSED",
  "SEAL_PRESSED",
  "SEAL_RELEASED",
  "DOORS_OPENING",
  "DOORS_OPEN",
  "CURTAINS_OPENING",
  "INVITATION_REVEALING",
  "INVITATION_VISIBLE",
]

type InvitationOpeningProps = {
  onOpened: () => void
}

export function InvitationOpening({ onOpened }: InvitationOpeningProps) {
  const [phase, setPhase] = useState<InvitationPhase>("CLOSED")
  const phaseRef = useRef<InvitationPhase>("CLOSED")
  const running = useRef(false)
  const alive = useRef(true)
  const reduced = usePrefersReducedMotion()
  const sealRef = useRef<WaxSealHandle>(null)
  const doorsRef = useRef<InvitationDoorsHandle>(null)
  const curtainsRef = useRef<CurtainRevealHandle>(null)
  const heroRef = useRef<WeddingHeroHandle>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const gardenY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      stopAnimations()
    }
  }, [])

  function transition(from: InvitationPhase, to: InvitationPhase) {
    if (phaseRef.current !== from) return false
    if (order.indexOf(to) !== order.indexOf(from) + 1) return false
    phaseRef.current = to
    setPhase(to)
    return true
  }

  async function openInvitation() {
    if (running.current || phaseRef.current !== "CLOSED") return
    running.current = true
    transition("CLOSED", "SEAL_PRESSED")
    startMusic()
    playSealSound()

    try {
      await Promise.all([sealRef.current?.press(), doorsRef.current?.press()])
      if (!alive.current || !transition("SEAL_PRESSED", "SEAL_RELEASED")) return
      playOpeningSound()
      await sealRef.current?.release()
      if (!alive.current || !transition("SEAL_RELEASED", "DOORS_OPENING")) return
      await Promise.all([
        sealRef.current?.dismiss(),
        play(
          lightRef.current,
          { opacity: [0, 0.95, 0.85, 0], scaleX: [0.2, 1, 8, 14] },
          { duration: reduced ? 0.35 : 1.45, times: [0, 0.18, 0.62, 1], ease: "easeOut" },
        ),
        doorsRef.current?.open(reduced),
      ])
      if (!alive.current || !transition("DOORS_OPENING", "DOORS_OPEN")) return
      await nextFrame()
      if (!alive.current || !transition("DOORS_OPEN", "CURTAINS_OPENING")) return
      playCurtainSound()
      await curtainsRef.current?.open(reduced)
      if (!alive.current || !transition("CURTAINS_OPENING", "INVITATION_REVEALING")) return
      await heroRef.current?.reveal(reduced)
      if (!alive.current || !transition("INVITATION_REVEALING", "INVITATION_VISIBLE")) return
      onOpened()
    } catch {
      if (alive.current) running.current = false
    }
  }

  const gardenVisible = order.indexOf(phase) >= order.indexOf("DOORS_OPENING")
  return (
    <section
      id="invitation"
      ref={sectionRef}
      className={`relative min-h-dvh overflow-hidden ${
        phase === "INVITATION_VISIBLE" ? "" : "fixed inset-0 z-10"
      }`}
      aria-label="Wedding invitation"
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: gardenY }}>
        <motion.img
          src={weddingConfig.assets.garden}
          alt=""
          className="h-[112%] w-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: gardenVisible ? 1 : 0.72, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 1.5, ease: easeSoft }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(48,28,16,0.28),rgba(48,28,16,0.05)_38%,rgba(48,28,16,0.34))]" />
      <div className="absolute inset-0 z-0">
        <WeddingHero ref={heroRef} />
        <CurtainReveal ref={curtainsRef} />
        <div
          ref={lightRef}
          className="absolute top-[6%] bottom-[6%] left-1/2 z-[4] -ml-8 w-16 origin-center bg-[linear-gradient(90deg,transparent,rgba(255,236,196,0.9),transparent)] opacity-0 blur-[2px]"
        />
      </div>

      <InvitationDoors ref={doorsRef} />

      <div
        className={`absolute top-[30%] left-1/2 z-30 -translate-x-1/2 ${
          phase === "CLOSED" ? "" : "pointer-events-none"
        }`}
        aria-hidden={phase === "CLOSED" ? undefined : true}
      >
        <WaxSeal
          ref={sealRef}
          pulsing={phase === "CLOSED" && !reduced}
          interactive={phase === "CLOSED"}
          onOpen={() => void openInvitation()}
        />
      </div>
      {phase === "CLOSED" ? (
        <p className="pointer-events-none absolute bottom-[max(1.4rem,env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2 text-center">
          <span className="mx-auto mb-2 block h-px w-10 bg-[#8d6a34]/70" />
          <span className="font-label text-[0.62rem] tracking-[0.42em] text-[#6a3d2c]">TAP TO OPEN</span>
        </p>
      ) : null}

      {phase === "INVITATION_VISIBLE" ? (
        <button
          type="button"
          className="absolute bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-[#3a221c]"
          onClick={() =>
            document.getElementById("save-the-date")?.scrollIntoView({
              behavior: reduced ? "auto" : "smooth",
            })
          }
        >
          <span className="font-label text-[0.62rem] tracking-[0.36em]">SCROLL</span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      ) : null}
    </section>
  )
}

