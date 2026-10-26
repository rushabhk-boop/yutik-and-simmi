import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

const petals = [
  { left: "6%", delay: 0, duration: 16, drift: 18, rotate: 40, size: 18 },
  { left: "18%", delay: 2.2, duration: 18, drift: -16, rotate: -30, size: 14 },
  { left: "34%", delay: 0.8, duration: 15, drift: 12, rotate: 70, size: 16 },
  { left: "52%", delay: 3.1, duration: 19, drift: -20, rotate: 20, size: 12 },
  { left: "68%", delay: 1.4, duration: 17, drift: 14, rotate: -50, size: 18 },
  { left: "80%", delay: 2.6, duration: 16, drift: -12, rotate: 55, size: 15 },
  { left: "90%", delay: 0.4, duration: 20, drift: 10, rotate: -20, size: 13 },
  { left: "44%", delay: 4, duration: 18, drift: 22, rotate: 15, size: 11 },
]

export function FloatingPetals({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return null

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {petals.map((petal) => (
        <motion.svg
          key={petal.left}
          viewBox="0 0 24 36"
          className="absolute"
          style={{ left: petal.left, width: petal.size, height: petal.size * 1.5 }}
          initial={{ y: "-12%", opacity: 0, rotate: 0 }}
          animate={{
            y: ["-12%", "108%"],
            x: [0, petal.drift, 0],
            opacity: [0, 0.75, 0.75, 0],
            rotate: [0, petal.rotate],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M12 2C16 8 20 14 18 22C16 30 12 34 12 34C12 34 8 30 6 22C4 14 8 8 12 2Z"
            fill="#E9B9AA"
          />
          <path d="M12 7C13 14 13 22 12 31" stroke="#C8A46A" strokeWidth="0.6" fill="none" />
        </motion.svg>
      ))}
    </div>
  )
}
