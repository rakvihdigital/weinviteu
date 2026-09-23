"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { EntranceStyle } from "./PalaceScene";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Lock,
  MapPin,
  Music2,
  Sparkles,
  Volume2,
  CheckCircle2,
} from "lucide-react";

interface EntrancePreviewProps {
  variant: EntranceStyle;
  opened: boolean;
  onToggle: () => void;
}

interface WebsiteThemeData {
  slug: string;
  domain: string;
  badge: string;
  names: string;
  monogram: string;
  headline: string;
  tagline: string;
  dateStr: string;
  targetDate: string;
  venueName: string;
  venueCity: string;
  hint: string;
  schedule: { time: string; event: string; detail: string }[];
  accentColor: string;
}

const websiteThemes: Record<EntranceStyle, WebsiteThemeData> = {
  palace: {
    slug: "arjun-priya",
    domain: "weinvite.u/invite/arjun-priya",
    badge: "ROYAL HERITAGE DIGITAL INVITATION",
    names: "Arjun & Priya",
    monogram: "A & P",
    headline: "Together with our families, we invite you to celebrate our wedding.",
    tagline: "An unforgettable evening of royal traditions, music, and love.",
    dateStr: "Saturday, 12 December 2027",
    targetDate: "2027-12-12T18:00:00",
    venueName: "The Grand Ballroom, The Leela Palace",
    venueCity: "Bengaluru, Karnataka",
    hint: "Draw back the velvet curtains",
    accentColor: "#cca449",
    schedule: [
      { time: "4:30 PM", event: "Royal Welcome & High Tea", detail: "Palace Courtyard" },
      { time: "6:00 PM", event: "Varmala & Wedding Ceremony", detail: "The Royal Mandap" },
      { time: "8:00 PM", event: "Grand Banquet & Sangeet", detail: "Grand Ballroom" },
    ],
  },
  garden: {
    slug: "aarav-ananya",
    domain: "weinvite.u/invite/aarav-ananya",
    badge: "BOTANICAL SUITE DIGITAL INVITATION",
    names: "Aarav & Ananya",
    monogram: "A & A",
    headline: "Love in full bloom. Join us as we begin our forever.",
    tagline: "An intimate open-air celebration surrounded by blossoms and candlelight.",
    dateStr: "Wednesday, 24 February 2027",
    targetDate: "2027-02-24T16:30:00",
    venueName: "The Conservatory & Glasshouse Gardens",
    venueCity: "Bangalore, India",
    hint: "Break the wax seal · Open website",
    accentColor: "#587b5c",
    schedule: [
      { time: "4:00 PM", event: "Garden Arrival & Mocktails", detail: "Olive Grove" },
      { time: "5:00 PM", event: "Sunset Vows & Exchange", detail: "Glasshouse Lawn" },
      { time: "7:00 PM", event: "Dinner Under the Stars", detail: "Conservatory Terrace" },
    ],
  },
  celestial: {
    slug: "kabir-tara",
    domain: "weinvite.u/invite/kabir-tara",
    badge: "COSMIC STARDUST DIGITAL INVITATION",
    names: "Kabir & Tara",
    monogram: "K & T",
    headline: "Written in the stars. Two souls bound across constellations.",
    tagline: "Witness the alignment of two hearts under an infinite night sky.",
    dateStr: "Thursday, 18 November 2027",
    targetDate: "2027-11-18T19:00:00",
    venueName: "Stargazer Observatory Pavilion",
    venueCity: "Dark Sky Reserve, Coorg",
    hint: "Align the stars · Launch website",
    accentColor: "#9c80df",
    schedule: [
      { time: "6:30 PM", event: "Starlight Welcome Drinks", detail: "Observatory Deck" },
      { time: "7:30 PM", event: "Celestial Ceremony", detail: "Starlight Dome" },
      { time: "9:00 PM", event: "Cosmic Soiree & Dancing", detail: "Nebula Lounge" },
    ],
  },
};

export default function EntrancePreview({
  variant,
  opened,
  onToggle,
}: EntrancePreviewProps) {
  const theme = websiteThemes[variant];
  const stageRef = useRef<HTMLDivElement>(null);
  const [internalTab, setInternalTab] = useState<"overview" | "schedule" | "venue" | "rsvp">("overview");
  const [rsvpState, setRsvpState] = useState<"none" | "yes" | "no">("none");

  // Live ticking countdown
  const [timeLeft, setTimeLeft] = useState({ days: 446, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const target = new Date(theme.targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [theme.targetDate]);

  return (
    <div
      ref={stageRef}
      className={`digital-stage-wrapper stage-${variant} ${opened ? "is-open" : "is-closed"}`}
    >
      {/* THE LIVE DIGITAL INVITATION WEBSITE MOCKUP */}
      <div className="digital-device-frame">
        {/* Browser / Device Chrome Header */}
        <div className="browser-chrome-bar">
          <div className="browser-traffic-lights" aria-hidden="true">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>

          <div className="browser-url-pill">
            <Lock size={10} className="url-lock-icon" />
            <span className="url-text">{theme.domain}</span>
            <span className="url-live-tag">LIVE</span>
          </div>

          <Link
            href="/invite/arjun-priya"
            className="browser-external-btn"
            title="Open complete website in full window"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Interior Scrollable Digital Website Screen */}
        <div className={`digital-site-viewport theme-site-${variant}`}>
          {/* Website Top Brand Header */}
          <header className="site-brand-header">
            <div className="site-brand-logo">
              <span className="logo-sparkle">✦</span>
              <strong>WeInviteU</strong>
              <span className="logo-badge">INVITATION</span>
            </div>
            <div className="site-guest-pill">
              <span className="guest-dot" />
              <span>GUEST PREVIEW</span>
            </div>
          </header>

          {/* Website Navigation Tabs */}
          <nav className="site-nav-pills" aria-label="Invitation Sections">
            <button
              type="button"
              className={internalTab === "overview" ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setInternalTab("overview");
              }}
            >
              Overview
            </button>
            <button
              type="button"
              className={internalTab === "schedule" ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setInternalTab("schedule");
              }}
            >
              Schedule
            </button>
            <button
              type="button"
              className={internalTab === "venue" ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setInternalTab("venue");
              }}
            >
              Venue
            </button>
            <button
              type="button"
              className={internalTab === "rsvp" ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setInternalTab("rsvp");
              }}
            >
              RSVP
            </button>
          </nav>

          {/* TAB 1: OVERVIEW HERO */}
          {internalTab === "overview" && (
            <div className="site-content-tab tab-overview">
              <div className="site-monogram-emblem">
                <span className="monogram-glow" />
                <span className="monogram-text">{theme.monogram}</span>
              </div>

              <span className="site-eyebrow">{theme.badge}</span>
              <h3 className="site-couple-names">{theme.names}</h3>
              <p className="site-headline">{theme.headline}</p>

              {/* Real-time Countdown Timer Widget */}
              <div className="site-countdown-card">
                <span className="countdown-kicker">COUNTING DOWN TO OUR DAY</span>
                <div className="countdown-numbers-row">
                  <div className="countdown-unit">
                    <strong>{timeLeft.days}</strong>
                    <small>DAYS</small>
                  </div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-unit">
                    <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                    <small>HOURS</small>
                  </div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-unit">
                    <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                    <small>MINS</small>
                  </div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-unit tick-unit">
                    <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                    <small>SECS</small>
                  </div>
                </div>
              </div>

              {/* Date & Venue Snippet */}
              <div className="site-info-snippet">
                <div className="snippet-item">
                  <Calendar size={13} />
                  <span>{theme.dateStr}</span>
                </div>
                <div className="snippet-item">
                  <MapPin size={13} />
                  <span>{theme.venueName}</span>
                </div>
              </div>

              {/* CTA Action Row */}
              <div className="site-action-row">
                <button
                  type="button"
                  className="site-btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInternalTab("rsvp");
                  }}
                >
                  <Heart size={13} />
                  <span>RSVP to Invitation</span>
                </button>
                <Link
                  href="/invite/arjun-priya"
                  className="site-btn-secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Open Full Experience ↗</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE */}
          {internalTab === "schedule" && (
            <div className="site-content-tab tab-schedule">
              <div className="tab-header">
                <Clock size={16} />
                <h4>Event Itinerary &amp; Timeline</h4>
              </div>
              <div className="schedule-timeline">
                {theme.schedule.map((item, idx) => (
                  <div key={idx} className="timeline-card">
                    <div className="timeline-time-badge">
                      <span>{item.time}</span>
                    </div>
                    <div className="timeline-details">
                      <strong>{item.event}</strong>
                      <small>{item.detail}</small>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="site-btn-primary full-width"
                onClick={(e) => {
                  e.stopPropagation();
                  setInternalTab("overview");
                }}
              >
                Back to Overview
              </button>
            </div>
          )}

          {/* TAB 3: VENUE & DIRECTIONS */}
          {internalTab === "venue" && (
            <div className="site-content-tab tab-venue">
              <div className="tab-header">
                <MapPin size={16} />
                <h4>Celebration Location</h4>
              </div>
              <div className="venue-detail-box">
                <strong>{theme.venueName}</strong>
                <p>{theme.venueCity}</p>
                <div className="venue-map-visual" aria-hidden="true">
                  <span className="map-pin-pulse">📍</span>
                  <span className="map-label">Interactive Map Link</span>
                </div>
                <Link
                  href="/invite/arjun-priya"
                  className="site-btn-primary full-width"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Open in Google Maps ↗</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE RSVP */}
          {internalTab === "rsvp" && (
            <div className="site-content-tab tab-rsvp">
              <div className="tab-header">
                <Heart size={16} />
                <h4>Will you join our celebration?</h4>
              </div>

              {rsvpState === "none" ? (
                <div className="rsvp-interactive-box">
                  <p className="rsvp-desc">
                    Celebrate with {theme.names} on {theme.dateStr}. Let us know if you can attend.
                  </p>
                  <div className="rsvp-choice-buttons">
                    <button
                      type="button"
                      className="rsvp-choice-btn accept"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRsvpState("yes");
                      }}
                    >
                      <span>Joyfully Accept ♡</span>
                    </button>
                    <button
                      type="button"
                      className="rsvp-choice-btn decline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRsvpState("no");
                      }}
                    >
                      <span>Regretfully Decline</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rsvp-confirmed-box">
                  <CheckCircle2 size={28} className="confirmed-icon" />
                  <strong>
                    {rsvpState === "yes"
                      ? "Thank you! You are on the guest list."
                      : "Thank you for letting us know."}
                  </strong>
                  <p>Demo RSVP recorded for {theme.names}&apos;s wedding.</p>
                  <button
                    type="button"
                    className="site-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRsvpState("none");
                    }}
                  >
                    Change Response
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Website Footer Strip */}
          <footer className="site-mini-footer">
            <span>Crafted with WeInviteU · Interactive Website</span>
            <Link
              href="/invite/arjun-priya"
              className="footer-link"
              onClick={(e) => e.stopPropagation()}
            >
              Full Screen ↗
            </Link>
          </footer>
        </div>
      </div>

      {/* THEATRICAL ENTRANCE 1: PALACE VELVET CURTAINS */}
      {variant === "palace" && (
        <div
          className="theatre-entrance-overlay velvet-curtains-cover"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          aria-label={opened ? "Replay velvet curtain opening" : theme.hint}
          aria-expanded={opened}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          {/* Left Curtain */}
          <div className="curtain-sheet curtain-left">
            <div className="curtain-pleats" />
            <div className="curtain-gold-border" />
            <div className="curtain-fringe-ribbon" />
            <div className="curtain-hanging-tassel tassel-left">
              <span className="cord" />
              <span className="knot" />
              <span className="skirt" />
            </div>
          </div>

          {/* Right Curtain */}
          <div className="curtain-sheet curtain-right">
            <div className="curtain-pleats" />
            <div className="curtain-gold-border" />
            <div className="curtain-fringe-ribbon" />
            <div className="curtain-hanging-tassel tassel-right">
              <span className="cord" />
              <span className="knot" />
              <span className="skirt" />
            </div>
          </div>

          {/* Center Monogram Medallion */}
          <div className="curtain-center-crest">
            <span className="crest-crown">♔</span>
            <strong className="crest-monogram">{theme.monogram}</strong>
            <small className="crest-label">ROYAL ENTRANCE</small>
            <span className="crest-prompt">{opened ? "↺ Replay" : "Click to Open Website"}</span>
          </div>
        </div>
      )}

      {/* THEATRICAL ENTRANCE 2: GARDEN WAX-SEALED DECKLE ENVELOPE */}
      {variant === "garden" && (
        <div
          className="theatre-entrance-overlay garden-envelope-cover"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          aria-label={opened ? "Replay envelope opening" : theme.hint}
          aria-expanded={opened}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <div className="deckle-envelope-case">
            <div className="envelope-top-flap" />
            <div className="envelope-silk-ribbon" />
            <div className="envelope-wax-medallion">
              <span className="wax-sprig">❦</span>
              <strong className="wax-initials">{theme.monogram}</strong>
              <small className="wax-action">{opened ? "↺ Replay" : "Break Seal"}</small>
            </div>
            <div className="envelope-lower-pocket" />
          </div>
        </div>
      )}

      {/* THEATRICAL ENTRANCE 3: CELESTIAL ORBITAL ASTROLABE */}
      {variant === "celestial" && (
        <div
          className="theatre-entrance-overlay celestial-astrolabe-cover"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          aria-label={opened ? "Replay celestial alignment" : theme.hint}
          aria-expanded={opened}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <div className="cosmic-observatory-disk">
            <div className="astrolabe-ring ring-outer" />
            <div className="astrolabe-ring ring-inner" />
            <div className="lunar-orb-center">
              <span className="lunar-star">✦</span>
              <strong className="lunar-monogram">{theme.monogram}</strong>
              <small className="lunar-action">{opened ? "↺ Replay" : "Align Stars"}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
