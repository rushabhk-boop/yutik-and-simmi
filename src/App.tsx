import { useEffect, useState } from "react"
import { InvitationOpening } from "./components/InvitationOpening"
import { Countdown } from "./components/Countdown"
import { DressCode } from "./components/DressCode"
import { GiftsAndBlessings } from "./components/GiftsAndBlessings"
import { MusicController } from "./components/MusicController"
import { Photographs } from "./components/Photographs"
import { RSVP } from "./components/RSVP"
import { SaveTheDate } from "./components/SaveTheDate"
import { Venue } from "./components/Venue"
import { WeddingEvents } from "./components/WeddingEvents"
import { WeddingFooter } from "./components/WeddingFooter"

export default function App() {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    document.body.classList.toggle("invitation-locked", !opened)
    document.body.classList.toggle("invitation-open", opened)
    return () => {
      document.body.classList.remove("invitation-locked", "invitation-open")
    }
  }, [opened])

  return (
    <>
      <MusicController />
      <main>
        <InvitationOpening onOpened={() => setOpened(true)} />
        <div inert={opened ? undefined : true}>
          <SaveTheDate />
          <Countdown />
          <WeddingEvents />
          <Venue />
          <DressCode />
          <GiftsAndBlessings />
          <Photographs />
          <RSVP />
          <WeddingFooter />
        </div>
      </main>
    </>
  )
}
