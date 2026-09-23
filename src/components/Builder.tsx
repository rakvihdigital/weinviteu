"use client";
import SectionPhotoUpload from "./SectionPhotoUpload";
import RoyalWeddingWebsite from "./RoyalWeddingWebsite";
import CompleteInvitationWebsite from "./CompleteInvitationWebsite";
import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GalleryUpload from "./GalleryUpload";
import {
  Eye,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  RotateCcw,
} from "lucide-react";
import type { Invitation, Template } from "@/types/invitation";
import { invitationSchema } from "@/types/invitation";
import { invitationForTemplate } from "@/data/demoInvitation";
import { encodeInvitation, invitationUrl } from "@/lib/share";
import InvitationCard from "./InvitationCard";
import { templates } from "@/data/templates";
import { getDesign, designNames } from "@/data/designs";
import { paletteForTemplate } from "@/data/templatePalettes";
import PalettePicker from "./PalettePicker";
const tabs = ["Event", "Story", "Gallery", "Style", "Extras"] as const;
export default function Builder({
  template,
  restored,
}: {
  template: Template;
  restored?: Invitation;
}) {
  const router = useRouter();
  const initial = invitationForTemplate(template);
  const [value, setValue] = useState<Invitation>(restored ?? initial);
  const activeTemplate =
    templates.find((t) => t.id === value.templateId) ?? template;
  const activePalette = paletteForTemplate(activeTemplate, value);
  function switchDesign(id: string) {
    const next = templates.find((t) => t.id === id);
    if (!next) return;
    const defaults = invitationForTemplate(next);
    setValue((v) => ({
      ...v,
      templateId: next.id,
      design: next.design,
      theme: next.theme,
      palette: "original",
      accent: next.accent,
      font: next.font,
      entrance: defaults.entrance,
    }));
    setShare("");
    setMessage("Design changed. Your event details are kept.");
  }
  const [tab, setTab] = useState<(typeof tabs)[number]>("Event");
  const [device, setDevice] = useState("desktop");
  const [message, setMessage] = useState("");
  const [share, setShare] = useState("");
  function update<K extends keyof Invitation>(key: K, next: Invitation[K]) {
    setValue((v) => ({ ...v, [key]: next }));
    if (key === "theme") setValue((v) => ({ ...v, palette: "original" }));
    setShare("");
    setMessage("");
  }
  function valid() {
    const result = invitationSchema.safeParse(value);
    if (
      !result.success ||
      (value.music === "custom" && !value.customAudioUrl)
    ) {
      setMessage(
        "Please check your name, date, time, and any custom HTTPS audio URL before previewing.",
      );
      setTab("Event");
      return false;
    }
    return true;
  }
  function preview() {
    if (valid()) router.push(`/preview#${encodeInvitation(value)}`);
  }
  function download() {
    if (!valid()) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "weinviteu-invitation.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Invitation details downloaded. Import this file to keep editing later.",
    );
  }
  async function copy() {
    if (!valid()) return;
    const url = invitationUrl(value);
    setShare(url);
    try {
      await navigator.clipboard.writeText(url);
      setMessage(
        "Demo link copied. It works on your deployed website; localhost links only work on your computer.",
      );
    } catch {
      setMessage("Your link is ready below. Select it to copy.");
    }
  }
  return (
    <main
      className="builder-page personalized-studio"
      data-template-id={activeTemplate.id}
      style={
        {
          "--editor-surface": activePalette.surface,
          "--editor-ink": activePalette.ink,
          "--editor-background": activePalette.background,
        } as CSSProperties
      }
    >
      <div className="builder-heading">
        <div>
          <p className="eyebrow">MAKE IT BEAUTIFULLY YOURS</p>
          <h1>
            Make <em>{activeTemplate.name}</em> yours.
          </h1>
          <p>
            {activeTemplate.name} <span className="dot">·</span>{" "}
            <Link href="/designs">Change design</Link>
          </p>
        </div>
        <div className="editor-palette-label">
          <span style={{ background: activePalette.background }} />
          <span style={{ background: activePalette.ink }} />
          <span>{activePalette.name}</span>
        </div>
        <div className="button-row">
          <button className="button secondary" onClick={download}>
            <Download size={16} /> Export
          </button>
          <button className="button" onClick={preview}>
            <Eye size={17} /> Full preview
          </button>
        </div>
      </div>
      <div className="builder-layout">
        <aside className="editor">
          <div
            className="editor-tabs"
            role="tablist"
            aria-label="Customization sections"
          >
            {tabs.map((t) => (
              <button
                role="tab"
                aria-selected={tab === t}
                aria-controls="editor-panel"
                id={`tab-${t}`}
                key={t}
                className={tab === t ? "selected" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="editor-panel"
            id="editor-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "Event" && (
              <>
                <div className="panel-heading">
                  <span>01</span>
                  <div>
                    <h2>The occasion</h2>
                    <p>Start with the details that matter.</p>
                  </div>
                </div>
                <label>
                  Names / event title
                  <input
                    maxLength={100}
                    value={value.names}
                    onChange={(e) => update("names", e.target.value)}
                    placeholder="Arjun & Priya"
                  />
                </label>
                <label>
                  Invitation message
                  <textarea
                    rows={3}
                    maxLength={180}
                    value={value.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                  />
                </label>
                <div className="form-row">
                  <label>
                    Date
                    <input
                      type="date"
                      value={value.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      value={value.time}
                      onChange={(e) => update("time", e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Time zone
                  <select
                    value={value.timezone}
                    onChange={(e) =>
                      update(
                        "timezone",
                        e.target.value as Invitation["timezone"],
                      )
                    }
                  >
                    <option value="+05:30">India · UTC+05:30</option>
                    <option value="+00:00">UTC+00:00</option>
                    <option value="+01:00">UTC+01:00</option>
                    <option value="-04:00">UTC−04:00</option>
                    <option value="-05:00">UTC−05:00</option>
                    <option value="+08:00">UTC+08:00</option>
                  </select>
                </label>
                <label>
                  Venue
                  <input
                    maxLength={120}
                    value={value.venue}
                    onChange={(e) => update("venue", e.target.value)}
                  />
                </label>
                <label>
                  Address / location
                  <input
                    maxLength={220}
                    value={value.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </label>
                <SectionPhotoUpload
                  label="Hero photo"
                  photo={value.heroPhoto}
                  onChange={(photo) => update("heroPhoto", photo)}
                />
              </>
            )}
            {tab === "Story" && (
              <>
                <h2>A story only you can tell.</h2>
                <p className="muted">
                  Share a favourite memory, a little introduction, or a
                  heartfelt welcome.
                </p>
                <label>
                  Your story
                  <textarea
                    rows={10}
                    maxLength={2000}
                    value={value.story}
                    onChange={(e) => update("story", e.target.value)}
                  />
                </label>
                <small>{value.story.length}/2000 characters</small>
                <SectionPhotoUpload
                  label="Story photo"
                  photo={value.storyPhoto}
                  onChange={(photo) => update("storyPhoto", photo)}
                />
              </>
            )}
            {tab === "Gallery" && (
              <>
                <h2>Little moments.</h2>
                <p className="muted">
                  Add your own photos and see them in your invitation.
                </p>
                <GalleryUpload
                  captions={value.photoCaptions}
                  onCaptionChange={(id, text) =>
                    update("photoCaptions", {
                      ...value.photoCaptions,
                      [id]: text,
                    })
                  }
                  gallery={value.gallery}
                  onChange={(gallery) => update("gallery", gallery)}
                />
              </>
            )}
            {tab === "Style" && (
              <>
                <h2>Find your feeling.</h2>
                <label>
                  Invitation design
                  <select
                    value={value.templateId}
                    onChange={(e) => switchDesign(e.target.value)}
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="muted">
                  {designNames[getDesign(value)]} · Switching the design keeps
                  your names, date, story and music.
                </p>
                <label>
                  3D opening experience
                  <select
                    value={value.entrance}
                    onChange={(e) =>
                      update(
                        "entrance",
                        e.target.value as Invitation["entrance"],
                      )
                    }
                  >
                    <option value="palace">Royal palace · opening gates</option>
                    <option value="celestial">
                      Celestial · starlit entrance
                    </option>
                    <option value="garden">Garden · botanical arch</option>
                  </select>
                </label>
                <p className="muted">
                  A palette and a typeface that feel like you.
                </p>
                <PalettePicker
                  template={activeTemplate}
                  value={value}
                  onChange={(palette) => update("palette", palette)}
                />
                <label>Theme</label>
                <div className="theme-options">
                  {(["ivory", "forest", "rose", "midnight"] as const).map(
                    (theme) => (
                      <button
                        className={`theme-option theme-${theme} ${value.theme === theme ? "chosen" : ""}`}
                        key={theme}
                        onClick={() => update("theme", theme)}
                        aria-pressed={value.theme === theme}
                      >
                        {theme}
                        {value.theme === theme && <Check size={14} />}
                      </button>
                    ),
                  )}
                </div>
                <label>
                  Accent colour
                  <div className="color-field">
                    <input
                      type="color"
                      value={value.accent}
                      onChange={(e) => update("accent", e.target.value)}
                    />
                    <span>{value.accent.toUpperCase()}</span>
                  </div>
                </label>
                <label>
                  Typography
                  <select
                    value={value.font}
                    onChange={(e) =>
                      update("font", e.target.value as Invitation["font"])
                    }
                  >
                    <option value="classic">Classic · editorial serif</option>
                    <option value="modern">Modern · clean sans</option>
                    <option value="romantic">Romantic · italic serif</option>
                  </select>
                </label>
              </>
            )}
            {tab === "Extras" && (
              <>
                <h2>The finishing touches.</h2>
                <label>
                  Music
                  <select
                    value={value.music}
                    onChange={(e) =>
                      update("music", e.target.value as Invitation["music"])
                    }
                  >
                    <option value="none">No music</option>
                    <option value="piano">
                      Moonlit piano · original soundtrack
                    </option>
                    <option value="ambient">
                      Celestial dream · ambient soundtrack
                    </option>
                    <option value="custom">
                      My own music · public HTTPS URL
                    </option>
                    <option value="bells">
                      Wedding bells · original soundtrack
                    </option>
                  </select>
                </label>
                {value.music !== "none" && (
                  <audio
                    key={value.music}
                    controls
                    src={
                      value.music === "custom"
                        ? value.customAudioUrl || undefined
                        : `/audio/${value.music}.wav`
                    }
                    preload="none"
                  />
                )}
                <p className="muted">
                  Music starts after a guest taps “Open your invitation” with
                  sound enabled. Guests can pause or adjust the volume at any
                  time.
                </p>
                {value.music === "custom" && (
                  <label>
                    Public MP3 / WAV audio URL
                    <input
                      type="url"
                      placeholder="https://your-domain.com/music.mp3"
                      value={value.customAudioUrl}
                      onChange={(e) => update("customAudioUrl", e.target.value)}
                    />
                    <small>
                      Use an audio file you own or have permission to share.
                      Local uploads need future storage integration.
                    </small>
                  </label>
                )}
                <label>
                  Starting volume · {Math.round(value.musicVolume * 100)}%
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={value.musicVolume}
                    onChange={(e) =>
                      update("musicVolume", Number(e.target.value))
                    }
                  />
                </label>
                <label className="toggle-row">
                  <span>
                    RSVP section<small>Demo responses only</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={value.rsvpEnabled}
                    onChange={(e) => update("rsvpEnabled", e.target.checked)}
                  />
                </label>
                <label className="toggle-row">
                  <span>
                    Live countdown<small>Count down to your event</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={value.countdownEnabled}
                    onChange={(e) =>
                      update("countdownEnabled", e.target.checked)
                    }
                  />
                </label>
                <label>
                  Import saved invitation
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        if (file.size > 30000) throw new Error();
                        const imported = invitationSchema.parse(
                          JSON.parse(await file.text()),
                        );
                        setValue(imported);
                        setShare("");
                        setMessage("Invitation imported.");
                      } catch {
                        setMessage(
                          "Please choose a valid WeInviteU invitation JSON file under 30 KB.",
                        );
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  className="text-button"
                  onClick={() => {
                    if (window.confirm("Reset all edits to this template?")) {
                      setValue(initial);
                      setShare("");
                      setMessage("Template reset.");
                    }
                  }}
                >
                  <RotateCcw size={14} /> Reset to template
                </button>
              </>
            )}
          </div>
          <div className="editor-bottom">
            <span>
              <Check size={14} /> No account needed to explore
            </span>
            <button className="button" onClick={copy}>
              Create demo link <ArrowUpRight size={16} />
            </button>
            <p role="status">{message}</p>
            {share && (
              <label>
                Your invitation link
                <input
                  readOnly
                  value={share}
                  onFocus={(e) => e.target.select()}
                />
              </label>
            )}
            <p className="muted">
              Edits stay in this page until you leave. Export a copy to keep
              them.
            </p>
          </div>
        </aside>
        <section className="live-preview">
          <div className="preview-toolbar">
            <span>
              <span className="live-dot" /> LIVE PREVIEW
            </span>
            <div>
              {["desktop", "mobile"].map((d) => (
                <button
                  className={device === d ? "selected" : ""}
                  key={d}
                  onClick={() => setDevice(d)}
                  aria-pressed={device === d}
                >
                  {d}
                </button>
              ))}
              <button onClick={preview}>
                <Eye size={14} /> Preview
              </button>
            </div>
          </div>
          <div
            className={`preview-canvas digital-preview-canvas ${device === "mobile" ? "phone-preview" : ""}`}
          >
            {activeTemplate.id === "royal-garden" ? (
              <RoyalWeddingWebsite value={value} editor />
            ) : (
              <CompleteInvitationWebsite
                template={activeTemplate}
                value={value}
                onEdit={(section) => {
                  setTab(section);
                  document
                    .getElementById("editor-panel")
                    ?.scrollIntoView({ block: "start" });
                }}
              />
            )}
            <div
              className="builder-card-backing visually-hidden-suite"
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              <InvitationCard
                value={{
                  ...value,
                  date: /^\d{4}-\d{2}-\d{2}$/.test(value.date)
                    ? value.date
                    : initial.date,
                }}
                interactive
              />
            </div>
          </div>
          <div className="preview-caption">
            <span>✦</span> A little preview of something unforgettable.
          </div>
          <button className="text-button" onClick={preview}>
            Open the complete guest experience <ArrowUpRight size={16} />
          </button>
        </section>
      </div>
      <div className="builder-note">
        <Copy size={16} />
        <span>
          Prototype mode: no database, login, payments, or saved RSVP responses.
          Your invitation travels inside its demo link.
        </span>
      </div>
    </main>
  );
}
