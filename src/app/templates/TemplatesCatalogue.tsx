"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TemplateCard from "@/components/TemplateCard";
import type { Template, Category } from "@/lib/models";
import styles from "./templates.module.css";

export default function TemplatesCatalogue({ templates, activeCategories, error = "" }: { templates: Template[]; activeCategories: Category[]; error?: string }) {
  const urlCategory = useSearchParams().get('category') || 'all';
  const [selection, setSelection] = useState<{ urlCategory: string; value: string } | null>(null);
  const activeCategory = selection?.urlCategory === urlCategory ? selection.value : urlCategory;
  const setActiveCategory = (value: string) => setSelection({ urlCategory, value });
  const categories = [
    { label: "All Templates", key: "all" },
    ...activeCategories.map(category => ({ label: category.name, key: category.name })),
  ];

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <main className={styles.templatesPage}>
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
        {`SHOWING ${filtered.length} OF ${templates.length} TEMPLATES`}
      </p>

      {/* Grid */}
      <div className={styles.templatesGrid}>
        {filtered.map((t) => (
          <TemplateCard key={t.filename} template={t} />
        ))}
      </div>

      {/* Empty state */}
      {!error && filtered.length === 0 && (
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
