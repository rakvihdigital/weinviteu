"use client";
import { useRef, useState, useId, type CSSProperties } from "react";
import GalleryImage from "./GalleryImage";
import { scrollToInvitationSection } from "@/lib/invitationNavigation";
import { isLocalPhoto } from "@/lib/localPhotos";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarPlus,
  MapPin,
  Pencil,
} from "lucide-react";
import type { Invitation, Template } from "@/types/invitation";
import { websiteDirections } from "@/data/websiteDirections";
import { paletteForTemplate } from "@/data/templatePalettes";
import { calendarFile, displayDate, eventDate } from "@/lib/share";
import { useCountdown } from "@/hooks/useCountdown";
import AudioPlayer, { type AudioHandle } from "./AudioPlayer";
import InvitationHero from "./InvitationHero";
import InvitationArtwork from "./InvitationArtwork";
import styles from "./CompleteInvitationWebsite.module.css";
type Tab = "Event" | "Story" | "Gallery" | "Style" | "Extras";
export default function CompleteInvitationWebsite({
  template,
  value,
  entrance = false,
  onEdit,
}: {
  template: Template;
  value: Invitation;
  entrance?: boolean;
  onEdit?: (tab: Tab) => void;
}) {
  const direction = websiteDirections[template.id];
  const palette = paletteForTemplate(template, value);
  const [opened, setOpened] = useState(!entrance);
  const [response, setResponse] = useState("");
  const audio = useRef<AudioHandle>(null);
  const id = useId().replaceAll(":", "");
  const countdown = useCountdown(eventDate(value).getTime());
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value.date)
    ? displayDate(value.date)
    : "Choose your date";
  const links = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value.venue + ", " + value.location)}`;
  const edit = (tab: Tab) =>
    onEdit && (
      <button
        type="button"
        className={styles.edit}
        onClick={() => onEdit(tab)}
        aria-label={`Edit ${tab.toLowerCase()} section`}
      >
        <Pencil size={12} /> Edit
      </button>
    );
  return (
    <div
      className={styles.website}
      data-website={direction.layout}
      data-template-id={template.id}
      style={
        {
          "--site-bg": palette.background,
          "--site-ink": palette.ink,
          "--site-paper": palette.surface,
          "--site-accent": value.accent,
          "--art-paper": palette.surface,
          "--art-petal": "#e4b5aa",
          "--art-leaf": "#98aa88",
          "--art-gold": value.accent,
        } as CSSProperties
      }
    >
      {entrance && <AudioPlayer value={value} ref={audio} />}
      {!opened ? (
        <section className={styles.cover}>
          <div className={styles.coverArt}>
            <InvitationArtwork template={template} />
          </div>
          <div className={styles.coverCopy}>
            <p className={styles.eyebrow}>{direction.entrance}</p>
            <h1>{value.names}</h1>
            <p>{date}</p>
            <button
              className={styles.open}
              onClick={() => {
                setOpened(true);
                audio.current?.play();
              }}
            >
              {direction.open}
              <ArrowUpRight size={19} />
            </button>
            <small>A personal invitation, just for you.</small>
          </div>
        </section>
      ) : (
        <>
          <nav className={styles.nav} aria-label="Invitation sections">
            <span>
              {template.label} <b>{template.motif}</b>
            </span>
            <div>
              {value.story && (
                <a onClick={scrollToInvitationSection} href={`#${id}-story`}>
                  The story
                </a>
              )}
              <a onClick={scrollToInvitationSection} href={`#${id}-event`}>
                The details
              </a>
              {value.rsvpEnabled && (
                <a onClick={scrollToInvitationSection} href={`#${id}-rsvp`}>
                  RSVP
                </a>
              )}
            </div>
          </nav>
          <div className={styles.hero}>
            <InvitationHero template={template} value={value} />
            {edit("Event")}
            <a
              className={styles.scroll}
              onClick={scrollToInvitationSection}
              href={`#${id}-event`}
            >
              DISCOVER THE CELEBRATION <ArrowDown size={13} />
            </a>
          </div>
          <div className={styles.content}>
            {value.story && (
              <section className={styles.story} id={`${id}-story`}>
                <div className={styles.storyArt}>
                  {value.storyPhoto ? (
                    <GalleryImage id={value.storyPhoto} alt="Your story" />
                  ) : (
                    <InvitationArtwork template={template} />
                  )}
                </div>
                <div className={styles.storyCopy}>
                  <p className={styles.eyebrow}>A LITTLE MORE PERSONAL</p>
                  <h2>{direction.story}</h2>
                  <p>{value.story}</p>
                  <span className={styles.signature}>{value.names}</span>
                  {edit("Story")}
                </div>
              </section>
            )}
            {value.countdownEnabled && (
              <section className={styles.timer}>
                <div>
                  <p className={styles.eyebrow}>
                    {countdown?.ended
                      ? "THE MOMENT HAS ARRIVED"
                      : "THE ANTICIPATION IS PART OF THE JOY"}
                  </p>
                  <h2>
                    {countdown?.ended
                      ? "Let the celebration begin."
                      : "Something to look forward to."}
                  </h2>
                </div>
                <div className={styles.numbers}>
                  {(["days", "hours", "minutes", "seconds"] as const).map(
                    (unit) => (
                      <div key={unit}>
                        <strong>
                          {countdown
                            ? String(countdown[unit]).padStart(2, "0")
                            : "—"}
                        </strong>
                        <span>{unit}</span>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}
            <section className={styles.event} id={`${id}-event`}>
              <header>
                <p className={styles.eyebrow}>THE WHEN & THE WHERE</p>
                <h2>{direction.event}</h2>
                {edit("Event")}
              </header>
              <div className={styles.eventGrid}>
                <div className={styles.when}>
                  <span className={styles.sectionNumber}>
                    01 / SAVE THE DATE
                  </span>
                  <strong>{date}</strong>
                  <p>
                    {value.time} · UTC{value.timezone}
                  </p>
                  <button onClick={() => calendarFile(value)}>
                    <CalendarPlus size={16} /> Add to calendar
                  </button>
                </div>
                <div className={styles.where}>
                  <span className={styles.sectionNumber}>
                    02 / MEET US HERE
                  </span>
                  <strong>{value.venue || "Venue to be announced"}</strong>
                  <p>{value.location || "Location to be announced"}</p>
                  <a href={links} target="_blank" rel="noreferrer">
                    <MapPin size={16} /> Get directions{" "}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </section>
            {!!value.gallery.length && (
              <section className={styles.gallerySection}>
                <header>
                  <div>
                    <p className={styles.eyebrow}>
                      A GLIMPSE OF THE CELEBRATION
                    </p>
                    <h2>{direction.gallery}</h2>
                  </div>
                  {edit("Gallery")}
                </header>
                <div className={styles.gallery}>
                  {value.gallery.map((item, index) => (
                    <figure key={item}>
                      <GalleryImage id={item} width={480} height={600} />
                      <figcaption>
                        <span>0{index + 1}</span>
                        {value.photoCaptions?.[item] ||
                          (isLocalPhoto(item) ? "Your moment" : item)}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className={styles.note}>
                  {value.gallery.some(isLocalPhoto)
                    ? "Your celebration, in pictures."
                    : "Illustrated inspiration · sample gallery"}
                </p>
              </section>
            )}
            {value.rsvpEnabled && (
              <section className={styles.rsvp} id={`${id}-rsvp`}>
                <div className={styles.rsvpCopy}>
                  <p className={styles.eyebrow}>
                    IT WOULD NOT BE THE SAME WITHOUT YOU
                  </p>
                  <h2>{direction.rsvp}</h2>
                  <p>
                    Let us know if you can make it. We cannot wait to celebrate
                    with you.
                  </p>
                  {edit("Extras")}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    setResponse(
                      `Thank you, ${data.get("name")}! Your demo response is ${data.get("attendance") === "yes" ? "attending" : "unable to attend"} for ${data.get("guests")} guest(s).`,
                    );
                  }}
                >
                  <p className={styles.note}>
                    Demo RSVP · responses are not saved or sent.
                  </p>
                  <label>
                    Your name
                    <input
                      required
                      name="name"
                      maxLength={100}
                      placeholder="Your full name"
                    />
                  </label>
                  <div className={styles.formRow}>
                    <label>
                      Can you make it?
                      <select name="attendance">
                        <option value="yes">Yes, I will be there</option>
                        <option value="no">Sorry, I cannot attend</option>
                      </select>
                    </label>
                    <label>
                      Guests
                      <select name="guests">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    A message
                    <textarea
                      name="message"
                      maxLength={500}
                      rows={2}
                      placeholder="A little something for the hosts"
                    />
                  </label>
                  <button>
                    Send demo RSVP <ArrowUpRight size={16} />
                  </button>
                  <p role="status">{response}</p>
                </form>
              </section>
            )}
          </div>
          <footer className={styles.footer}>
            <span aria-hidden="true">{template.motif}</span>
            <h2>{direction.closing}</h2>
            <p>{value.names}</p>
            <small>
              {date} · {value.venue}
            </small>
            <a href="/designs">Made with WeInviteU ↗</a>
          </footer>
        </>
      )}
    </div>
  );
}
