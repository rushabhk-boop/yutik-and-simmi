import { weddingConfig } from "../data/weddingConfig"

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

function fold(line: string) {
  const parts: string[] = []
  let rest = line
  parts.push(rest.slice(0, 73))
  rest = rest.slice(73)
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 72)}`)
    rest = rest.slice(72)
  }
  return parts.join("\r\n")
}

function utcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

/** Keeps the wall-clock time already stored with the +05:30 offset. */
function wallStamp(iso: string) {
  const [date, timePart] = iso.split("T")
  return `${date.replace(/-/g, "")}T${timePart.slice(0, 8).replace(/:/g, "")}`
}

export function buildWeddingIcs() {
  const { couple, ceremony, venue, copy } = weddingConfig
  const summary = `${couple.groom.fullName} & ${couple.bride.fullName} — Wedding Ceremony`
  const location = `${venue.name}, ${venue.address}, ${venue.locality}`
  const description = `${copy.invite} ${venue.note} ${copy.scheduleNote}`
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yutik and Simmi//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "X-LIC-LOCATION:Asia/Kolkata",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:yutik-simmi-wedding-ceremony-2027@invitation",
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART;TZID=${ceremony.timezone}:${wallStamp(ceremony.startISO)}`,
    `DTEND;TZID=${ceremony.timezone}:${wallStamp(ceremony.endISO)}`,
    fold(`SUMMARY:${escapeIcs(summary)}`),
    fold(`LOCATION:${escapeIcs(location)}`),
    fold(`DESCRIPTION:${escapeIcs(description)}`),
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Yutik and Simmi's wedding is tomorrow",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `${lines.join("\r\n")}\r\n`
}

export function downloadWeddingCalendar() {
  const file = new Blob([buildWeddingIcs()], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.download = "Yutik-and-Simmi-Wedding.ics"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
