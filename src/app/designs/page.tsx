import type { Metadata } from "next";
import TemplateGallery from "@/components/TemplateGallery";
import ExperienceLab from "@/components/ExperienceLab";
import { templateRepository } from "@/lib/repository";
import { occasionData } from "@/data/occasions";
import { Sparkles, Globe, Music2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Digital Invitation Websites · WeInviteU",
  description:
    "Browse twenty-four digital invitation websites with 3D entrance physics, curated audio soundtracks, and real-time guest RSVP management.",
};

export default async function Designs({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected = occasionData.some((o) => o.id === category)
    ? category
    : "all";

  const allTemplates = await templateRepository.list();

  return (
    <main className="section designs-page">
      {/* Directory Hero Header */}
      <div className="center-heading designs-hero-heading">
        <p className="eyebrow">DIGITAL INVITATION DIRECTORY / VOLUME 03</p>
        <h1>
          Every invitation is a <em>website.</em>
          <br />
          Crafted to be opened.
        </h1>
        <p>
          Twenty-four responsive digital invitation websites across eight
          celebrations. Every design includes 3D theatrical entrance reveals,
          curated soundtracks, and instant guest RSVP.
        </p>

        {/* Directory Highlight Metrics */}
        <div
          className="directory-metrics-strip"
          aria-label="Collection features"
        >
          <div className="metric-chip">
            <Globe size={13} />
            <span>24 Digital Websites</span>
          </div>
          <div className="metric-chip">
            <Sparkles size={13} />
            <span>3D Entrance Physics</span>
          </div>
          <div className="metric-chip">
            <Music2 size={13} />
            <span>Curated Soundtracks</span>
          </div>
          <div className="metric-chip">
            <ShieldCheck size={13} />
            <span>Instant Guest RSVP</span>
          </div>
        </div>
      </div>

      {/* Featured Interactive Digital Entrance Experience */}
      <div className="designs-lab-wrapper">
        <ExperienceLab />
      </div>

      {/* Full Digital Invitation Gallery with Filters & Search */}
      <div className="designs-gallery-wrapper">
        <div className="gallery-section-header">
          <div>
            <p className="eyebrow">BROWSE &amp; TEST-DRIVE THE COLLECTION</p>
            <h2>
              Find your kind of <em>invitation.</em>
            </h2>
          </div>
        </div>

        <TemplateGallery
          key={selected}
          templates={allTemplates}
          initialCategory={selected}
        />
      </div>
    </main>
  );
}
