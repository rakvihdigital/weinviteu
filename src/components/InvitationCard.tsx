"use client";
import type { CSSProperties, ReactNode } from "react";
import type { Invitation } from "@/types/invitation";
import { displayDate } from "@/lib/share";
import { getDesign, designNames } from "@/data/designs";
import { templates } from "@/data/templates";
import { paletteForTemplate } from "@/data/templatePalettes";
import {
  BotanicalArt,
  HouseArt,
  MandalaArt,
  ConstellationArt,
} from "./DesignArtwork";
export default function InvitationCard({
  value,
  interactive = false,
}: {
  value: Invitation;
  interactive?: boolean;
}) {
  const design = getDesign(value);
  const template = templates.find((item) => item.id === value.templateId);
  const palette = template ? paletteForTemplate(template, value) : undefined;
  const [year, month, day] = value.date.split("-");
  const date = displayDate(value.date);
  const title = (
    <h2 className="design-title">{value.names || "Your celebration"}</h2>
  );
  const message = <p className="design-message">{value.tagline}</p>;
  const details = (
    <div className="design-details">
      <strong>{date}</strong>
      <span>{value.venue}</span>
    </div>
  );
  let face: ReactNode;
  switch (design) {
    case "palace":
      face = (
        <div className="design-face palace-face">
          <div className="palace-crown" aria-hidden="true">
            ♜
          </div>
          <span className="design-kicker">WITH OUR FAMILIES</span>
          <div className="palace-window">
            <span className="palace-initial" aria-hidden="true">
              {Array.from(value.names)[0] || "W"}
            </span>
            {title}
            <span className="design-rule">✦</span>
            {message}
            {details}
          </div>
          <span className="design-footnote">AN INVITATION TO FOREVER</span>
        </div>
      );
      break;
    case "botanical":
      face = (
        <div className="design-face botanical-face">
          <BotanicalArt />
          <span className="design-kicker">LOVE, NATURALLY.</span>
          <div className="botanical-letter">
            <span className="botanical-number" aria-hidden="true">
              01 /
            </span>
            {title}
            <span className="script-note">are celebrating</span>
            {message}
          </div>
          {details}
          <span className="design-footnote">TOGETHER, WE GROW.</span>
        </div>
      );
      break;
    case "gazette":
      face = (
        <div className="design-face gazette-face">
          <div className="gazette-masthead">The Love Gazette</div>
          <div className="gazette-edition">
            <span>SPECIAL EDITION</span>
            <span>{year}</span>
          </div>
          <span className="gazette-headline">IT’S OFFICIAL.</span>
          {title}
          <div className="gazette-columns">
            <p>{value.tagline}</p>
            <div className="gazette-stamp">
              <span>SAVE THE DATE</span>
              <strong>{day}</strong>
              <span>
                {new Date(value.date + "T12:00:00").toLocaleString("en", {
                  month: "long",
                })}
              </span>
            </div>
          </div>
          <div className="gazette-bottom">
            <span>THE NEXT CHAPTER BEGINS</span>
            <p>{value.venue}</p>
          </div>
        </div>
      );
      break;
    case "ticket":
      face = (
        <div className="design-face ticket-face">
          <div className="ticket-top">
            <span>ALL ACCESS</span>
            <span>
              NO. {day}
              {month}
            </span>
          </div>
          <span className="ticket-arrow" aria-hidden="true">
            ↗
          </span>
          {title}
          {message}
          <div className="ticket-stub">
            <div>
              <span>ADMIT YOUR FAVOURITE PEOPLE</span>
              {details}
            </div>
            <div className="decorative-barcode" aria-hidden="true" />
          </div>
        </div>
      );
      break;
    case "rainbow":
      face = (
        <div className="design-face rainbow-face">
          <span className="design-kicker">A LITTLE WONDER IS ON THE WAY</span>
          <div className="rainbow-art" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <span className="cloud cloud-one" />
            <span className="cloud cloud-two" />
          </div>
          {title}
          {message}
          {details}
          <span className="rainbow-stars" aria-hidden="true">
            ✧ · ✦ · ✧
          </span>
        </div>
      );
      break;
    case "blueprint":
      face = (
        <div className="design-face blueprint-face">
          <div className="blueprint-index">
            <span>OUR NEXT CHAPTER</span>
            <span>EST. {year}</span>
          </div>
          <HouseArt />
          {title}
          {message}
          <div className="address-label">
            <span>YOU ARE ALWAYS WELCOME</span>
            {details}
          </div>
        </div>
      );
      break;
    case "vinyl":
      face = (
        <div className="design-face vinyl-face">
          <span className="design-kicker">SOME THINGS ONLY GET BETTER</span>
          <div className="vinyl-record" aria-hidden="true">
            <div className="vinyl-label">
              <span>WE / US</span>
              <b>♥</b>
              <small>SIDE A · FOREVER</small>
            </div>
          </div>
          <div className="vinyl-sleeve">
            {title}
            {message}
            <div className="vinyl-track">
              <span>TRACK 01</span>
              {details}
            </div>
          </div>
        </div>
      );
      break;
    case "mandala":
      face = (
        <div className="design-face mandala-face">
          <div className="marigold-strings" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i}>
                ❋<br />❋<br />❋
              </span>
            ))}
          </div>
          <MandalaArt />
          <span className="design-kicker">WITH BLESSINGS & TOGETHERNESS</span>
          {title}
          <div className="diya-art" aria-hidden="true">
            <i />
            <span />
          </div>
          {message}
          {details}
        </div>
      );
      break;
    case "swiss":
      face = (
        <div className="design-face swiss-face">
          <div className="swiss-top">
            <span>
              AN INVITATION
              <br />
              TO CONNECT.
            </span>
            <span>●</span>
          </div>
          <div className="swiss-date">
            <b>{day}</b>
            <span>
              {month}
              <br />
              {year}
            </span>
          </div>
          {title}
          <div className="swiss-line" />
          {message}
          <div className="swiss-bottom">
            <span>{value.venue}</span>
            <strong>
              LET’S BE
              <br />
              THERE. ↗
            </strong>
          </div>
        </div>
      );
      break;
    case "editorial":
      face = (
        <div className="design-face editorial-face">
          <div className="editorial-meta">
            <span>VOWS</span>
            <span>VOL. 01 / {year}</span>
          </div>
          <div className="editorial-ampersand" aria-hidden="true">
            &
          </div>
          <div className="editorial-heading">
            <span className="design-kicker">THE FOREVER ISSUE</span>
            {title}
          </div>
          <div className="editorial-bottom">
            {message}
            {details}
          </div>
        </div>
      );
      break;
    case "disco":
      face = (
        <div className="design-face disco-face">
          <div className="checker-trim" />
          <span className="design-kicker">GOOD PEOPLE. GREAT NIGHT.</span>
          <div className="disco-art" aria-hidden="true">
            <span className="disco-star">✷</span>
            <div className="disco-ball" />
            <span className="disco-star">✧</span>
          </div>
          {title}
          {message}
          <div className="disco-date">{details}</div>
          <div className="checker-trim" />
        </div>
      );
      break;
    case "celestial":
      face = (
        <div className="design-face celestial-face">
          <ConstellationArt />
          <span className="design-kicker">SOME THINGS ARE WRITTEN</span>
          <div className="crescent" aria-hidden="true" />
          {title}
          <span className="script-note">in the stars</span>
          {message}
          {details}
          <span className="celestial-stars" aria-hidden="true">
            ✧ ✦ ✧
          </span>
        </div>
      );
      break;
  }
  return (
    <div
      className={`invitation-card design-card design-${design} theme-${value.theme} font-${value.font} ${interactive ? "tilt-card" : ""}`}
      data-design={design}
      aria-label={`${designNames[design]} invitation design`}
      style={
        {
          "--accent": value.accent,
          "--card-bg": palette?.background,
          "--card-ink": palette?.ink,
        } as CSSProperties
      }
      onPointerMove={
        interactive
          ? (e) => {
              if (e.pointerType !== "mouse") return;
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty(
                "--rx",
                `${-(e.clientY - r.top - r.height / 2) / 45}deg`,
              );
              e.currentTarget.style.setProperty(
                "--ry",
                `${(e.clientX - r.left - r.width / 2) / 45}deg`,
              );
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.setProperty("--rx", "0deg");
              e.currentTarget.style.setProperty("--ry", "0deg");
            }
          : undefined
      }
    >
      {face}
    </div>
  );
}
