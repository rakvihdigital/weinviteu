import Image from "next/image";
import Link from "next/link";
import styles from "./PageBanner.module.css";

type PageBannerProps = {
  crumb: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  posters?: string[];
};

const DEFAULT_POSTERS = [
  "/template-posters/baby-naming-little-star.webp",
  "/template-posters/birthday-golden-wish.webp",
  "/template-posters/opening-ceremony-the-grand-reveal.webp",
];

export default function PageBanner({ crumb, eyebrow, title, accent, description, posters = DEFAULT_POSTERS }: PageBannerProps) {
  const variant = crumb === "About Us" ? "story" : crumb === "Contact Us" ? "contact" : "collection";
  const caption = variant === "story" ? "Little details. Lasting memories." : variant === "contact" ? "A beautiful idea starts with hello." : "A first look. A forever feeling.";
  return (
    <section className={styles.banner} data-variant={variant}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{crumb}</span>
          </nav>
          <p className={styles.eyebrow}><span aria-hidden="true" />{eyebrow}</p>
          <h1>{title}<em>{accent}</em></h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.signature}><span aria-hidden="true">✧</span> Made personal. Made to be remembered.</div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.arch} />
          <span className={styles.orbit} />
          {variant === "contact" ? (
            <div className={styles.letter}>
              <span className={styles.noteLabel}>A NOTE TO YOUR NEXT CHAPTER</span>
              <span className={styles.hello}>Let’s make<br /><em>it yours.</em></span>
              <span className={styles.noteRule} />
              <span className={styles.noteSign}>With love, WeInviteU</span>
              <span className={styles.seal}>W</span>
            </div>
          ) : (
            <div className={styles.gallery}>
              {posters.slice(0, 3).map((src, i) => (
                <div key={src} className={styles.card} data-index={i}>
                  <Image src={src} alt="" width={390} height={844} sizes="(max-width: 600px) 120px, 180px" preload={i === 0} />
                </div>
              ))}
              <span className={styles.seal}>W</span>
            </div>
          )}
          <span className={styles.spark}>✧</span>
          <p className={styles.caption}>{caption}</p>
        </div>
      </div>
    </section>
  );
}
