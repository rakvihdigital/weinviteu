"use client";

import { useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import styles from "./templates.module.css";

import { useEffect } from "react";
import type { Template } from "@/lib/models";
import { supabase } from "@/lib/supabase";

const categories = [
  { label: "All Templates", key: "all" },
  { label: "Wedding", key: "Wedding" },
  { label: "Birthday", key: "Birthday" },
  { label: "Baby Shower", key: "Baby Shower" },
  { label: "Traditional", key: "Traditional" },
  { label: "Corporate", key: "Corporate" },
  { label: "Anniversary", key: "Anniversary" },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabase.from('templates').select('*').neq('enabled', false);
      if (error) setError("Could not load templates. Please try again later.");
      if (data) setTemplates(data);
      setLoading(false);
    }
    fetchTemplates();
  }, []);
  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <main className={styles.templatesPage}>
      {loading && <p role="status">Loading templates…</p>}
      {error && <p role="alert">{error}</p>}
      {/* Hero Banner */}
      <section className={styles.templatesHeroBanner}>
        <div className={styles.templatesHero}>
          <p className={styles.eyebrow}>CURATED COLLECTION</p>
          <h1>
            Every occasion,
            <br />
            <em>beautifully</em> told.
          </h1>
          <p>
            Premium 3D digital invitations crafted with care. Preview each
            template live — no edits, just pure beauty.
          </p>
        </div>
      </section>

      {/* Category pills */}
      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.categoryPill} ${activeCategory === cat.key ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className={styles.templatesCount}>
        SHOWING {filtered.length} OF {templates.length} TEMPLATES
      </p>

      {/* Grid */}
      <div className={styles.templatesGrid}>
        {filtered.map((t) => (
          <TemplateCard key={t.filename} template={t} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <p>No templates in this category yet. Check back soon!</p>
          <button
            className={styles.categoryPill}
            onClick={() => setActiveCategory("all")}
          >
            Show all templates
          </button>
        </div>
      )}
    </main>
  );
}
