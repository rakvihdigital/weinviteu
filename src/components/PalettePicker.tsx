"use client";
import type { Invitation, Template } from "@/types/invitation";
import { colourOptions, paletteForTemplate } from "@/data/templatePalettes";
import styles from "./PalettePicker.module.css";
export default function PalettePicker({
  template,
  value,
  onChange,
}: {
  template: Template;
  value: Invitation;
  onChange: (palette: NonNullable<Invitation["palette"]>) => void;
}) {
  const options = [
    { id: "original", ...paletteForTemplate(template), name: "Original" },
    ...Object.entries(colourOptions).map(([id, palette]) => ({
      id,
      ...palette,
    })),
  ];
  return (
    <fieldset className={styles.picker}>
      <legend>Choose your colours</legend>
      <p>Click a palette to see your invitation change.</p>
      <div className={styles.options}>
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-label={`${option.name} palette`}
            aria-pressed={(value.palette ?? "original") === option.id}
            onClick={() =>
              onChange(option.id as NonNullable<Invitation["palette"]>)
            }
          >
            <span
              className={styles.swatch}
              style={{ background: option.background, color: option.ink }}
            >
              Aa
            </span>
            <span>{option.name}</span>
          </button>
        ))}
      </div>
      <span className={styles.selected} aria-live="polite">
        Selected: {paletteForTemplate(template, value).name}
      </span>
    </fieldset>
  );
}
