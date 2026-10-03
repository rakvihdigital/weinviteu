"use client";

import { useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import styles from "./templates.module.css";

const templates = [
  {
    title: "Anniversary Glow",
    filename: "anniversary-invitation (1).html",
    category: "Anniversary",
    badge: "ANNIVERSARY",
    bg: "bgSage",
  },
  {
    title: "Baby Shower Bloom",
    filename: "baby-shower-invitation.html",
    category: "Baby Shower",
    badge: "BABY SHOWER",
    bg: "bgCream",
  },
  {
    title: "Birthday Sparkle",
    filename: "birthday-invitation.html",
    category: "Birthday",
    badge: "BIRTHDAY",
    bg: "bgRose",
  },
  {
    title: "Red & Gold Royale",
    filename: "birthday-red-gold.html",
    category: "Birthday",
    badge: "BIRTHDAY",
    bg: "bgPeach",
  },
  {
    title: "Griha Pravesh",
    filename: "griha-pravesh-invitation.html",
    category: "Traditional",
    badge: "HOUSEWARMING",
    bg: "bgOlive",
  },
  {
    title: "Classic Elegance",
    filename: "invitation (2).html",
    category: "Wedding",
    badge: "WEDDING",
    bg: "bgLinen",
  },
  {
    title: "Sacred Pooja",
    filename: "pooja-invitation.html",
    category: "Traditional",
    badge: "POOJA",
    bg: "bgMint",
  },
  {
    title: "Summit Event",
    filename: "summit-invitation.html",
    category: "Corporate",
    badge: "CORPORATE",
    bg: "bgSlate",
  },
  {
    title: "Temple Cinematic",
    filename: "temple-invitation.html",
    category: "Wedding",
    badge: "WEDDING",
    bg: "bgMauve",
  },
];

const categories = [
  { label: "All Templates", emoji: "✦", key: "all" },
  { label: "Wedding", emoji: "💍", key: "Wedding" },
  { label: "Birthday", emoji: "🎂", key: "Birthday" },
  { label: "Baby Shower", emoji: "👶", key: "Baby Shower" },
  { label: "Traditional", emoji: "🪔", key: "Traditional" },
  { label: "Corporate", emoji: "📋", key: "Corporate" },
  { label: "Anniversary", emoji: "❤️", key: "Anniversary" },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <main className={styles.templatesPage}>
      {/* Hero */}
      <section className={styles.templatesHero}>
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
      </section>

      {/* Category pills */}
      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.categoryPill} ${activeCategory === cat.key ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <span>{cat.emoji}</span> {cat.label}
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
            ✦ Show all templates
          </button>
        </div>
      )}
    </main>
  );
}
