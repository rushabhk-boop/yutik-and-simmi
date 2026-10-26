import { AnimatePresence, motion } from "framer-motion"
import { weddingConfig } from "../data/weddingConfig"
import { useCountdown } from "../hooks/useCountdown"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { easeSoft } from "../lib/animate"
import { SampleNote, Section } from "./ornaments"

const units = ["Days", "Hours", "Minutes", "Seconds"] as const

export function Countdown() {
  const remaining = useCountdown(weddingConfig.ceremony.startISO)
  const { copy, ceremony } = weddingConfig

  const spoken = remaining
    ? `${remaining.days} days, ${remaining.hours} hours, and ${remaining.minutes} minutes until the wedding`
    : copy.countdownComplete

  return (
    <Section id="countdown" title={copy.countdownHeading}>
      {remaining ? (
        <>
          <p className="sr-only" aria-live="polite">
            {spoken}
          </p>
          <div className="mx-auto grid max-w-md grid-cols-4 gap-2" aria-hidden="true">
            {units.map((label) => (
              <div
                key={label}
                className="border-t border-[#e7d7b8] px-1 py-3 text-center"
              >
                <RollNumber value={remaining[label.toLowerCase() as keyof typeof remaining]} />
                <p className="mt-2 font-label text-[0.55rem] tracking-[0.18em] text-brown uppercase sm:text-[0.68rem] sm:tracking-[0.24em]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mx-auto max-w-xl text-center font-serif text-2xl text-olive italic sm:text-3xl">
          {copy.countdownComplete}
        </p>
      )}
      {ceremony.isSampleSchedule ? <SampleNote>{copy.scheduleNote}</SampleNote> : null}
    </Section>
  )
}

function RollNumber({ value }: { value: number }) {
  const reduced = usePrefersReducedMotion()
  const text = String(value).padStart(2, "0")

  if (reduced) {
    return (
      <span className="block font-serif text-[clamp(1.35rem,5vw,2.15rem)] leading-none text-[#241410] tabular-nums">
        {text}
      </span>
    )
  }

  return (
    <span className="relative block h-[1.05em] overflow-hidden font-serif text-[clamp(1.35rem,5vw,2.15rem)] leading-none text-[#241410]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          className="block tabular-nums"
          initial={{ y: "75%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-75%", opacity: 0 }}
          transition={{ duration: 0.35, ease: easeSoft }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
