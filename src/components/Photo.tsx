import { useState } from "react"

type PhotoProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function Photo({ src, alt, className = "", priority = false }: PhotoProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`bg-[linear-gradient(160deg,#f5ebdd,#f6d7c8)] ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
