import { weddingConfig } from "../data/weddingConfig"

export function WeddingFooter() {
  const { couple, copy } = weddingConfig

  return (
    <footer id="celebrate" className="bg-[#fbf6ef] px-6 py-20 text-center text-[#241410]">
      <p className="font-label text-[0.62rem] tracking-[0.32em] text-[#7a5420] uppercase">{copy.blessing}</p>
      <h2 className="mx-auto mt-4 max-w-md font-serif text-[clamp(1.7rem,4vw,2.25rem)] leading-tight font-medium">
        {copy.finaleTitle}
      </h2>
      <p className="mt-4 font-serif text-xl">{copy.finaleLine}</p>
      <p className="mt-6 font-script text-5xl leading-none">{couple.shortNames}</p>
      <p className="mt-6 font-label text-[0.66rem] tracking-[0.24em] text-[#5c4638] uppercase">{copy.finaleSign}</p>
    </footer>
  )
}
