import { weddingConfig } from "../data/weddingConfig"
import { Photo } from "./Photo"
import { Section } from "./ornaments"

export function Photographs() {
  const photos = weddingConfig.photographs
  if (photos.length === 0) return null

  return (
    <Section id="photographs" title="Photographs">
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <Photo key={photo.src} src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
        ))}
      </div>
    </Section>
  )
}
