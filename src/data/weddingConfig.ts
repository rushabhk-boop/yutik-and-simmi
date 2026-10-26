/**
 * Single source of truth for Yutik & Simmi's invitation.
 * Edit names, dates, venues, and copy here — components read this file only.
 *
 * SAMPLE DATA
 * Dates, timings, venue, parent names, and dress guidance below are temporary
 * demonstration details. They are labelled on the page wherever a guest could
 * mistake them for confirmed plans. Replace them before sharing the invitation.
 */

export type WeddingEvent = {
  id: string
  title: string
  /** Inclusive start, with the Asia/Kolkata offset. */
  startISO: string
  /** Sample end time. Replace it with the confirmed finish. */
  endISO: string
  dateLabel: string
  startTime: string
  endTime: string
  description: string
  venue: string
  image: string
  imageAlt: string
  mapsUrl: string
}

export type Photograph = {
  src: string
  alt: string
}

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Ahmedabad%2C%20Gujarat%2C%20India"

const sampleVenueName = "Grand Celebration Palace"
const sampleLocality = "Ahmedabad, Gujarat, India"

export const weddingConfig = {
  couple: {
    groom: {
      firstName: "Yutik",
      lastName: "Kalal",
      fullName: "Yutik Kalal",
    },
    bride: {
      firstName: "Simmi",
      lastName: "Padiyar",
      fullName: "Simmi Padiyar",
    },
    shortNames: "Yutik & Simmi",
  },
  families: {
    /** Hidden on the invitation while isPlaceholder is true. */
    groom: {
      isPlaceholder: true,
      label: "Groom's parents",
      names: "Add the groom's parents' names",
    },
    bride: {
      isPlaceholder: true,
      label: "Bride's parents",
      names: "Add the bride's parents' names",
    },
  },
  ceremony: {
    isSampleSchedule: true,
    startISO: "2027-02-14T19:00:00+05:30",
    endISO: "2027-02-14T22:00:00+05:30",
    timezone: "Asia/Kolkata",
    day: "14",
    month: "February",
    year: "2027",
    dateLabel: "14 February 2027",
    weekday: "Sunday",
    timeLabel: "7:00 PM",
  },
  venue: {
    isPlaceholder: true,
    name: sampleVenueName,
    locality: sampleLocality,
    /** No street address is invented. Replace this before sharing. */
    address: "Street address to be announced",
    mapsUrl,
    note: "Sample venue — replace the name, address, and map link before sharing.",
  },
  events: [
    {
      id: "haldi",
      title: "Haldi",
      startISO: "2027-02-11T10:00:00+05:30",
      endISO: "2027-02-11T12:00:00+05:30",
      dateLabel: "Thursday, 11 February 2027",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      description:
        "A morning of turmeric, marigolds, and laughter as the celebrations begin.",
      venue: `${sampleVenueName}, ${sampleLocality}`,
      image: "/assets/event-haldi.jpg",
      imageAlt: "Marigold garlands wrapped around a celebration pillar",
      mapsUrl,
    },
    {
      id: "mehendi",
      title: "Mehendi",
      startISO: "2027-02-12T16:00:00+05:30",
      endISO: "2027-02-12T19:00:00+05:30",
      dateLabel: "Friday, 12 February 2027",
      startTime: "4:00 PM",
      endTime: "7:00 PM",
      description:
        "An afternoon of henna, music, and the quiet joy of getting ready.",
      venue: `${sampleVenueName}, ${sampleLocality}`,
      image: "/assets/event-mehendi.jpg",
      imageAlt: "Hands painted with intricate bridal mehndi",
      mapsUrl,
    },
    {
      id: "sangeet",
      title: "Sangeet",
      startISO: "2027-02-13T19:00:00+05:30",
      endISO: "2027-02-13T23:00:00+05:30",
      dateLabel: "Saturday, 13 February 2027",
      startTime: "7:00 PM",
      endTime: "11:00 PM",
      description:
        "An evening of music, dance, and stories from both families.",
      venue: `${sampleVenueName}, ${sampleLocality}`,
      image: "/assets/event-sangeet.jpg",
      imageAlt: "A floral wedding stage with hanging decorations",
      mapsUrl,
    },
    {
      id: "wedding",
      title: "Wedding Ceremony",
      startISO: "2027-02-14T19:00:00+05:30",
      endISO: "2027-02-14T22:00:00+05:30",
      dateLabel: "Sunday, 14 February 2027",
      startTime: "7:00 PM",
      endTime: "10:00 PM",
      description:
        "The ceremony in which Yutik and Simmi are married, surrounded by the people they love.",
      venue: `${sampleVenueName}, ${sampleLocality}`,
      image: "/assets/event-wedding.jpg",
      imageAlt: "A brass bowl of marigolds with a lit diya",
      mapsUrl,
    },
    {
      id: "reception",
      title: "Reception",
      startISO: "2027-02-15T19:30:00+05:30",
      endISO: "2027-02-15T23:00:00+05:30",
      dateLabel: "Monday, 15 February 2027",
      startTime: "7:30 PM",
      endTime: "11:00 PM",
      description: "Dinner, dancing, and a toast to the life just begun.",
      venue: `${sampleVenueName}, ${sampleLocality}`,
      image: "/assets/event-reception.jpg",
      imageAlt: "A tray of lit clay diyas",
      mapsUrl,
    },
  ] satisfies WeddingEvent[],
  dressCode: {
    isSample: true,
    women: {
      title: "Women",
      guidance: "Elegant pastel traditional attire.",
      image: "/assets/dress-women.jpg",
      alt: "Fashion illustration of a blush and gold lehenga",
    },
    men: {
      title: "Men",
      guidance: "Royal ethnic wear.",
      image: "/assets/dress-men.jpg",
      alt: "Fashion illustration of an ivory sherwani with a gold stole",
    },
    note: "Sample dress guidance — update this before sharing.",
  },
  gifts: {
    heading: "Your Blessings Are Our Greatest Gift",
    message:
      "Your love, blessings, and presence are the greatest gifts we could ever ask for.",
    /** Shown only when this string is not empty. */
    details: "",
  },
  photographs: [] as Photograph[],
  rsvp: {
    heading: "We Would Love to Celebrate With You",
    supabaseTable: "rsvps",
    maxGuests: 6,
    maxMessageLength: 400,
  },
  music: {
    src: "/assets/background-music.wav",
    volume: 0.38,
  },
  assets: {
    texture: "/assets/invitation-texture.jpg",
    waxSeal: "/assets/wax-seal.jpg",
    curtain: "/assets/curtain-silk.jpg",
    garden: "/assets/haveli-courtyard.jpg",
    gate: "/assets/haveli-gate.jpg",
    bouquet: "/assets/floral-bouquet.jpg",
    share: "/assets/og-share.jpg",
  },
  copy: {
    eyebrow: "We're Getting Married",
    blessing: "शुभ विवाह",
    tagline: "Two families, two hearts, one beautiful beginning.",
    invite:
      "Together with our families, we joyfully invite you to celebrate the beginning of our forever.",
    invited: "You're Invited!",
    countdownHeading: "Counting Down to Forever",
    countdownComplete:
      "The day is here. Thank you for celebrating the beginning of forever with us.",
    eventsHeading: "Wedding Celebrations",
    venueHeading: "Where We Celebrate",
    dressHeading: "Dress to Celebrate",
    finaleTitle: "Two Hearts. One Beautiful Journey.",
    finaleLine: "We Can't Wait to Celebrate With You!",
    finaleSign: "With Love, The Families",
    scheduleNote:
      "These dates and times are temporary demonstration details.",
  },
  seo: {
    title: "Yutik & Simmi | Wedding Invitation",
    description:
      "Join Yutik Kalal and Simmi Padiyar as they celebrate their beautiful wedding journey.",
  },
} as const

export type WeddingConfig = typeof weddingConfig
