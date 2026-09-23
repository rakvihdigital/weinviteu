"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Music2,
  Smartphone,
  Palette,
} from "lucide-react";
import { occasionData } from "@/data/occasions";
import { invitationForTemplate } from "@/data/demoInvitation";
import { paletteForTemplate } from "@/data/templatePalettes";
import { encodeInvitation } from "@/lib/share";
import type { Template } from "@/types/invitation";
import GalleryTemplatePreview from "./GalleryTemplatePreview";
import PalettePicker from "./PalettePicker";
import styles from "./DesignDetailPage.module.css";
export default function DesignDetailContent({
  template,
  related,
}: {
  template: Template;
  related: Template[];
}) {
  const id = template.id;
  const [value, setValue] = useState(() => invitationForTemplate(template));
  const palette = paletteForTemplate(template, value);
  const occasion = occasionData.find((item) => item.id === template.category)!;
  const changed = value.palette && value.palette !== "original";
  const createHref = `/create?template=${id}${changed ? `#${encodeInvitation(value)}` : ""}`;
  const guestHref = changed
    ? `/invite/custom#${encodeInvitation(value)}`
    : `/invite/${id}`;
  return (
    <main
      className={styles.page}
      data-template-id={id}
      style={
        {
          "--design-accent": template.accent,
          "--detail-surface": palette.surface,
          "--detail-ink": palette.ink,
          "--detail-background": palette.background,
        } as CSSProperties
      }
    >
      <Link
        href={`/designs?category=${template.category}`}
        className={styles.back}
      >
        <ArrowLeft size={15} /> All {occasion.name.toLowerCase()} designs
      </Link>
      <section className={styles.hero} aria-labelledby="design-title">
        <div className={`${styles.stage} ${styles[template.theme]}`}>
          <div className={styles.stageHeading}>
            <span>{template.label}</span>
            <span>
              {occasion.mark} {occasion.name}
            </span>
          </div>
          <Link
            className={styles.previewLink}
            href={guestHref}
            aria-label={`Open ${template.name} invitation`}
          >
            <GalleryTemplatePreview template={template} paletteValue={value} />
          </Link>
          <Link className={styles.openPreview} href={guestHref}>
            Open this invitation <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            {occasion.name} / {template.label}
          </p>
          <h1 id="design-title">{template.name}</h1>
          <p className={styles.description}>{template.description}</p>
          <PalettePicker
            template={template}
            value={value}
            onChange={(next) =>
              setValue((current) => ({ ...current, palette: next }))
            }
          />
          <div className={styles.actions}>
            <Link className="button" href={createHref}>
              Personalize this design <ArrowUpRight size={17} />
            </Link>
            <Link className={styles.demo} href={guestHref}>
              View guest demo <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className={styles.details}>
            <span>
              <Palette size={17} /> Your names, colours & event details
            </span>
            <span>
              <Music2 size={17} /> Choose your soundtrack
            </span>
            <span>
              <Smartphone size={17} /> Ready for phones, tablets & desktops
            </span>
          </div>
          <p className={styles.note}>
            Start with this design, add your details, and preview your
            invitation before sharing.
          </p>
        </div>
      </section>
      <section
        className={styles.personalize}
        aria-labelledby="personalize-title"
      >
        <div>
          <p className={styles.eyebrow}>YOUR CELEBRATION, YOUR WAY</p>
          <h2 id="personalize-title">
            Make {template.name} <em>your own.</em>
          </h2>
        </div>
        <p>
          Add your names, a date to remember, your venue and a personal message.
          The editor opens with this design already selected.
        </p>
        <Link href={createHref}>
          Start creating <ArrowUpRight size={16} />
        </Link>
      </section>
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHeading}>
            <h2 id="related-title">
              More for your {occasion.name.toLowerCase()}.
            </h2>
            <Link href={`/designs?category=${template.category}`}>
              Explore occasion <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <Link
                key={item.id}
                className={styles.relatedCard}
                href={`/designs/${item.id}`}
                aria-label={`Explore ${item.name}`}
              >
                <GalleryTemplatePreview template={item} />
                <span>
                  {item.name}
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
