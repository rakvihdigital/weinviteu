import RoyalWeddingWebsite from "./RoyalWeddingWebsite";
import { invitationForTemplate } from "@/data/demoInvitation";
import type { Template, Invitation } from "@/types/invitation";
import type { CSSProperties } from "react";
import { paletteForTemplate } from "@/data/templatePalettes";
import InvitationArtwork from "./InvitationArtwork";
import { displayDate } from "@/lib/share";
import { ArrowUpRight } from "lucide-react";
import { occasionData } from "@/data/occasions";
import styles from "./GalleryTemplatePreview.module.css";

const looks: Record<
  string,
  { title: string; subtitle: string; detail: string; mark: string }
> = {
  "birthday-bloom": {
    title: "Hello, sunshine.",
    subtitle: "ANOTHER TRIP AROUND THE SUN",
    detail: "A birthday made for good company.",
    mark: "✷",
  },
  "ivory-sonnet": {
    title: "Us. Always.",
    subtitle: "THE WEDDING EDITION",
    detail: "One beautiful beginning. A lifetime together.",
    mark: "&",
  },
  "moonlit-yes": {
    title: "It was always you.",
    subtitle: "WRITTEN IN THE STARS",
    detail: "Our next chapter begins here.",
    mark: "✧",
  },
  "engagement-sonnet": {
    title: "A very easy yes.",
    subtitle: "A NOTE FROM THE HEART",
    detail: "Join us for the beginning of forever.",
    mark: "♡",
  },
  "baby-starlight": {
    title: "Our little star.",
    subtitle: "SOMETHING WONDERFUL IS COMING",
    detail: "A little celebration. A whole lot of love.",
    mark: "✧",
  },
  "baby-garden": {
    title: "Love, in bloom.",
    subtitle: "A LITTLE ONE IS ON THE WAY",
    detail: "Let’s shower them with love.",
    mark: "❧",
  },
  "open-doors": {
    title: "Our new place.",
    subtitle: "NEW KEYS. NEW MEMORIES.",
    detail: "The door is open. Come make yourself at home.",
    mark: "⌂",
  },
  "home-garden": {
    title: "Room to grow.",
    subtitle: "ROOTS & NEW BEGINNINGS",
    detail: "A new home, filled with our favourite people.",
    mark: "❧",
  },
  "home-gazette": {
    title: "We’ve moved.",
    subtitle: "THE NEW ADDRESS",
    detail: "Same people. A beautiful new beginning.",
    mark: "⌂",
  },
  "anniversary-palace": {
    title: "Golden together.",
    subtitle: "A LOVE WORTH CELEBRATING",
    detail: "Another chapter in our favourite story.",
    mark: "✧",
  },
  "anniversary-stars": {
    title: "You. Still you.",
    subtitle: "ALL THESE YEARS. ALL THIS LOVE.",
    detail: "Some things only get more beautiful.",
    mark: "✧",
  },
  "sacred-light": {
    title: "Light & togetherness.",
    subtitle: "A CELEBRATION OF BLESSINGS",
    detail: "Good wishes, warm hearts, beautiful beginnings.",
    mark: "❋",
  },
  "festival-palace": {
    title: "Let there be joy.",
    subtitle: "THE FESTIVAL COURTYARD",
    detail: "Traditions we love. People we cherish.",
    mark: "❋",
  },
  "pooja-botanical": {
    title: "A blessed beginning.",
    subtitle: "WITH GRATITUDE & GRACE",
    detail: "Share in a moment of peace and celebration.",
    mark: "❧",
  },
  "after-hours": {
    title: "Great minds. Together.",
    subtitle: "THE ASSEMBLY",
    detail: "Ideas, conversations, and what comes next.",
    mark: "↗",
  },
  "corporate-pass": {
    title: "Be part of next.",
    subtitle: "YOUR ALL-ACCESS INVITATION",
    detail: "Meet the people moving things forward.",
    mark: "↗",
  },
  "corporate-editorial": {
    title: "A new perspective.",
    subtitle: "THE NEXT EDITION",
    detail: "An invitation to think a little bigger.",
    mark: "↗",
  },
  "rose-promise": {
    title: "Better together.",
    subtitle: "THE NEXT CHAPTER OF OUR LOVE STORY",
    detail: "Aarav & Ananya · 24 February 2027",
    mark: "&",
  },
  "emerald-vows": {
    title: "A love in bloom.",
    subtitle: "IN THE GARDEN, WITH OUR FAVOURITE PEOPLE",
    detail: "Aarav & Ananya · The wedding celebration",
    mark: "❧",
  },
  "golden-hour": {
    title: "Meet me at midnight.",
    subtitle: "ONE NIGHT. ALL YOUR FAVOURITE PEOPLE.",
    detail: "Saturday · 8 PM · Let the good times roll",
    mark: "↗",
  },
  "little-moon": {
    title: "A little wonder.",
    subtitle: "OUR SWEETEST ADVENTURE IS ON THE WAY",
    detail: "Join us for a little love & a lot of joy",
    mark: "☁",
  },
  "always-us": {
    title: "Still our favourite song.",
    subtitle: "ANOTHER YEAR. A THOUSAND LITTLE MEMORIES.",
    detail: "Side A: you · Side B: me · Always on repeat",
    mark: "◎",
  },
  "confetti-club": {
    title: "Born to sparkle.",
    subtitle: "DRESS UP. SHOW UP. LIGHT UP THE NIGHT.",
    detail: "The birthday party · Dance floor awaits",
    mark: "✷",
  },
};

export default function GalleryTemplatePreview({
  template,
  value,
  paletteValue,
}: {
  template: Template;
  value?: Invitation;
  paletteValue?: Invitation;
}) {
  const palette = paletteForTemplate(template, paletteValue ?? value);
  const occasion = occasionData.find((o) => o.id === template.category);
  const look = looks[template.id] ?? {
    title: template.name,
    subtitle: `${template.label} · ${occasion?.name.toUpperCase() ?? "CELEBRATE"}`,
    detail: occasion?.description ?? "A celebration made for you",
    mark: template.motif,
  };
  if (template.id === "royal-garden")
    return (
      <div
        data-template-id={template.id}
        style={
          {
            width: "100%",
            minWidth: 0,
            "--preview-bg": palette.background,
          } as CSSProperties
        }
      >
        <RoyalWeddingWebsite
          value={value ?? paletteValue ?? invitationForTemplate(template)}
          heroOnly
        />
      </div>
    );
  return (
    <div
      className={`${styles.preview} ${styles[value?.design ?? template.design]} ${value ? styles.editable : ""}`}
      data-template-id={template.id}
      data-occasion={template.category}
      style={
        {
          "--preview-bg": palette.background,
          "--preview-ink": palette.ink,
          "--preview-accent": value?.accent ?? template.accent,
          "--preview-paper": palette.surface,
        } as CSSProperties
      }
    >
      <div className={styles.scene}>
        <div className={styles.artwork}>
          <InvitationArtwork template={template} />
        </div>
        <div className={styles.copy}>
          <span className={styles.kicker}>{look.subtitle}</span>
          <h3
            style={
              value
                ? {
                    fontFamily:
                      value.font === "modern"
                        ? "Arial, sans-serif"
                        : "Georgia, serif",
                    fontStyle: value.font === "romantic" ? "italic" : "normal",
                  }
                : undefined
            }
          >
            {value ? value.names || "Your celebration" : look.title}
          </h3>
          <p>{value ? value.tagline : look.detail}</p>
          {value && (
            <div className={styles.eventDetails}>
              <span>{displayDate(value.date)}</span>
              <span>{value.venue}</span>
            </div>
          )}
          <span className={styles.enter}>
            You’re invited <ArrowUpRight size={13} />
          </span>
        </div>
        <div className={styles.signature} aria-hidden="true">
          <span>
            {occasion?.name} / {template.label}
          </span>
          <span>Made for a moment like this ✧</span>
        </div>
      </div>
    </div>
  );
}
