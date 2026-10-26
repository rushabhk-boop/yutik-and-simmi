import { motion, type HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { easeSoft } from "../lib/animate"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

export function CornerFloral({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-hidden="true">
      <path
        d="M8 82C22 58 24 36 46 16"
        fill="none"
        stroke="#C8A46A"
        strokeWidth="0.8"
      />
      <path
        d="M8 82C30 66 40 46 62 34"
        fill="none"
        stroke="#C8A46A"
        strokeWidth="0.6"
      />
      <path
        d="M28 58c8-10 12-10 18-2-8 1-12 6-18 2Z"
        fill="#E9B9AA"
      />
      <path
        d="M40 42c7-8 12-7 16 0-7 0-11 4-16 0Z"
        fill="#F6D7C8"
      />
      <path
        d="M18 70c6-7 10-6 14 1-6 0-10 3-14-1Z"
        fill="#C8A46A"
        opacity="0.85"
      />
      <circle cx="52" cy="24" r="3.2" fill="none" stroke="#C8A46A" strokeWidth="0.7" />
      <circle cx="52" cy="24" r="1" fill="#C8A46A" />
      <path d="M46 16c6 2 8 6 8 6" fill="none" stroke="#75604D" strokeWidth="0.5" />
    </svg>
  )
}

export function DrawnRule({ className = "" }: { className?: string }) {
  return <div className={`mx-auto mt-4 h-px w-10 bg-[#c8a46a] ${className}`} aria-hidden="true" />
}

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeSoft } },
}

type SectionProps = {
  id: string
  title: string
  eyebrow?: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, eyebrow, children, className = "" }: SectionProps) {
  const reduced = usePrefersReducedMotion()
  const heading = (
    <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-9">
      {eyebrow ? (
        <p className="mb-2 font-label text-[0.62rem] tracking-[0.38em] text-brown uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-[clamp(1.7rem,4vw,2.25rem)] leading-tight font-medium text-[#241410]">
        {title}
      </h2>
      <DrawnRule />
    </div>
  )

  if (reduced) {
    return (
      <section id={id} className={`relative px-5 py-14 sm:px-8 sm:py-20 ${className}`}>
        {heading}
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={`relative px-5 py-14 sm:px-8 sm:py-20 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
    >
      <motion.div variants={rise}>{heading}</motion.div>
      <motion.div variants={rise}>{children}</motion.div>
    </motion.section>
  )
}

export function SampleNote({ children }: { children: string }) {
  return <p className="mx-auto mt-6 max-w-md text-center font-serif text-sm italic text-brown">{children}</p>
}

type ButtonProps = {
  children: ReactNode
  href?: string
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
  variant?: "solid" | "line"
  className?: string
} & Omit<HTMLMotionProps<"button">, "children" | "onClick" | "type">

export function GoldButton({
  children,
  href,
  type = "button",
  onClick,
  disabled = false,
  variant = "solid",
  className = "",
}: ButtonProps) {
  const reduced = usePrefersReducedMotion()
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 border px-7 font-label text-[0.68rem] tracking-[0.28em] uppercase transition-colors duration-300 ${
    variant === "solid"
      ? "rounded-full border-transparent bg-[#241410] text-ivory hover:bg-[#3a2a22]"
      : "rounded-full border-terracotta/40 bg-transparent text-terracotta hover:bg-terracotta/10"
  } ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`

  const motionProps = reduced
    ? {}
    : {
        whileHover: { y: -3 },
        whileTap: { scale: 0.97 },
        transition: { duration: 0.25 },
      }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...motionProps}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={classes} {...motionProps}>
      {children}
    </motion.button>
  )
}
