"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { occasionData } from "@/data/occasions";
import { invitationForTemplate } from "@/data/demoInvitation";
import type { Template } from "@/types/invitation";
import InvitationCard from "./InvitationCard";
import GalleryTemplatePreview from "./GalleryTemplatePreview";
export default function TemplateGallery({
  templates,
  initialCategory = "all",
  compact = false,
}: {
  templates: Template[];
  initialCategory?: string;
  compact?: boolean;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"digital" | "card">("digital");

  const filtered = templates.filter(
    (t) =>
      (category === "all" || t.category === category) &&
      `${t.name} ${t.category}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {!compact && (
        <div className="gallery-toolbar">
          <div className="filters" aria-label="Filter by occasion">
            {[{ id: "all", name: "All designs" }, ...occasionData].map((c) => {
              const count =
                c.id === "all"
                  ? templates.length
                  : templates.filter((t) => t.category === c.id).length;
              return (
                <button
                  key={c.id}
                  aria-label={c.name}
                  className={category === c.id ? "chip active" : "chip"}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  <span>{c.name}</span>
                  <small className="chip-count" aria-hidden="true">
                    ({count})
                  </small>
                </button>
              );
            })}
          </div>

          <div className="gallery-controls-right">
            <div
              className="view-mode-switcher"
              role="group"
              aria-label="View format"
            >
              <button
                type="button"
                className={
                  viewMode === "digital" ? "view-btn active" : "view-btn"
                }
                onClick={() => setViewMode("digital")}
                title="View as Digital Invitation Websites"
              >
                <span>💻 Digital Websites</span>
              </button>
              <button
                type="button"
                className={viewMode === "card" ? "view-btn active" : "view-btn"}
                onClick={() => setViewMode("card")}
                title="View as Stationery Cards"
              >
                <span>📜 Stationery Cards</span>
              </button>
            </div>

            <label className="search">
              <Search size={17} />
              <input
                aria-label="Search designs"
                placeholder="Find your design…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      <div
        className={
          compact ? "gallery-meta-row compact-gallery-meta" : "gallery-meta-row"
        }
      >
        <p className="result-count" aria-live="polite">
          Showing {filtered.length}{" "}
          {viewMode === "digital"
            ? "digital invitation websites"
            : "curated designs"}
        </p>
        <span className="gallery-live-badge">
          ✦ REAL-TIME GUEST EXPERIENCE DEMOS
        </span>
      </div>

      <div
        className={
          compact || viewMode === "digital"
            ? "template-grid digital-collection digital-gallery-grid restored-collection"
            : "template-grid stationery-gallery-grid"
        }
      >
        {filtered.map((t) => (
          <article className="template-item" key={t.id}>
            <Link
              href={`/designs/${t.id}`}
              className={`template-art art-${t.theme} art-design-${t.design}`}
              aria-label={`Preview ${t.name}`}
            >
              <span className="template-badge">{t.label}</span>
              {viewMode === "digital" || compact ? (
                <GalleryTemplatePreview template={t} />
              ) : (
                <InvitationCard value={invitationForTemplate(t)} />
              )}
            </Link>
            <div className="template-info">
              <div>
                <h3>{t.name}</h3>
                <p>
                  {occasionData.find((o) => o.id === t.category)?.name} ·
                  {t.label.toLowerCase()} digital invitation
                </p>
              </div>
              <Link
                href={`/designs/${t.id}`}
                className="round-link"
                aria-label={`Preview ${t.name}`}
              >
                <ArrowUpRight size={19} />
              </Link>
            </div>
            <div className="template-capabilities">
              <span>✦ 3D entrance</span>
              <span>♫ Music included</span>
              <span>✓ RSVP enabled</span>
            </div>
            <div className="template-actions">
              <Link href={`/invite/${t.id}`}>View live invitation ↗</Link>
              <Link href={`/create?template=${t.id}`}>
                Use design <span>↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty">
          <h2>No designs found</h2>
          <p>Try another search or occasion.</p>
          <button
            className="button"
            onClick={() => {
              setCategory("all");
              setSearch("");
            }}
          >
            Show all designs
          </button>
        </div>
      )}
    </>
  );
}
