import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, CalendarDays } from "lucide-react";
import styles from "./CollectionHero.module.css";

export default function CollectionHero() {
  return (
    <div
      className={styles.showcase}
      aria-label="Live wedding invitation website preview"
    >
      <div className={styles.website}>
        <nav className={styles.nav} aria-label="Featured invitation navigation">
          <Link href="/invite/royal-garden" className={styles.brand}>
            Arjun & Priya
          </Link>
          <div>
            <a href="#featured-celebration">The day</a>
            <Link href="/invite/royal-garden#w-rsvp">
              RSVP <ArrowUpRight size={12} />
            </Link>
          </div>
        </nav>
        <div className={styles.hero}>
          <Image
            src="/template-photos/royal-garden.webp"
            alt="Arjun and Priya celebrating at a palace"
            fill
            sizes="(max-width:760px) 90vw, 46vw"
            priority
          />
          <div className={styles.copy}>
            <p>WE’RE GETTING MARRIED</p>
            <h2>
              Arjun <em>&</em> Priya
            </h2>
            <span>And we’d love you to be there.</span>
          </div>
        </div>
        <section
          id="featured-celebration"
          className={styles.details}
          aria-label="Wedding day details"
        >
          <div>
            <CalendarDays size={17} />
            <p>
              <strong>12 December 2027</strong>
              <span>Sunday · 6:00 PM</span>
            </p>
          </div>
          <div>
            <MapPin size={17} />
            <p>
              <strong>The Leela Palace</strong>
              <span>Bengaluru, India</span>
            </p>
          </div>
        </section>
        <div className={styles.rsvp}>
          <p>
            A day to remember.<span>Made better with you.</span>
          </p>
          <Link href="/invite/royal-garden#w-rsvp">
            I’ll be there <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <Link href="/invite/royal-garden" className={styles.link}>
        <span>
          Open live invitation
          <span className={styles.url}>/invite/royal-garden</span>
        </span>
        <ArrowUpRight size={21} />
      </Link>
    </div>
  );
}
