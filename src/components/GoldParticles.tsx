import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

const particles = [
  { left: "8%", top: "18%", size: 3, delay: 0.2, duration: 7.5 },
  { left: "18%", top: "72%", size: 2, delay: 1.1, duration: 8.4 },
  { left: "78%", top: "16%", size: 3, delay: 0.4, duration: 9 },
  { left: "88%", top: "64%", size: 2, delay: 1.6, duration: 7.2 },
  { left: "30%", top: "10%", size: 2, delay: 0.8, duration: 8 },
  { left: "62%", top: "82%", size: 3, delay: 0.1, duration: 9.4 },
  { left: "48%", top: "8%", size: 2, delay: 1.3, duration: 7.8 },
  { left: "12%", top: "46%", size: 2, delay: 0.6, duration: 10 },
  { left: "84%", top: "38%", size: 3, delay: 1.8, duration: 8.8 },
  { left: "70%", top: "28%", size: 2, delay: 0.3, duration: 7.6 },
  { left: "24%", top: "86%", size: 2, delay: 1.4, duration: 9.2 },
  { left: "56%", top: "22%", size: 2, delay: 0.9, duration: 8.2 },
]

export function GoldParticles() {
  const reduced = usePrefersReducedMotion()
  if (reduced) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-[#e7d3a4]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            boxShadow: "0 0 8px rgba(200,164,106,0.85)",
          }}
          initial={{ opacity: 0.15, y: 0 }}
          animate={{ opacity: [0.15, 0.85, 0.2], y: [0, -18, 0] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
