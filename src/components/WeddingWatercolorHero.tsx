import Image from "next/image";
import type { Invitation, Template } from "@/types/invitation";
import { displayDate } from "@/lib/share";
import styles from "./WeddingWatercolorHero.module.css";

export default function WeddingWatercolorHero({
  template,
  value,
  compact = false,
}: {
  template: Template;
  value: Invitation;
  compact?: boolean;
}) {
  const scene =
    template.id === "royal-garden"
      ? "palace"
      : template.id === "emerald-vows"
        ? "garden"
        : "seaside";
  const names = value.names.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
  return (
    <section
      className={`${styles.hero} ${compact ? styles.compact : ""}`}
      data-template-id={template.id}
      aria-label={`${template.name} wedding invitation`}
    >
      <Image
        className={styles.art}
        src={`/wedding/${scene}-watercolor.png`}
        alt={`Watercolor bride and groom in a ${scene} setting`}
        fill
        sizes={
          compact
            ? "(max-width:760px) 100vw, 33vw"
            : "(max-width:760px) 100vw, 800px"
        }
        priority={!compact}
      />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Together with our families</p>
        <h1 aria-label={value.names}>
          {names.map((name, i) => (
            <span key={i}>
              {i > 0 && <em>&</em>}
              {name}
            </span>
          ))}
        </h1>
        <p className={styles.label}>WEDDING DAY</p>
        <div className={styles.rule} aria-hidden="true">
          ✦
        </div>
        <p className={styles.message}>{value.tagline}</p>
        <p className={styles.date}>{displayDate(value.date)}</p>
      </div>
    </section>
  );
}
