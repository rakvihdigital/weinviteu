import React from "react";
import Link from "next/link";
import { Eye, ArrowUpRight } from "lucide-react";
import { getTemplateUrl } from "@/lib/template-url";
import { getTemplatePricing } from "@/lib/template-pricing";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import LiveFrame from "@/components/LiveFrame";

export interface TemplateData {
  id?: number | string;
  title: string;
  filename: string;
  category: string;
  badge: string;
  bg?: string;
  price?: string;
  original_price?: string;
}

export default function TemplateCard({ template }: { template: TemplateData }) {
  const url = getTemplateUrl(template.filename);
  const detailUrl =
    template.id != null
      ? `/templates/${template.id}`
      : `/templates/${encodeURIComponent(
          template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        )}`;
  const pricing = getTemplatePricing(template);

  return (
    <article className="home-tmpl-card">
      <div className="home-tmpl-stage">
        <span className="home-tmpl-badge">{template.badge}</span>

        {/* Clickable stage overlay taking the user to the template's [id] page */}
        <Link
          href={detailUrl}
          className="home-tmpl-stage-link"
          aria-label={`View ${template.title} details, step-by-step contents, and pricing`}
        >
          <span className="home-tmpl-stage-hint">
            View Details & Contents <ArrowUpRight size={13} />
          </span>
        </Link>

        <div className="home-tmpl-phone">
          <div className="home-tmpl-screen">
            <div className="home-tmpl-notch" />
            <LiveFrame
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              src={url}
              title={template.title}
              loading="lazy"
              scrolling="no"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="home-tmpl-info">
        <div className="home-tmpl-meta">
          <Link href={detailUrl} className="home-tmpl-info-link">
            <h3>{template.title}</h3>
          </Link>
          <p>{template.category} · 3D Interactive</p>

          {/* Price displayed prominently inside the template card */}
          <div className="home-tmpl-price-row">
            <span className="home-tmpl-price">{pricing.price}</span>
            {pricing.originalPrice && (
              <span className="home-tmpl-price-orig">{pricing.originalPrice}</span>
            )}
            <span className="home-tmpl-price-badge">{pricing.discount}</span>
          </div>
        </div>

        <div className="home-tmpl-btns">
          <Link
            href={detailUrl}
            className="round-link"
            aria-label={`View ${template.title} starting-to-end contents`}
            title="View Details & Contents"
          >
            <ArrowUpRight size={15} />
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="round-link"
            aria-label={`Preview ${template.title} in new tab`}
            title="Preview in new tab"
          >
            <Eye size={14} />
          </a>
          <a
            href={`/api/whatsapp?template=${encodeURIComponent(template.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="home-wa-icon"
            aria-label="Order or inquire on WhatsApp"
            title="Inquire on WhatsApp"
          >
            <WhatsAppIcon size={24} />
          </a>
        </div>
      </div>
    </article>
  );
}
