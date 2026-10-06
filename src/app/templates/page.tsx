"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import TemplateCard from "@/components/TemplateCard";
import styles from "./templates.module.css";

import { useEffect } from "react";
import type { Template, Category } from "@/lib/models";
import { supabase } from "@/lib/supabase";

export default function TemplatesPage() {
  return <Suspense fallback={<p role="status">Loading templates…</p>}><TemplatesCatalogue /></Suspense>;
}
function TemplatesCatalogue() {
  const urlCategory = useSearchParams().get('category') || 'all';
  const [selection, setSelection] = useState<{ urlCategory: string; value: string } | null>(null);
  const activeCategory = selection?.urlCategory === urlCategory ? selection.value : urlCategory;
  const setActiveCategory = (value: string) => setSelection({ urlCategory, value });
  const [categories, setCategories] = useState<{ label: string; key: string }[]>([
    { label: "All Templates", key: "all" }
  ]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch active categories
        const catRes = await fetch('/api/categories');
        if (!catRes.ok) throw new Error('Could not load categories.');
        const activeCats: Category[] = await catRes.json();
        if (!Array.isArray(activeCats)) throw new Error('Invalid categories response.');

        // 2. Fetch enabled templates from Supabase
        const { data: rawTemplates, error: tError } = await supabase
          .from('templates')
          .select('*')
          .neq('enabled', false);

        if (tError) {
          setError("Could not load templates. Please try again later.");
          return;
        }

        if (Array.isArray(activeCats)) {
          const activeNames = new Set(activeCats.map(c => c.name.trim().toLowerCase()));
          const activeIds = new Set(activeCats.map(c => c.id));

          // Only keep templates that belong to an ACTIVE category
          const visibleTemplates = (rawTemplates || []).filter(t => {
            if (t.category_id && activeIds.has(t.category_id)) return true;
            if (t.category && activeNames.has(t.category.trim().toLowerCase())) return true;
            return false;
          });

          setCategories([
            { label: "All Templates", key: "all" },
            ...activeCats.map(c => ({ label: c.name, key: c.name }))
          ]);
          setTemplates(visibleTemplates);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load templates. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadData();

  }, []);

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category?.toLowerCase() === activeCategory.toLowerCase());

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
