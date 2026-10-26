import { weddingConfig } from "../data/weddingConfig"
import { Photo } from "./Photo"
import { SampleNote, Section } from "./ornaments"

export function DressCode() {
  const { dressCode, copy } = weddingConfig
  const looks = [dressCode.women, dressCode.men]
  return (
    <Section id="dress-code" title={copy.dressHeading}>
      <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
        {looks.map((look) => (
          <figure key={look.title} className="text-center">
            <div>
              <Photo src={look.image} alt={look.alt} className="mx-auto aspect-[3/4] w-full object-contain" />
            </div>
            <figcaption className="mt-5">
              <p className="font-label text-[0.68rem] tracking-[0.32em] text-gold-deep uppercase">{look.title}</p>
              <p className="mt-2 font-serif text-2xl text-[#241410] italic">{look.guidance}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      {dressCode.isSample ? <SampleNote>{dressCode.note}</SampleNote> : null}
    </Section>
  )
}
