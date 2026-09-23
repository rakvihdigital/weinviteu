import Image from "next/image";
import type { CSSProperties } from "react";
import type { Invitation, Template } from "@/types/invitation";
import { paletteForTemplate } from "@/data/templatePalettes";
import { occasionData } from "@/data/occasions";
import { displayDate } from "@/lib/share";
import GalleryImage from "./GalleryImage";
import styles from "./PhotoInvitationHero.module.css";

export default function PhotoInvitationHero({
  template,
  value,
  compact = false,
}: {
  template: Template;
  value: Invitation;
  compact?: boolean;
}) {
  const palette = paletteForTemplate(template, value);
  const photo = value.heroPhoto;
  return (
    <section
      className={`${styles.hero} ${compact ? styles.compact : ""}`}
      data-template-id={template.id}
      data-design={template.design}
      data-composition={
        (
          {
            "royal-garden": "cinema",
            "emerald-vows": "arch",
            "ivory-sonnet": "masthead",
            "rose-promise": "editorial",
            "moonlit-yes": "cinema",
            "engagement-sonnet": "polaroid",
            "golden-hour": "poster",
            "confetti-club": "cinema",
            "birthday-bloom": "masthead",
            "little-moon": "medallion",
            "baby-starlight": "polaroid",
            "baby-garden": "arch",
            "open-doors": "editorial",
            "home-garden": "masthead",
            "home-gazette": "polaroid",
            "always-us": "medallion",
            "anniversary-palace": "cinema",
            "anniversary-stars": "poster",
            "sacred-light": "poster",
            "festival-palace": "cinema",
            "pooja-botanical": "arch",
            "after-hours": "poster",
            "corporate-pass": "masthead",
            "corporate-editorial": "editorial",
          } as Record<string, string>
        )[template.id]
      }
      data-occasion={template.category}
      style={
        {
          "--preview-bg": palette.background,
          "--preview-accent": value.accent,
          "--photo-paper": palette.background,
          "--photo-ink": palette.ink,
          "--photo-accent": value.accent,
        } as CSSProperties
      }
    >
      <div className={styles.visual}>
        {photo ? (
          <GalleryImage
            id={photo}
            alt={value.photoCaptions?.[photo] || "Your celebration"}
            width={1500}
            height={1000}
            loading={compact ? "lazy" : "eager"}
          />
        ) : (
          <Image
            src={`/template-photos/${template.id}.webp`}
            alt={`${template.name} celebration portrait`}
            fill
            sizes={
              compact
                ? "(max-width:760px) 100vw, 33vw"
                : "(max-width:760px) 100vw, 65vw"
            }
            priority={!compact}
          />
        )}
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          {occasionData.find((o) => o.id === template.category)?.name} ·{" "}
          {template.label}
        </p>
        <h1
          aria-label={value.names}
          style={{
            fontFamily:
              value.font === "modern" ? "Arial, sans-serif" : "Georgia, serif",
            fontStyle: value.font === "romantic" ? "italic" : "normal",
          }}
        >
          {value.names || "Your celebration"}
        </h1>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.message}>{value.tagline}</p>
        <div className={styles.details}>
          <span>{displayDate(value.date)}</span>
          <span>{value.venue}</span>
        </div>
        <span className={styles.invited}>
          You’re invited <span aria-hidden="true">↗</span>
        </span>
      </div>
      {!compact && photo && value.photoCaptions?.[photo] && (
        <p className={styles.caption}>{value.photoCaptions[photo]}</p>
      )}
    </section>
  );
}
