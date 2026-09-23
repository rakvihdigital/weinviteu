import Link from "next/link";
import { ArrowUpRight, Heart, Music2, Sparkles } from "lucide-react";

export default function CollectionHero() {
  return (
    <div
      className="invitation-showcase"
      aria-label="Explore our digital invitation designs"
    >
      <div className="showcase-orbit" aria-hidden="true" />
      <span className="showcase-caption">
        <Sparkles size={14} /> A beautiful beginning starts here
      </span>
      <Link
        className="showcase-window"
        href="/designs/royal-garden"
        aria-label="Explore Palace of Promises wedding invitation"
      >
        <div className="showcase-toolbar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>aarav &amp; ananya / our wedding</span>
          <ArrowUpRight size={14} />
        </div>
        <div className="showcase-wedding">
          <div className="wedding-arch" aria-hidden="true">
            <span>
              A <i>&amp;</i> A
            </span>
          </div>
          <span className="wedding-overline">
            TOGETHER IS A BEAUTIFUL PLACE TO BE
          </span>
          <h2>
            Aarav <em>&amp;</em> Ananya
          </h2>
          <p>
            A lifetime of little moments.
            <br />
            And it all begins with you.
          </p>
          <span className="wedding-date">
            24 <i>/</i> FEBRUARY <i>/</i> 2027
          </span>
          <span className="wedding-open">
            You’re invited <ArrowUpRight size={14} />
          </span>
          <span className="wedding-sound">
            <Music2 size={12} /> A celebration with a soundtrack
          </span>
        </div>
      </Link>
      <div className="showcase-love">
        <Heart size={16} />
        <span>
          Made for your
          <br />
          <strong>once-in-a-lifetime.</strong>
        </span>
      </div>
      <Link
        className="showcase-ticket"
        href="/designs/golden-hour"
        aria-label="Explore Midnight Pass birthday invitation"
      >
        <div>
          <span>GOOD PEOPLE. GREAT NIGHT.</span>
          <strong>
            Let’s celebrate<span>↗</span>
          </strong>
          <small>THE MIDNIGHT PASS · YOU’RE ON THE LIST</small>
        </div>
        <span className="showcase-ticket-stub">
          ADMIT
          <br />
          <b>YOU</b>
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="showcase-footer">
        <Link href="/designs">
          Explore designs <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
