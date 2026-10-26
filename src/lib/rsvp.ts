import { weddingConfig } from "../data/weddingConfig"

export type RsvpPayload = {
  guestName: string
  phone: string
  attending: boolean
  guestCount: number
  events: string[]
  message: string
}

export type RsvpResult =
  | { ok: true; mode: "demo" | "saved" }
  | { ok: false; reason: "duplicate" | "network" }

const STORAGE_KEY = "yutik-simmi-rsvp-replies"

type StoredReply = RsvpPayload & { createdAt: string; mode: "demo" | "saved" }

function duplicateKey(payload: Pick<RsvpPayload, "guestName" | "phone">) {
  const phone = payload.phone.replace(/\D/g, "")
  return `${payload.guestName.trim().toLowerCase()}|${phone}`
}

function readStored(): StoredReply[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredReply[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStored(replies: StoredReply[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(replies))
}

export function isRsvpHosted() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export function hasLocalReply(payload: Pick<RsvpPayload, "guestName" | "phone">) {
  const key = duplicateKey(payload)
  return readStored().some((reply) => duplicateKey(reply) === key)
}

export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResult> {
  if (hasLocalReply(payload)) return { ok: false, reason: "duplicate" }

  if (!isRsvpHosted()) {
    const replies = readStored()
    replies.push({ ...payload, createdAt: new Date().toISOString(), mode: "demo" })
    writeStored(replies)
    return { ok: true, mode: "demo" }
  }

  const url = import.meta.env.VITE_SUPABASE_URL!.replace(/\/$/, "")
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY!
  let response: Response
  try {
    response = await fetch(`${url}/rest/v1/${weddingConfig.rsvp.supabaseTable}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        guest_name: payload.guestName,
        phone: payload.phone || null,
        attending: payload.attending,
        guest_count: payload.guestCount,
        events: payload.events,
        message: payload.message || null,
      }),
      signal: AbortSignal.timeout(12000),
    })
  } catch {
    return { ok: false, reason: "network" }
  }

  if (response.status === 409) return { ok: false, reason: "duplicate" }
  if (!response.ok) return { ok: false, reason: "network" }

  try {
    const replies = readStored()
    replies.push({ ...payload, createdAt: new Date().toISOString(), mode: "saved" })
    writeStored(replies)
  } catch {
    /* The hosted reply succeeded even if this browser cannot remember it. */
  }
  return { ok: true, mode: "saved" }
}
