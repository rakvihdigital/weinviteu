import type { Invitation, Template } from "@/types/invitation";
import { ArrowUpRight, Calendar, MapPin, Music2, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { occasionData } from "@/data/occasions";
import { invitationForTemplate } from "@/data/demoInvitation";

function DesignAccent({ design }: { design: Template["design"] }) {
  switch (design) {
    case "gazette":
      return (
        <div className="site-accent-gazette" aria-hidden="true">
          <div className="gazette-masthead-bar">
            <span>EDITION NO. 24</span>
            <span className="gazette-masthead-title">THE LOVE GAZETTE</span>
            <span>PRICELESS</span>
          </div>
          <div className="gazette-rule-double" />
        </div>
      );
    case "ticket":
      return (
        <div className="site-accent-ticket" aria-hidden="true">
          <div className="ticket-vip-tag">★ VIP ALL-ACCESS PASS · ADMIT ONE ★</div>
        </div>
      );
    case "blueprint":
      return (
        <div className="site-accent-blueprint" aria-hidden="true">
          <div className="blueprint-grid-overlay" />
          <div className="blueprint-spec-tag">FIG. 01 — ARCHITECTURAL PLAN · SCALE 1:1</div>
        </div>
      );
    case "vinyl":
      return (
        <div className="site-accent-vinyl" aria-hidden="true">
          <div className="vinyl-record-disc">
            <div className="vinyl-ring ring-1" />
            <div className="vinyl-ring ring-2" />
            <div className="vinyl-center-core">33⅓ RPM</div>
          </div>
        </div>
      );
    case "mandala":
      return (
        <div className="site-accent-mandala" aria-hidden="true">
          <div className="mandala-radiance-aura" />
          <span className="mandala-blessing">शुभ विवाह · CELEBRATION OF UNION</span>
        </div>
      );
    case "celestial":
      return (
        <div className="site-accent-celestial" aria-hidden="true">
          <div className="celestial-stars-orbit">
            <span className="star-dot s1" />
            <span className="star-dot s2" />
            <span className="star-dot s3" />
            <div className="celestial-orbit-ring" />
          </div>
          <span className="celestial-tag">☽ COSMIC ALIGNMENT · UNDER THE STARS</span>
        </div>
      );
    case "disco":
      return (
        <div className="site-accent-disco" aria-hidden="true">
          <div className="disco-sparkle-grid" />
          <span className="disco-neon-pill">✦ CELEBRATION AFTER DARK ✦</span>
        </div>
      );
    case "rainbow":
      return (
        <div className="site-accent-rainbow" aria-hidden="true">
          <div className="rainbow-arcs-wrap">
            <span className="arc arc-outer" />
            <span className="arc arc-mid" />
            <span className="arc arc-inner" />
          </div>
        </div>
      );
    case "swiss":
      return (
        <div className="site-accent-swiss" aria-hidden="true">
          <div className="swiss-grid-header">
            <span className="swiss-num">01</span>
            <span className="swiss-line" />
            <span className="swiss-mark">+</span>
          </div>
        </div>
      );
    case "editorial":
      return (
        <div className="site-accent-editorial" aria-hidden="true">
          <div className="editorial-issue-tag">VOLUME 01 // COUTURE INVITATION SUITE</div>
        </div>
      );
    case "botanical":
      return (
        <div className="site-accent-botanical" aria-hidden="true">
          <div className="botanical-arch-glow" />
          <span className="botanical-tag">🌿 BOTANICAL CONSERVATORY SUITE 🌿</span>
        </div>
      );
    case "palace":
    default:
      return (
        <div className="site-accent-palace" aria-hidden="true">
          <div className="palace-crest-badge">✦ ROYAL PALACE CELEBRATION ✦</div>
        </div>
      );
  }
}

export default function DigitalTemplatePreview({
  template,
  value,
}: {
  template: Template;
  value?: Invitation;
}) {
  const occasion = occasionData.find(
    (o) => o.id === (value?.occasion ?? template.category),
  );
  const inv = value
    ? {
        names: value.names || template.name,
        tagline: value.tagline || template.description,
        date: value.date,
        venue: value.venue || value.location,
        music: value.music,
      }
    : invitationForTemplate(template);

  const activeDesign = value?.design ?? template.design;
  const activeTheme = value?.theme ?? template.theme;
  const activeId = value?.templateId ?? template.id;

  return (
    <div
      className={`digital-site-preview digital-theme-${activeTheme} digital-design-${activeDesign}`}
    >
      {/* Device Browser Chrome Header */}
      <div className="digital-site-chrome">
        <div className="site-chrome-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="site-chrome-url">
          <Lock size={10} className="lock-icon" />
          <span className="url-text">weinvite.u/invite/{activeId}</span>
        </div>
        <div className="site-live-pill-wrap">
          <span className="site-live-dot" />
          <span className="site-live-tag">LIVE</span>
        </div>
      </div>

      {/* Website Content Viewport */}
      <div className="digital-site-viewport">
        {/* Subtle Specular Sheen Effect */}
        <div className="site-viewport-sheen" aria-hidden="true" />

        {/* Bespoke Header Graphic Accent */}
        <DesignAccent design={activeDesign} />

        <div className="site-hero-scene">
          <span className="site-motif-bg" aria-hidden="true">
            {template.motif}
          </span>

          <div className="site-meta-pill">
            <span className="occasion-mark">{occasion?.mark ?? "✦"}</span>
            <span>{occasion?.name ?? "CELEBRATION"}</span>
            <span className="meta-sep">•</span>
            <span className="template-style-label">{template.label}</span>
          </div>

          <div className="site-names-heading">{inv.names}</div>
          <p className="site-tagline-text">{inv.tagline}</p>

          {/* Gazette Stamp if gazette */}
          {template.design === "gazette" && (
            <div className="gazette-seal-stamp" aria-hidden="true">
              <span>SPECIAL</span>
              <strong>EDITION</strong>
              <span>KEEPSAKE</span>
            </div>
          )}

          {/* Mini Countdown Clock */}
          <div className="site-countdown-strip" aria-label="Countdown">
            <div className="cd-cell">
              <strong>142</strong>
              <span>DAYS</span>
            </div>
            <div className="cd-sep">:</div>
            <div className="cd-cell">
              <strong>08</strong>
              <span>HOURS</span>
            </div>
            <div className="cd-sep">:</div>
            <div className="cd-cell">
              <strong>45</strong>
              <span>MINS</span>
            </div>
          </div>

          {/* Venue & Date Details */}
          <div className="site-details-bar">
            <span className="detail-chip">
              <Calendar size={11} />
              <span>{inv.date}</span>
            </span>
            <span className="detail-chip">
              <MapPin size={11} />
              <span>{inv.venue}</span>
            </span>
          </div>

          {/* Ticket Perforated Stub Preview if ticket */}
          {template.design === "ticket" && (
            <div className="ticket-bottom-stub" aria-hidden="true">
              <div className="ticket-perforation">
                <span className="notch-left" />
                <span className="dash-line" />
                <span className="notch-right" />
              </div>
              <div className="ticket-stub-content">
                <div className="ticket-barcode">
                  <span /><span /><span /><span /><span /><span /><span /><span /><span />
                </div>
                <div className="ticket-stub-details">
                  <strong>SEAT 01A</strong>
                  <span>SEC: VIP PASS</span>
                </div>
              </div>
            </div>
          )}

          {/* Feature Badges */}
          <div className="site-feature-tags">
            <span className="feat-pill">
              <Music2 size={10} />
              <span>Soundtrack</span>
            </span>
            <span className="feat-pill">
              <CheckCircle2 size={10} />
              <span>RSVP</span>
            </span>
            <span className="feat-pill feat-entrance">
              <Sparkles size={10} />
              <span>3D Entrance</span>
            </span>
          </div>

          {/* Hover Enter Action */}
          <div className="site-enter-action">
            <span>Explore Invitation Website</span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}
