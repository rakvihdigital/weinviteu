import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import type { Template } from "@/lib/models";
import { getTemplateUrl } from "@/lib/template-url";
import { getTemplatePricing } from "@/lib/template-pricing";
import { getTemplateWalkthrough } from "@/lib/template-content";
import TemplateCard from "@/components/TemplateCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { readTemplate } from "@/lib/template-source";

import styles from "./template-detail.module.css";
import SimulatorStage from "./SimulatorStage";
import TemplateInquiryForm from "./TemplateInquiryForm";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Fetch template by numeric ID or fallback to slug/title */
async function fetchTemplate(id: string): Promise<Template | null> {
  const numId = /^\d+$/.test(id) ? Number(id) : NaN;
  if (!isNaN(numId)) {
    const { data } = await supabase
      .from("templates")
      .select("*")
      .eq("id", numId)
      .maybeSingle();
    if (data) return data;
  }

  // Fallback lookup
  const { data: all } = await supabase
    .from("templates")
    .select("*")
    .neq("enabled", false);

  if (!all || all.length === 0) return null;

  const clean = id.toLowerCase().trim();
  const found = all.find((t) => {
    if (t.id.toString() === clean) return true;
    if (t.filename.toLowerCase().includes(clean)) return true;
    const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return slug === clean;
  });

  return found || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const template = await fetchTemplate(id);

  if (!template) {
    return {
      title: "Template Not Found | WeInviteU",
      description: "The requested invitation template could not be found.",
    };
  }

  const pricing = getTemplatePricing(template);

  return {
    title: `${template.title} · 3D Digital Invitation (${pricing.price}) | WeInviteU`,
    description: `Preview ${template.title} — Premium interactive 3D digital invitation for ${template.category} celebrations. View the live preview and request customization for ${pricing.price}.`,
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = await fetchTemplate(id);

  if (!template) {
    notFound();
  }

  const pricing = getTemplatePricing(template);
  const html = await readTemplate(supabase, template.filename).catch(() => "");
  const walkthrough = getTemplateWalkthrough(template, html);
  const previewUrl = getTemplateUrl(template.filename);

  // Fetch related templates from the same category
  const { data: rawRelated } = await supabase
    .from("templates")
    .select("*")
    .neq("enabled", false)
    .neq("id", template.id)
    .order("id", { ascending: false });

  const allOther = rawRelated || [];
  const sameCategory = allOther.filter(
    (t) => t.category?.toLowerCase() === template.category?.toLowerCase()
  );
  const relatedTemplates = (sameCategory.length >= 3 ? sameCategory : allOther).slice(0, 3);

  const whatsappOrderUrl = `/api/whatsapp?template=${encodeURIComponent(
    template.title
  )}&text=${encodeURIComponent(
    `Hi WeInviteU! I would like to order the "${template.title}" template (${pricing.price}). Please guide me through customizing it for my celebration.`
  )}`;

  return (
    <main className={styles.detailPage}>
      <div className={styles.container}>
        {/* ── Top Bar & Breadcrumbs ── */}
        <nav className={styles.topBar} aria-label="Breadcrumb">
          <Link href="/templates" className={styles.backLink}>
            <ArrowLeft size={16} /> All Templates
          </Link>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <ChevronRight size={13} />
            <Link href="/templates">Templates</Link>
            <ChevronRight size={13} />
            <Link href={`/templates?category=${encodeURIComponent(template.category)}`}>
              {template.category}
            </Link>
            <ChevronRight size={13} />
            <span className={styles.current}>{template.title}</span>
          </div>
        </nav>

        {/* ── Main Two-Column Showcase: Simulator + Pricing ── */}
        <section className={styles.heroShowcase}>
          {/* Left: Realistic Live Phone Simulator */}
          <SimulatorStage previewUrl={previewUrl} templateTitle={template.title} />

          {/* Right: Overview, Price Box, and Direct Actions */}
          <div className={styles.overviewCol}>
            <div className={styles.badgeRow}>
              <span className={styles.badgePill}>{template.badge || "EXCLUSIVE"}</span>
              <span className={styles.categoryPill}>{template.category}</span>
              <span className={styles.categoryPill}>✦ 3D Interactive</span>
              {walkthrough.hasAudio && <span className={styles.categoryPill}>🎵 Audio supported</span>}
            </div>

            <h1 className={styles.templateTitle}>
              {template.title}
              <br />
              <em>Digital Invitation</em>
            </h1>

            <p className={styles.templateLead}>
              Preview this {template.category.toLowerCase()} invitation and explore its design.
              Ask our studio about personalizing the wording and media available in this template.
            </p>

            {/* Price & Value Proposition Card */}
            <div className={styles.pricingCard}>
              <div className={styles.priceHeader}>
                <span className={styles.currentPrice}>{pricing.price}</span>
                {pricing.originalPrice && (
                  <span className={styles.originalPrice}>{pricing.originalPrice}</span>
                )}
                {pricing.discount && (<span className={styles.discountBadge}>{pricing.discount}</span>)}
              </div>
              <p className={styles.priceSubtitle}>
                One-time payment · Unlimited guest shares · No monthly subscriptions
              </p>

              <div className={styles.ctaButtonGroup}>
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnWhatsAppPrimary}
                >
                  <WhatsAppIcon size={22} /> Order via WhatsApp ({pricing.price})
                </a>
                <a href="#inquiry-form" className={styles.btnSecondaryAction}>
                  Request Customization / Inquire Below
                </a>
              </div>

              {/* Inclusions */}
              <div className={styles.inclusionsList}>
                {walkthrough.highlights.map(item => <div key={item} className={styles.inclusionItem}>
                  <CheckCircle2 size={16} className={styles.checkIcon} /><span>{item}</span>
                </div>)}
              </div>
            </div>

            {/* Quick Specs Cards */}

          </div>
        </section>

        {/* ── Section: STARTING TO END CONTENTS WALKTHROUGH ── */}
        <section className={styles.walkthroughSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>START-TO-FINISH EXPERIENCE BREAKDOWN</p>
            <h2 className={styles.sectionHeading}>
              What&apos;s Inside <em>This Template</em>
            </h2>
            <p className={styles.sectionDesc}>
              These headings come from the template file in document order. Use the live preview
              to explore animations and any content added as you interact.
            </p>
          </div>

          {/* Opening Reveal Banner */}
          <div className={styles.openingBanner}>
            <div className={styles.openingIconHalo}>
              <Sparkles size={34} />
            </div>
            <div className={styles.openingContent}>
              <h3>Live Preview: {walkthrough.openingAction}</h3>
              <p>{walkthrough.openingDescription}</p>
            </div>
          </div>

          {walkthrough.steps.length === 0 && <p className={styles.sectionDesc}>
            Section headings are not available for this template. Explore the live preview for its full contents.
          </p>}
          {/* Sequential Step Timeline */}
          <div className={styles.timelineStepper}>
            {walkthrough.steps.map((step) => (
              <article key={step.step} className={styles.stepCard}>
                <div className={styles.stepNumberCol}>
                  <div className={styles.stepNumberBubble}>
                    {step.step < 10 ? `0${step.step}` : step.step}
                  </div>
                  <span className={styles.stepPhaseBadge}>{step.badge}</span>
                </div>

                <div className={styles.stepBody}>
                  <div className={styles.stepTopRow}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepHeadline}>{step.headline}</p>
                  </div>

                  <p className={styles.stepDesc}>{step.description}</p>

                  {/* Dual Breakdown: What guests experience vs What is customized */}
                  {(step.whatGuestsExperience || step.customizableFields.length > 0) && <div className={styles.stepBreakdownGrid}>
                    <div className={styles.breakdownBox}>
                      <div className={styles.breakdownBoxTitle}>
                        <Sparkles size={13} /> What Guests Experience
                      </div>
                      <p className={styles.breakdownBoxContent}>
                        {step.whatGuestsExperience}
                      </p>
                    </div>

                    <div className={styles.breakdownBox}>
                      <div className={styles.breakdownBoxTitle}>
                        <Layers size={13} /> What You Customize
                      </div>
                      <ul className={styles.customList}>
                        {step.customizableFields.map((field, idx) => (
                          <li key={idx}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  </div>}

                  {/* Feature pills */}
                  {step.features && step.features.length > 0 && (
                    <div className={styles.featuresPillsRow}>
                      {step.features.map((feat, idx) => (
                        <span key={idx} className={styles.featurePill}>
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Technical Specifications & Features ── */}
        <section className={styles.techSpecsSection}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <p className={styles.sectionEyebrow}>DETECTED TEMPLATE FEATURES</p>
            <h2 className={styles.sectionHeading} style={{ fontSize: "32px", margin: 0 }}>
              Template <em>Features</em>
            </h2>
          </div>

          <div className={styles.techGrid}>
            {walkthrough.techSpecs.map((spec, idx) => (
              <div key={idx} className={styles.techItem}>
                <div className={styles.techItemLabel}>{spec.label}</div>
                <div className={styles.techItemValue}>{spec.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Instant Order / Inquiry Section ── */}
        <section className={styles.inquirySection} id="inquiry-form">
          <div style={{ textAlign: "center" }}>
            <p className={styles.sectionEyebrow}>FAST & EFFORTLESS SETUP</p>
            <h2 className={styles.sectionHeading} style={{ fontSize: "36px" }}>
              Ready to Customize <em>{template.title}</em>?
            </h2>
            <p className={styles.sectionDesc}>
              Leave your details below. Our design studio will contact you promptly to gather your
              names, ceremony timings, photos, and music preference.
            </p>
          </div>

          <TemplateInquiryForm
            templateTitle={template.title}
            templatePrice={pricing.price}
            templateCategory={template.category}
          />
        </section>

        {/* ── Recommended & Similar Templates ── */}
        {relatedTemplates.length > 0 && (
          <section className={styles.relatedSection}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p className={styles.sectionEyebrow}>MORE FROM OUR COLLECTION</p>
                <h2 className={styles.sectionHeading} style={{ fontSize: "32px", margin: 0 }}>
                  You Might Also <em>Love</em>
                </h2>
              </div>
              <Link href="/templates" className={styles.backLink}>
                View All Templates <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className={styles.relatedGrid}>
              {relatedTemplates.map((t) => (
                <TemplateCard key={t.filename} template={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
