import { weddingConfig } from "../data/weddingConfig"
import { Section } from "./ornaments"

export function GiftsAndBlessings() {
  const { gifts } = weddingConfig
  return (
    <Section id="blessings" title={gifts.heading}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-serif text-xl leading-relaxed text-[#5c4638] sm:text-2xl">{gifts.message}</p>
        {gifts.details ? <p className="mt-6 font-serif text-lg text-brown">{gifts.details}</p> : null}
      </div>
    </Section>
  )
}
