"use client";
import { useEffect, useState } from "react";
import { Headphones, ArrowUpRight } from "lucide-react";
import PalaceScene from "./PalaceScene";
import { getDesign } from "@/data/designs";
import type { Invitation } from "@/types/invitation";
export default function CinematicEntrance({
  value,
  onOpen,
  onMusic,
}: {
  value: Invitation;
  onOpen: () => void;
  onMusic: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const [withSound, setWithSound] = useState(true);
  useEffect(() => {
    if (!opening) return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 1900;
    const timer = setTimeout(onOpen, delay);
    return () => clearTimeout(timer);
  }, [opening, onOpen]);
  function begin() {
    if (opening) return;
    if (withSound && value.music !== "none") onMusic();
    setOpening(true);
  }
  return (
    <section
      className={`cinematic-entrance entrance-design-${getDesign(value)} ${opening ? "is-opening" : ""}`}
    >
      <div className="entrance-copy">
        <p className="eyebrow">A BEAUTIFUL BEGINNING AWAITS</p>
        <h1>{value.names}</h1>
        <p>{value.tagline}</p>
      </div>
      <PalaceScene variant={value.entrance} opening={opening} />
      <div className="entrance-actions">
        <span className="gold-rule">✦</span>
        <button className="button" disabled={opening} onClick={begin}>
          {opening ? "Opening your invitation…" : "Open your invitation"}{" "}
          <ArrowUpRight size={17} />
        </button>
        {value.music !== "none" && (
          <label className="sound-choice">
            <input
              type="checkbox"
              checked={withSound}
              onChange={(e) => setWithSound(e.target.checked)}
              disabled={opening}
            />
            <Headphones size={14} /> Open with music
          </label>
        )}
        <p>Made with love. Opened with a little wonder.</p>
      </div>
    </section>
  );
}
