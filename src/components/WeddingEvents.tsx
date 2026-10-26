import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { weddingConfig } from "../data/weddingConfig"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { easeSoft } from "../lib/animate"
import { Photo } from "./Photo"
import { SampleNote, Section } from "./ornaments"

export function WeddingEvents() {
  const reduced = usePrefersReducedMotion()
  const { events, copy, ceremony } = weddingConfig

  return (
    <Section id="celebrations" title={copy.eventsHeading}>
      <ol className="relative mx-auto max-w-5xl space-y-10 sm:space-y-14">
        <div className="absolute top-2 bottom-2 left-3 w-px bg-gold/70 sm:left-1/2" aria-hidden="true" />
        {events.map((event, index) => {
          const flip = index % 2 === 1
          const body = (
            <article className="grid items-center gap-5 sm:grid-cols-2 sm:gap-10">
              <Photo
                src={event.image}
                alt={event.imageAlt}
                className={`aspect-[4/3] w-full object-cover ${event.id === "sangeet" ? "object-[center_30%]" : "object-center"} ${flip ? "sm:order-2" : ""}`}
              />
              <div className={flip ? "sm:order-1 sm:text-right" : ""}>
                <p className="font-label text-[0.66rem] tracking-[0.32em] text-gold-deep uppercase">{event.dateLabel}</p>
                <h3 className="mt-1 font-serif text-[1.85rem] leading-none text-[#241410]">{event.title}</h3>
                <p className="mt-2 font-serif text-xl text-brown">
                  {event.startTime} – {event.endTime}
                </p>
                <p className="mt-3 font-serif text-lg leading-relaxed text-olive/90">{event.description}</p>
                <p className="mt-3 text-sm text-brown">{event.venue}</p>
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-2 font-label text-[0.66rem] tracking-[0.22em] text-olive uppercase underline decoration-gold decoration-1 underline-offset-4 ${flip ? "sm:flex-row-reverse" : ""}`}
                >
                  <MapPin size={14} aria-hidden="true" />
                  View map
                </a>
              </div>
            </article>
          )

          return (
            <li key={event.id} className="relative pl-10 sm:pl-0">
              <span className="absolute top-3 left-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#c8a46a] sm:left-1/2" />
              {reduced ? (
                body
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.05, ease: easeSoft }}
                >
                  {body}
                </motion.div>
              )}
            </li>
          )
        })}
      </ol>
      {ceremony.isSampleSchedule ? <SampleNote>{copy.scheduleNote}</SampleNote> : null}
    </Section>
  )
}
