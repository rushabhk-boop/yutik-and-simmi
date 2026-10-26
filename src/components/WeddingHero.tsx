import { forwardRef, useImperativeHandle, useRef } from "react"
import { weddingConfig } from "../data/weddingConfig"
import { easeSoft, play } from "../lib/animate"

export type WeddingHeroHandle = {
  reveal: (reduced: boolean) => Promise<void>
}

export const WeddingHero = forwardRef<WeddingHeroHandle>(function WeddingHero(_, ref) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { couple, ceremony, copy, families } = weddingConfig
  const showFamilies = !families.groom.isPlaceholder && !families.bride.isPlaceholder

  useImperativeHandle(ref, () => ({
    async reveal(reduced: boolean) {
      const root = rootRef.current
      if (!root) return
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
      const step = reduced ? 0.04 : 0.18
      const duration = reduced ? 0.2 : 0.7
      const jobs = items.map((item, index) =>
        play(
          item,
          { opacity: [0, 1], y: [16, 0] },
          { duration, delay: index * step, ease: easeSoft },
        ),
      )
      const divider = root.querySelector<HTMLElement>("[data-reveal-divider]")
      const line = root.querySelector<SVGGeometryElement>("[data-draw]")
      const dividerIndex = divider ? items.indexOf(divider) : 4
      if (line) {
        jobs.push(
          play(
            line,
            { strokeDashoffset: 0 },
            { duration: reduced ? 0.2 : 0.9, delay: Math.max(dividerIndex, 0) * step, ease: "easeInOut" },
          ),
        )
      }
      await Promise.all(jobs)
    },
  }))

  return (
    <div ref={rootRef} className="absolute inset-0 z-[1] flex items-center justify-center px-3 text-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[84%] w-[min(74vw,24rem)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,248,239,0.96)_0%,rgba(255,248,239,0.9)_48%,rgba(255,248,239,0.45)_68%,transparent_80%)]" />
      <div className="relative w-[min(68vw,22rem)] text-[#241410]">
        <p data-reveal className="reveal-item font-script text-[clamp(1.55rem,5vw,2.4rem)] leading-none">
          {copy.eyebrow}
        </p>
        <p data-reveal className="reveal-item mt-2 font-label text-[0.58rem] tracking-[0.38em] text-[#7a5420] uppercase">
          {copy.blessing}
        </p>
        <h1 className="mt-4 text-[#241410]">
          <span data-reveal className="reveal-item block">
            <span className="block font-script text-[clamp(2.7rem,11vw,5.6rem)] leading-[0.78]">
              {couple.groom.firstName}
            </span>
            <span className="mt-1 block font-script text-[clamp(1.7rem,6.2vw,3.1rem)] leading-none">
              {couple.groom.lastName}
            </span>
          </span>
          <span data-reveal className="reveal-item my-1 block font-script text-[clamp(1.8rem,5vw,2.8rem)] leading-none text-[#7a5420]">
            &
          </span>
          <span data-reveal className="reveal-item block">
            <span className="block font-script text-[clamp(2.7rem,11vw,5.6rem)] leading-[0.78]">
              {couple.bride.firstName}
            </span>
            <span className="mt-1 block font-script text-[clamp(1.7rem,6.2vw,3.1rem)] leading-none">
              {couple.bride.lastName}
            </span>
          </span>
        </h1>
        <div data-reveal data-reveal-divider className="reveal-item mx-auto mt-4 w-32">
          <svg viewBox="0 0 160 16" className="h-3.5 w-full text-[#8d6a34]" aria-hidden="true">
            <path
              data-draw
              d="M4 8 H68 M92 8 H156 M80 8 l6 -5 l6 5 l-6 5 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
        </div>
        <p data-reveal className="reveal-item mt-3 font-serif text-[1.05rem] leading-snug text-[#241410]">
          {ceremony.weekday}, {ceremony.dateLabel}
          <span className="mt-0.5 block text-[0.95rem] text-[#5c3a28]">{ceremony.timeLabel}</span>
        </p>
        <p data-reveal className="reveal-item mx-auto mt-2 max-w-[16rem] font-serif text-[1.02rem] leading-snug text-[#241410] italic">
          {copy.tagline}
        </p>
        {showFamilies ? (
          <p data-reveal className="reveal-item mt-3 font-serif text-sm text-olive">
            With the blessings of {families.groom.names} and {families.bride.names}
          </p>
        ) : null}
      </div>
    </div>
  )
})
