import { useId, useState, type FormEvent, type ReactNode } from "react"
import { weddingConfig } from "../data/weddingConfig"
import { hasLocalReply, isRsvpHosted, submitRsvp } from "../lib/rsvp"
import { GoldButton, Section } from "./ornaments"

type Attendance = "" | "yes" | "no"
type Status = "idle" | "submitting" | "success" | "duplicate" | "error"

type FormState = {
  name: string
  phone: string
  attendance: Attendance
  guests: string
  events: string[]
  message: string
  company: string
}

type Errors = Partial<Record<"name" | "phone" | "attendance" | "guests" | "events" | "message", string>>

const emptyForm: FormState = {
  name: "",
  phone: "",
  attendance: "",
  guests: "1",
  events: [],
  message: "",
  company: "",
}

function validate(form: FormState): Errors {
  const errors: Errors = {}
  const name = form.name.trim()
  if (!/^[\p{L}\s.'-]{2,80}$/u.test(name)) {
    errors.name = "Please enter the guest's full name."
  }
  const phone = form.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 8 || digits.length > 15 || !/^[+\d][\d\s()-]{6,20}$/.test(phone)) {
      errors.phone = "Enter a valid phone number, or leave it blank."
    }
  }
  if (form.attendance !== "yes" && form.attendance !== "no") {
    errors.attendance = "Please let us know if you can attend."
  }
  if (form.attendance === "yes") {
    const guests = Number(form.guests)
    if (!Number.isInteger(guests) || guests < 1 || guests > weddingConfig.rsvp.maxGuests) {
      errors.guests = `Choose between 1 and ${weddingConfig.rsvp.maxGuests} guests.`
    }
    if (form.events.length === 0) errors.events = "Choose the celebrations you will join."
  }
  if (form.message.length > weddingConfig.rsvp.maxMessageLength) {
    errors.message = `Please keep the message under ${weddingConfig.rsvp.maxMessageLength} characters.`
  }
  return errors
}

export function RSVP() {
  const baseId = useId()
  const hosted = isRsvpHosted()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [mode, setMode] = useState<"demo" | "saved" | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function toggleEvent(id: string) {
    setForm((current) => ({
      ...current,
      events: current.events.includes(id)
        ? current.events.filter((eventId) => eventId !== id)
        : [...current.events, id],
    }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "submitting") return
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle")
      return
    }
    if (form.company) {
      setMode("demo")
      setStatus("success")
      return
    }

    const payload = {
      guestName: form.name.trim(),
      phone: form.phone.trim(),
      attending: form.attendance === "yes",
      guestCount: form.attendance === "yes" ? Number(form.guests) : 0,
      events: form.attendance === "yes" ? form.events : [],
      message: form.message.trim(),
    }

    if (hasLocalReply(payload)) {
      setStatus("duplicate")
      return
    }

    setStatus("submitting")
    const result = await submitRsvp(payload)
    if (!result.ok) {
      setStatus(result.reason === "duplicate" ? "duplicate" : "error")
      return
    }
    setMode(result.mode)
    setStatus("success")
  }

  return (
    <Section id="rsvp" title={weddingConfig.rsvp.heading}>
      <div className="mx-auto max-w-xl border-t border-[#e7d7b8] px-1 py-8 sm:px-4">
        {!hosted ? (
          <p className="mb-6 border border-gold/40 bg-cream/70 px-4 py-3 text-center font-serif text-sm leading-relaxed text-brown">
            Preview mode. Replies stay on this device only. They are not sent to the families until a Supabase guestbook is connected.
          </p>
        ) : null}

        {status === "success" ? (
          <Success mode={mode} name={form.name.trim()} />
        ) : (
          <form onSubmit={(event) => void onSubmit(event)} noValidate>
            <div className="absolute top-auto -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor={`${baseId}-company`}>Company</label>
              <input
                id={`${baseId}-company`}
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
              />
            </div>

            <Field label="Full name" id={`${baseId}-name`} error={errors.name}>
              <input
                id={`${baseId}-name`}
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className={inputClass}
                aria-invalid={Boolean(errors.name)}
                required
              />
            </Field>

            <Field label="Phone number" id={`${baseId}-phone`} error={errors.phone} optional>
              <input
                id={`${baseId}-phone`}
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={inputClass}
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>

            <fieldset className="mt-7">
              <legend className="font-label text-[0.66rem] tracking-[0.24em] text-brown uppercase">
                Will you attend?
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(
                  [
                    ["yes", "Yes, with joy"],
                    ["no", "Unable to attend"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={form.attendance === value}
                    onClick={() => update("attendance", value)}
                    className={`min-h-12 border px-3 font-serif text-lg transition ${
                      form.attendance === value
                        ? "border-olive bg-olive text-ivory"
                        : "border-gold/70 text-olive hover:bg-gold/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.attendance ? <ErrorText id={`${baseId}-attendance`}>{errors.attendance}</ErrorText> : null}
            </fieldset>

            {form.attendance === "yes" ? (
              <>
                <Field label="Number of guests" id={`${baseId}-guests`} error={errors.guests}>
                  <select
                    id={`${baseId}-guests`}
                    value={form.guests}
                    onChange={(event) => update("guests", event.target.value)}
                    className={inputClass}
                    aria-invalid={Boolean(errors.guests)}
                  >
                    {Array.from({ length: weddingConfig.rsvp.maxGuests }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </Field>

                <fieldset className="mt-7">
                  <legend className="font-label text-[0.66rem] tracking-[0.24em] text-brown uppercase">
                    Celebrations you will attend
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {weddingConfig.events.map((event) => {
                      const selected = form.events.includes(event.id)
                      return (
                        <button
                          key={event.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleEvent(event.id)}
                          className={`min-h-10 border px-3 font-serif text-base ${
                            selected ? "border-olive bg-cream text-olive" : "border-gold/60 text-brown"
                          }`}
                        >
                          {event.title}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    className="mt-3 font-label text-[0.62rem] tracking-[0.18em] text-brown uppercase underline decoration-gold underline-offset-4"
                    onClick={() =>
                      update(
                        "events",
                        form.events.length === weddingConfig.events.length
                          ? []
                          : weddingConfig.events.map((event) => event.id),
                      )
                    }
                  >
                    {form.events.length === weddingConfig.events.length ? "Clear all" : "All celebrations"}
                  </button>
                  {errors.events ? <ErrorText>{errors.events}</ErrorText> : null}
                </fieldset>
              </>
            ) : null}

            <Field label="A note for the couple" id={`${baseId}-message`} error={errors.message} optional>
              <textarea
                id={`${baseId}-message`}
                value={form.message}
                maxLength={weddingConfig.rsvp.maxMessageLength}
                rows={4}
                onChange={(event) => update("message", event.target.value)}
                className={`${inputClass} resize-none`}
                aria-invalid={Boolean(errors.message)}
              />
            </Field>

            {status === "duplicate" ? (
              <p className="mt-6 font-serif text-base text-[#8d4d48]" role="status">
                A reply for this name is already recorded on this device.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="mt-6 font-serif text-base text-[#8d4d48]" role="alert">
                The reply could not be sent. Please try again in a moment.
              </p>
            ) : null}

            <div className="mt-8 text-center">
              <GoldButton type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending" : "Send reply"}
              </GoldButton>
            </div>
          </form>
        )}
      </div>
    </Section>
  )
}

function Success({ mode, name }: { mode: "demo" | "saved" | null; name: string }) {
  const { couple } = weddingConfig
  return (
    <div className="text-center" role="status">
      <p className="font-script text-5xl text-olive">{name.split(" ")[0]}</p>
      <p className="mt-4 font-serif text-2xl text-olive italic">Thank you for replying.</p>
      {mode === "saved" ? (
        <p className="mt-3 font-serif text-lg leading-relaxed text-brown">
          Your reply has been received by {couple.shortNames}'s families.
        </p>
      ) : (
        <p className="mt-3 font-serif text-lg leading-relaxed text-brown">
          This reply is stored on this device as a preview. It has not been sent to the families.
        </p>
      )}
    </div>
  )
}

const inputClass =
  "mt-2 w-full border-0 border-b border-gold/80 bg-transparent py-2 font-serif text-xl text-olive outline-none focus:border-olive"

function Field({
  label,
  id,
  error,
  optional = false,
  children,
}: {
  label: string
  id: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="mt-7">
      <label htmlFor={id} className="font-label text-[0.66rem] tracking-[0.24em] text-brown uppercase">
        {label}
        {optional ? <span className="tracking-normal text-brown/70"> · optional</span> : null}
      </label>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  )
}

function ErrorText({ children }: { children: string; id?: string }) {
  return <p className="mt-2 font-serif text-sm text-[#8d4d48]">{children}</p>
}
