"use client";
import { useRef, useState, type CSSProperties } from "react";
import GalleryImage from "./GalleryImage";
import InvitationHero from "./InvitationHero";
import { scrollToInvitationSection } from "@/lib/invitationNavigation";
import { isLocalPhoto } from "@/lib/localPhotos";
import { ArrowDown, CalendarPlus, MapPin } from "lucide-react";
import type { Invitation } from "@/types/invitation";
import { displayDate, calendarFile, eventDate } from "@/lib/share";
import { useCountdown } from "@/hooks/useCountdown";
import { paletteForTemplate } from "@/data/templatePalettes";
import { templates } from "@/data/templates";
import AudioPlayer, { type AudioHandle } from "./AudioPlayer";
import styles from "./RoyalWeddingWebsite.module.css";

function Flowers() {
  return (
    <svg viewBox="0 0 500 240" fill="none" aria-hidden="true">
      <g stroke="#77917a" strokeWidth="1.6">
        {[0, 1, 2, 3, 4].map((i) => (
          <g
            key={i}
            transform={`translate(${30 + i * 83} ${45 + (i % 2) * 40}) rotate(${i * 23 - 40})`}
          >
            <path d="M0 0q65 55 25 145" />
            {[20, 50, 80, 110].map((y) => (
              <g key={y}>
                <path d={`M30 ${y}q-60-40-56-7 16 28 56 7`} fill="#b4c2a4" />
                <path
                  d={`M32 ${y + 10}q55-43 52-12-12 27-52 12`}
                  fill="#d1d8bb"
                />
              </g>
            ))}
          </g>
        ))}
      </g>
      {[
        [75, 90, 1],
        [185, 60, 0.75],
        [292, 100, 1.1],
        [407, 55, 0.7],
        [436, 160, 0.8],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          {Array.from({ length: 9 }, (_, j) => (
            <ellipse
              key={j}
              cy="-19"
              rx="16"
              ry="30"
              transform={`rotate(${j * 40})`}
              fill={i % 2 ? "#f5d6c5" : "#e8b3b5"}
              stroke="#ce8e98"
              strokeWidth=".5"
            />
          ))}
          {Array.from({ length: 7 }, (_, j) => (
            <ellipse
              key={j}
              cy="-10"
              rx="9"
              ry="17"
              transform={`rotate(${j * 51})`}
              fill="#f8d5d0"
              stroke="#cf9597"
              strokeWidth=".7"
            />
          ))}
          <circle r="7" fill="#b28d49" />
        </g>
      ))}
    </svg>
  );
}
export default function RoyalWeddingWebsite({
  value,
  heroOnly = false,
  entrance = false,
  editor = false,
}: {
  value: Invitation;
  heroOnly?: boolean;
  entrance?: boolean;
  editor?: boolean;
}) {
  const [opened, setOpened] = useState(!entrance);
  const [response, setResponse] = useState("");
  const audio = useRef<AudioHandle>(null);
  const countdown = useCountdown(eventDate(value).getTime());
  const names = value.names.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
  const initials = names.map((n) => n.trim()[0]).join(" & ");
  const template = templates.find((t) => t.id === "royal-garden")!;
  const palette = paletteForTemplate(template, value);
  const original =
    (!value.palette || value.palette === "original") &&
    value.theme === template.theme;
  const direction = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value.venue + ", " + value.location)}`;
  return (
    <div
      className={`${styles.website} ${heroOnly ? styles.thumbnail : ""}`}
      style={
        {
          "--w-paper": original ? "#fffaf2" : palette.surface,
          "--w-ink": original ? "#772c45" : palette.ink,
          "--w-gold": value.accent,
          "--preview-bg": palette.background,
        } as CSSProperties
      }
    >
      {entrance && <AudioPlayer value={value} ref={audio} />}
      {!opened ? (
        <div className={styles.envelope}>
          <div className={styles.flowers}>
            <Flowers />
          </div>
          <p>A LETTER TO OUR FAVOURITE PEOPLE</p>
          <div className={styles.envelopeFold} />
          <button
            className={styles.seal}
            onClick={() => {
              setOpened(true);
              audio.current?.play();
            }}
            aria-label="Open wedding invitation"
          >
            <span>✧</span>
            <strong>{initials}</strong>
            <small>TAP TO OPEN</small>
          </button>
          <span className={styles.envelopeNote}>
            Something beautiful is about to begin.
          </span>
        </div>
      ) : (
        <>
          {!heroOnly && (
            <nav
              className={styles.navigation}
              aria-label="Wedding invitation sections"
            >
              <span>{initials}</span>
              <div>
                <a onClick={scrollToInvitationSection} href="#w-couple">
                  Our story
                </a>
                <a onClick={scrollToInvitationSection} href="#w-event">
                  Celebration
                </a>
                <a onClick={scrollToInvitationSection} href="#w-rsvp">
                  RSVP
                </a>
              </div>
            </nav>
          )}
          {!heroOnly ? (
            <InvitationHero template={template} value={value} />
          ) : (
            <section className={styles.hero}>
              <div className={styles.flowers}>
                <Flowers />
              </div>
              <div className={styles.flowersRight}>
                <Flowers />
              </div>
              <div className={styles.arch}>
                {!heroOnly && value.heroPhoto && (
                  <GalleryImage
                    className={styles.heroPhoto}
                    id={value.heroPhoto}
                    alt="Your celebration"
                  />
                )}
                <span className={styles.emblem}>✧</span>
                <p className={styles.eyebrow}>TOGETHER WITH OUR FAMILIES</p>
                <p className={styles.subtitle}>THE WEDDING CELEBRATION OF</p>
                <h2 aria-label={value.names}>
                  {names.map((name, i) => (
                    <span key={i}>
                      {i > 0 && <em>&</em>}
                      {name}
                    </span>
                  ))}
                </h2>
                <p className={styles.message}>{value.tagline}</p>
                <div className={styles.date}>
                  <span>◆</span>
                  {displayDate(value.date)}
                  <span>◆</span>
                </div>
                <p className={styles.venue}>{value.venue}</p>
                <span className={styles.flourish}>❧</span>
                {!heroOnly && (
                  <a
                    className={styles.discover}
                    onClick={scrollToInvitationSection}
                    href="#w-couple"
                  >
                    DISCOVER OUR CELEBRATION <ArrowDown size={14} />
                  </a>
                )}
              </div>
            </section>
          )}
          {!heroOnly && (
            <>
              <section id="w-couple" className={styles.couple}>
                <p className={styles.eyebrow}>THE BEGINNING OF FOREVER</p>
                <h2>
                  Two hearts. <em>One beautiful story.</em>
                </h2>
                <div className={styles.coupleNames}>
                  {names.map((name, i) => (
                    <div key={i}>
                      <span>{name[0]}</span>
                      <h3>{name}</h3>
                      <small>{i === 0 ? "WITH LOVE" : "AND ALWAYS"}</small>
                    </div>
                  ))}
                </div>
                {value.storyPhoto && (
                  <GalleryImage
                    className={styles.heroPhoto}
                    id={value.storyPhoto}
                    alt="Your story"
                  />
                )}
                <p className={styles.story}>{value.story}</p>
                <span className={styles.flourish}>— ♡ —</span>
              </section>
              {value.countdownEnabled && (
                <section className={styles.countdownSection}>
                  <p className={styles.eyebrow}>
                    EVERY SECOND BRINGS US CLOSER
                  </p>
                  <h2>
                    {countdown?.ended
                      ? "Our celebration is here."
                      : "Until we say “forever”."}
                  </h2>
                  <div className={styles.countdown}>
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
              <section id="w-event" className={styles.event}>
                <div>
                  <p className={styles.eyebrow}>
                    YOUR PRESENCE IS OUR GREATEST GIFT
                  </p>
                  <h2>
                    Join the <em>celebration.</em>
                  </h2>
                  <p>
                    With joyful hearts, we invite you to share in the beginning
                    of our next chapter.
                  </p>
                  <button onClick={() => calendarFile(value)}>
                    <CalendarPlus size={16} /> Save the date
                  </button>
                </div>
                <div className={styles.eventCard}>
                  <span className={styles.emblem}>✧</span>
                  <p>THE WEDDING</p>
                  <h3>{displayDate(value.date)}</h3>
                  <p>
                    {value.time} · UTC{value.timezone}
                  </p>
                  <div className={styles.rule} />
                  <h4>{value.venue}</h4>
                  <p>{value.location}</p>
                  <a href={direction} target="_blank" rel="noreferrer">
                    <MapPin size={15} /> Get directions ↗
                  </a>
                </div>
              </section>
              {!!value.gallery.length && (
                <section className={styles.gallerySection}>
                  <p className={styles.eyebrow}>
                    LITTLE MOMENTS. LIFELONG MEMORIES.
                  </p>
                  <h2>
                    A glimpse of <em>our celebration.</em>
                  </h2>
                  <p className={styles.galleryNote}>
                    {value.gallery.some(isLocalPhoto)
                      ? "Your celebration, in pictures."
                      : "Illustrated inspiration · sample gallery"}
                  </p>
                  <div className={styles.gallery}>
                    {value.gallery.map((id) => (
                      <figure key={id}>
                        <GalleryImage id={id} width={400} height={500} />
                        <figcaption>
                          {value.photoCaptions?.[id] ||
                            (isLocalPhoto(id) ? "Your moment" : id)}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}
              {value.rsvpEnabled && (
                <section id="w-rsvp" className={styles.rsvp}>
                  <div>
                    <p className={styles.eyebrow}>WE SAVED YOU A PLACE</p>
                    <h2>
                      Will you <em>join us?</em>
                    </h2>
                    <p>Your presence will make our day even more special.</p>
                    <span className={styles.flourish}>❦</span>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      setResponse(
                        `Thank you, ${data.get("name")}! Your demo response has been received on this page.`,
                      );
                    }}
                  >
                    <p className={styles.demoNote}>
                      {editor ? "Preview RSVP form" : "Demo RSVP"} · responses
                      are not saved or sent.
                    </p>
                    <label>
                      Your name
                      <input
                        name="name"
                        required
                        maxLength={100}
                        placeholder="Name of guest"
                      />
                    </label>
                    <div className={styles.formRow}>
                      <label>
                        Will you attend?
                        <select name="attendance">
                          <option>Joyfully accept</option>
                          <option>Regretfully decline</option>
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
                      A little wish
                      <textarea
                        name="message"
                        rows={2}
                        maxLength={500}
                        placeholder="Leave your wishes for the couple"
                      />
                    </label>
                    <button>Send demo RSVP ↗</button>
                    <p role="status">{response}</p>
                  </form>
                </section>
              )}
              <footer className={styles.closing}>
                <p className={styles.eyebrow}>WITH LOVE & GRATITUDE</p>
                <h2>
                  See you at <em>our forever.</em>
                </h2>
                <p>{value.names}</p>
                <span>{displayDate(value.date)}</span>
                <small>Made with WeInviteU · Create. Share. Celebrate.</small>
              </footer>
            </>
          )}
        </>
      )}
    </div>
  );
}
