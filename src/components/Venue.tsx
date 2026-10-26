import { Navigation } from "lucide-react"
import { weddingConfig } from "../data/weddingConfig"
import { Photo } from "./Photo"
import { GoldButton, SampleNote, Section } from "./ornaments"

export function Venue() {
  const { venue, copy } = weddingConfig
  return (
    <Section id="venue" title={copy.venueHeading}>
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <Photo
          src={weddingConfig.assets.garden}
          alt="Illustrated palace garden. Venue photography will replace this once the location is confirmed."
          className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
        />
        <div className="text-center md:text-left">
          <p className="font-label text-[0.66rem] tracking-[0.32em] text-brown uppercase">The celebration</p>
          <h3 className="mt-3 font-serif text-4xl leading-none text-[#241410] sm:text-5xl">{venue.name}</h3>
          <p className="mt-4 font-serif text-xl text-brown">{venue.locality}</p>
          <p className="mt-2 text-base text-olive/80">{venue.address}</p>
          <div className="mt-8">
            <GoldButton href={venue.mapsUrl}>
              <Navigation size={15} aria-hidden="true" />
              Directions
            </GoldButton>
          </div>
          {venue.isPlaceholder ? <SampleNote>{venue.note}</SampleNote> : null}
        </div>
      </div>
    </Section>
  )
}
