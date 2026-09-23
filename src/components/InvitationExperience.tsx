"use client";
import { useState, useRef, useCallback, type CSSProperties } from "react";
import GalleryImage from "./GalleryImage";
import { isLocalPhoto } from "@/lib/localPhotos";
import Link from "next/link";
import { CalendarPlus, MapPin, Pause, Copy, Send, Play } from "lucide-react";
import CinematicEntrance from "./CinematicEntrance";
import AudioPlayer, { type AudioHandle } from "./AudioPlayer";
import GalleryDialog from "./GalleryDialog";
import { getDesign } from "@/data/designs";
import type { Invitation } from "@/types/invitation";
import InvitationCard from "./InvitationCard";
import RoyalWeddingWebsite from "./RoyalWeddingWebsite";
import CompleteInvitationWebsite from "./CompleteInvitationWebsite";
import { websiteDirections } from "@/data/websiteDirections";
import GalleryTemplatePreview from "./GalleryTemplatePreview";
import { templates } from "@/data/templates";
import { paletteForTemplate } from "@/data/templatePalettes";
import { useCountdown } from "@/hooks/useCountdown";
import {
  calendarFile,
  displayDate,
  eventDate,
  invitationUrl,
} from "@/lib/share";
export default function InvitationExperience({ value }: { value: Invitation }) {
  const template = templates.find((item) => item.id === value.templateId);
  const palette = template ? paletteForTemplate(template, value) : undefined;
  const countdown = useCountdown(eventDate(value).getTime());
  const [opened, setOpened] = useState(false);
  const [notice, setNotice] = useState("");
  const [rsvp, setRsvp] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [film, setFilm] = useState(false);
  const audio = useRef<AudioHandle>(null);
  const finishOpening = useCallback(() => setOpened(true), []);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value.venue + ", " + value.location)}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(invitationUrl(value));
      setNotice("Invitation link copied.");
    } catch {
      setNotice("Copy the invitation URL from your browser address bar.");
    }
  }
  if (value.templateId === "royal-garden")
    return <RoyalWeddingWebsite value={value} entrance />;
  if (template && websiteDirections[template.id])
    return (
      <CompleteInvitationWebsite template={template} value={value} entrance />
    );
  return (
    <main
      className={`experience cinematic-experience guest-design-${getDesign(value)} theme-${value.theme} font-${value.font}`}
      style={
        {
          "--accent": value.accent,
          "--guest-bg": palette?.background,
          "--guest-ink": palette?.ink,
          "--guest-paper": palette?.surface,
        } as CSSProperties
      }
    >
      <div className="invite-top">
        <Link href="/" className="logo">
          WeInviteU<span>✦</span>
        </Link>
        <span>MADE WITH LOVE</span>
      </div>
      <AudioPlayer value={value} ref={audio} />
      {!opened ? (
        <CinematicEntrance
          value={value}
          onOpen={finishOpening}
          onMusic={() => audio.current?.play()}
        />
      ) : (
        <div className="opened-invitation">
          <section className="invite-hero">
            {template ? (
              <GalleryTemplatePreview template={template} value={value} />
            ) : (
              <InvitationCard value={value} interactive />
            )}
            <p className="scroll-note">SCROLL TO DISCOVER ↓</p>
          </section>
          {value.countdownEnabled && (
            <section className="invite-section">
              <p className="eyebrow">THE WAIT IS PART OF THE MAGIC</p>
              <h2>
                {countdown?.ended
                  ? "The celebration is here."
                  : "Counting down to our day."}
              </h2>
              <div className="countdown">
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
          {value.story && (
            <section className="invite-section story">
              <span className="flourish">❦</span>
              <p className="eyebrow">OUR STORY</p>
              <h2>Every moment led to this.</h2>
              <p className="story-copy">{value.story}</p>
            </section>
          )}
          {value.gallery.length > 0 && (
            <section className="invite-section">
              <p className="eyebrow">LITTLE MOMENTS, BIG FEELINGS</p>
              <h2>A glimpse of our celebration.</h2>
              <p className="muted">
                {value.gallery.some(isLocalPhoto)
                  ? "Your celebration, in pictures."
                  : "Illustrated gallery · sample images"}
              </p>
              <div className="photo-grid">
                {value.gallery.map((id, i) => (
                  <button
                    key={id}
                    className="photo-button"
                    onClick={() => setLightbox(id)}
                    aria-label={`Enlarge ${isLocalPhoto(id) ? "uploaded photo" : id + " illustration"}`}
                  >
                    <GalleryImage
                      id={id}
                      width={640}
                      height={800}
                      loading="lazy"
                    />
                    <span>
                      0{i + 1} / {isLocalPhoto(id) ? "Your moment" : id}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
          <section className="invite-section details">
            <div>
              <p className="eyebrow">SAVE THE DATE</p>
              <h2>We saved you a place.</h2>
              <p className="large-date">{displayDate(value.date)}</p>
              <p>
                {value.time} · UTC{value.timezone}
              </p>
              <button
                className="button secondary"
                onClick={() => calendarFile(value)}
              >
                <CalendarPlus size={17} /> Add to calendar
              </button>
            </div>
            <div className="venue-card">
              <MapPin size={25} />
              <h3>{value.venue || "Venue to be announced"}</h3>
              <p>{value.location || "Location to be announced"}</p>
              <div className="map-art" aria-hidden="true">
                <span>✦</span>
              </div>
              <a
                className="button"
                href={directions}
                target="_blank"
                rel="noreferrer"
              >
                Maps & directions ↗
              </a>
            </div>
          </section>
          <section className="invite-section">
            <p className="eyebrow">SET THE MOOD</p>
            <h2>A celebration in motion.</h2>
            <div className={`motion-film ${film ? "is-playing" : ""}`}>
              <div className="film-flower">❦</div>
              <p>{value.names}</p>
              <span>{value.tagline}</span>
            </div>
            <button className="button secondary" onClick={() => setFilm(!film)}>
              {film ? <Pause size={16} /> : <Play size={16} />}{" "}
              {film ? "Pause" : "Play"} motion demo
            </button>
            <p className="muted">
              Animated artwork preview. Replace with your own video in a future
              release.
            </p>
          </section>
          {value.rsvpEnabled && (
            <section className="invite-section rsvp-section">
              <p className="eyebrow">YOUR PRESENCE IS OUR PRESENT</p>
              <h2>Will you join us?</h2>
              <p>This is a demo RSVP. Responses are not saved or sent.</p>
              <form
                className="rsvp-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  setRsvp(
                    data.get("attendance") === "yes"
                      ? `Thank you, ${data.get("name")}! Your demo response is “attending” for ${data.get("guests")} guest(s).`
                      : `Thank you, ${data.get("name")}. Your demo response is “unable to attend”.`,
                  );
                }}
              >
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Enter your name"
                  />
                </label>
                <label>
                  Can you attend?
                  <select name="attendance">
                    <option value="yes">Joyfully accept</option>
                    <option value="no">Regretfully decline</option>
                  </select>
                </label>
                <label>
                  Number of guests
                  <select name="guests">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button className="button">Send demo RSVP ↗</button>
              </form>
              <p role="status">{rsvp}</p>
            </section>
          )}
          <section className="invite-section closing">
            <span className="flourish">♡</span>
            <h2>Can’t wait to celebrate with you.</h2>
            <p>{value.names}</p>
            <div className="button-row">
              <button className="button secondary" onClick={copy}>
                <Copy size={16} /> Copy invitation link
              </button>
              <button
                className="button secondary"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(value.names + " — You are invited! " + invitationUrl(value))}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Send size={16} /> WhatsApp
              </button>
            </div>
            <p className="muted">
              Demo link includes invitation details. Share only information
              intended for guests.
            </p>
          </section>
        </div>
      )}
      <p className="status-line" role="status">
        {notice}
      </p>
      <footer className="invite-footer">
        Create. Share. Celebrate.{" "}
        <Link href="/create">Create your own with WeInviteU ↗</Link>
      </footer>
      {lightbox && (
        <GalleryDialog image={lightbox} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}
