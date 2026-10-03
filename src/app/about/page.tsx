import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./about.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | WeInviteU",
  description: "Learn about our philosophy and process for crafting beautiful digital invitations.",
};

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>OUR STORY</span>
        <h1>
          Not just an invitation.
          <br />
          <em>An experience.</em>
        </h1>
        <p>
          We believe a celebration begins long before the first guest arrives. It begins the very moment they receive your invitation.
        </p>
      </section>

      {/* ── Manifesto Grid ── */}
      <section className={styles.manifestoSection}>
        <div className={styles.manifestoContainer}>
          <div className={styles.manifestoHeader}>
            <span className={styles.eyebrow}>THE PHILOSOPHY</span>
            <h2>Make the beginning as meaningful as the moment.</h2>
          </div>
          
          <div className={styles.manifestoGrid}>
            <article className={styles.manifestoCard}>
              <span className={styles.manifestoNumber}>01</span>
              <h3>Emotion in Motion</h3>
              <p>
                We grew tired of seeing beautiful celebrations announced through static, lifeless images. Your special day deserves an introduction that captures its true essence and scale through immersive 3D technology.
              </p>
            </article>
            
            <article className={styles.manifestoCard}>
              <span className={styles.manifestoNumber}>02</span>
              <h3>Meticulous Craft</h3>
              <p>
                Every template in our studio is meticulously crafted by professional designers. From elegant typography to fluid motion, we ensure that whether you are planning a grand wedding or an intimate baby shower, your story is told beautifully.
              </p>
            </article>
            
            <article className={styles.manifestoCard}>
              <span className={styles.manifestoNumber}>03</span>
              <h3>Effortless Joy</h3>
              <p>
                While our technology is complex, your experience should be seamless. We handle all the customization and hosting, providing you with a simple, elegant link that works perfectly across all devices and sharing platforms.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className={styles.storySection}>
        <div className={styles.storyImage}>
          <div className={styles.imageFrame}>
            <img 
              src="/images/about_studio.jpg" 
              alt="WeInviteU Design Studio"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className={styles.imageBadge}>
            EST. 2026 • DESIGN STUDIO •
          </div>
        </div>
        
        <div className={styles.storyContent}>
          <span className={styles.eyebrow}>THE STUDIO</span>
          <h2>
            Crafted with precision,<br />
            <em>delivered with love.</em>
          </h2>
          <p>
            There is something profoundly special about being invited. It says: you matter, you belong, and this moment would be infinitely better with you in it.
          </p>
          <p>
            WeInviteU brings that timeless feeling to the modern digital world. We act as your personal design studio, taking the stress out of digital invitations so you can focus on what truly matters: celebrating with the people you love.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <span className={styles.eyebrow}>GET STARTED</span>
        <h2>Ready to create your invitation?</h2>
        <div className={styles.buttonRow}>
          <Link href="/templates" className={styles.buttonPrimary}>
            Browse Templates <ArrowUpRight size={15} />
          </Link>
          <Link href="/contact" className={styles.buttonSecondary}>
            Get in Touch <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
