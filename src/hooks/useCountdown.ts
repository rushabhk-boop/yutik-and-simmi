import { useEffect, useState } from "react"

export type Remaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getRemaining(targetIso: string, now = Date.now()): Remaining | null {
  const diff = new Date(targetIso).getTime() - now
  if (diff <= 0) return null
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState<Remaining | null>(() => getRemaining(targetIso))

  useEffect(() => {
    let id = 0
    const tick = () => {
      const next = getRemaining(targetIso)
      setRemaining(next)
      if (!next) window.clearInterval(id)
    }
    tick()
    id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetIso])

  return remaining
}
