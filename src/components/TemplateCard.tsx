import React from "react";
import { Eye, MessageCircle } from "lucide-react";

export interface TemplateData {
  title: string;
  filename: string;
  category: string;
  badge: string;
  bg?: string;
}

export default function TemplateCard({ template }: { template: TemplateData }) {
  return (
    <article className="home-tmpl-card">
      <div className="home-tmpl-stage">
        <span className="home-tmpl-badge">{template.badge}</span>
        <div className="home-tmpl-phone">
          <div className="home-tmpl-screen">
            <div className="home-tmpl-notch" />
            <iframe
              src={`/templates/${encodeURIComponent(template.filename)}`}
              title={template.title}
              loading="lazy"
              scrolling="no"
            />
          </div>
        </div>
      </div>
      <div className="home-tmpl-info">
        <div>
          <h3>{template.title}</h3>
          <p>{template.category} · 3D Interactive</p>
        </div>
        <div className="home-tmpl-btns">
          <a
            href={`/templates/${encodeURIComponent(template.filename)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="round-link"
            aria-label={`Preview ${template.title}`}
          >
            <Eye size={14} />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="home-wa-icon"
            aria-label="WhatsApp"
          >
            <MessageCircle size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
