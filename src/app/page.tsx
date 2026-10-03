import Link from "next/link";
import { ArrowUpRight, Sparkles, Heart, Palette, Share2, Crown, Star, Gift, Flame } from "lucide-react";
import TemplateCard from "@/components/TemplateCard";

import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable caching so new templates show up immediately

export default async function Home() {
  const { data: allTemplates } = await supabase.from('templates').select('*').neq('enabled', false);

  const occasionsList = [
    { icon: 'crown', title: 'Weddings', description: 'Timeless ceremonies deserve a stunning introduction.', count: '3 templates', bg: '/images/occasion-wedding.jpg' },
    { icon: 'gift', title: 'Birthdays', description: 'Celebrate another trip around the sun in style.', count: '2 templates', bg: '/images/occasion-birthday.jpg' },
    { icon: 'star', title: 'Baby Showers', description: 'Welcome the little one with warmth and wonder.', count: '1 template', bg: '/images/occasion-babyshower.jpg' },
    { icon: 'flame', title: 'Traditional', description: 'Pooja, Griha Pravesh and sacred celebrations.', count: '2 templates', bg: '/images/occasion-traditional.jpg' }
  ];

  const templatesList = allTemplates || [];
  const weddingTemplates = templatesList.filter((t) => t.category === "Wedding");

  const iconMap: Record<string, React.ReactNode> = {
    crown: <Crown size={28} />,
    gift: <Gift size={28} />,
    star: <Star size={28} />,
    flame: <Flame size={28} />,
  };

  return (
    <main className="studio-home">
      {/* ── Hero ── */}
      <section className="studio-hero">
        <div className="studio-hero-grid">
          <div className="studio-copy">
            <p className="studio-label">
              <span /> THE INVITATION STUDIO
            </p>
            <h1>
              Make it
              <br />a <em>moment.</em>
            </h1>
            <p>
              Big feelings deserve a better invitation. Explore our collection of
              premium 3D digital invitations — crafted for every celebration that
              matters.
            </p>
            <div className="button-row">
              <Link href="/templates" className="button">
                Browse Templates <ArrowUpRight size={15} />
              </Link>
              <Link href="/about" className="text-link">
                Our story <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="studio-footnote">
              <b>✦</b> 9 handcrafted templates · Fully interactive 3D
            </div>
          </div>

          {/* Phone + Laptop mockup */}
          <div className="hero-devices">
            {/* Mobile phone */}
            {weddingTemplates.slice(0, 1).map((t) => (
              <Link
                key={t.filename}
                href={`/templates/${encodeURIComponent(t.filename)}`}
                target="_blank"
                className="hero-phone-wrap hero-phone-0"
              >
                <div className="hero-phone-frame">
                  <div className="hero-phone-inner">
                    <div className="hero-phone-notch" />
                    <iframe
                      src={`/templates/${encodeURIComponent(t.filename)}`}
                      title={t.title}
                      loading="lazy"
                      scrolling="no"
                    />
                  </div>
                </div>
                <span className="hero-phone-label">{t.title}</span>
              </Link>
            ))}

            {/* Laptop */}
            {weddingTemplates.slice(1, 2).map((t) => (
              <Link
                key={t.filename}
                href={`/templates/${encodeURIComponent(t.filename)}`}
                target="_blank"
                className="hero-laptop-wrap"
              >
                <div className="hero-laptop-frame">
                  <div className="hero-laptop-screen">
                    <iframe
                      src={`/templates/${encodeURIComponent(t.filename)}`}
                      title={t.title}
                      loading="lazy"
                      scrolling="no"
                    />
                  </div>
                </div>
                <div className="hero-laptop-base">
                  <div className="hero-laptop-notch" />
                </div>
                <span className="hero-phone-label">{t.title}</span>
              </Link>
            ))}

            <div className="collage-seal">
              <b>3D</b>
              INTERACTIVE
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker strip ── */}
      <div className="studio-ticker">
        <span>WEDDINGS</span>
        <b>✦</b>
        <span>BIRTHDAYS</span>
        <b>✦</b>
        <span>BABY SHOWERS</span>
        <b>✦</b>
        <span>POOJA</span>
        <b>✦</b>
        <span>GRIHA PRAVESH</span>
        <b>✦</b>
        <span>ANNIVERSARIES</span>
        <b>✦</b>
        <span>CORPORATE</span>
      </div>

      {/* ── Categories / Occasions ── */}
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FOR EVERY OCCASION</p>
            <h2>
              One studio,
              <br />
              <em>every</em> celebration.
            </h2>
          </div>
          <div>
            <p>
              From intimate ceremonies to grand celebrations, each template is
              a fully interactive 3D experience your guests will love.
            </p>
            <Link href="/templates" className="text-link">
              View all templates <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="occasions-grid">
          {occasionsList.map((o, i) => (
            <Link href="/templates" key={i} className="occasion-card">
              <img src={o.bg} alt="" className="occasion-bg" aria-hidden="true" />
              <div className="occasion-content">
                <span className="occasion-icon">{iconMap[o.icon]}</span>
                <h3>{o.title}</h3>
                <p>{o.description}</p>
                <small className="muted">{o.count}</small>
              </div>
              <ArrowUpRight size={15} className="occasion-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Template showcase with phone mockups ── */}
      <section className="section home-templates-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PREVIEW COLLECTION</p>
            <h2>
              Stunning <em>templates,</em>
              <br />
              ready to explore.
            </h2>
          </div>
          <Link href="/templates" className="button secondary">
            See all 9 templates <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="home-templates-grid">
          {templatesList.slice(0, 6).map((t) => (
            <TemplateCard key={t.filename} template={t} />
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section how-it-works-section" style={{ paddingBottom: "10px" }}>
        <div className="center-heading" style={{ marginBottom: "28px" }}>
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>
            Three steps to a
            <br />
            <em>beautiful</em> invitation.
          </h2>
        </div>
        <div className="how-section">
          <div className="how-image-wrap">
            <img
              src="/images/how_it_works.jpg"
              alt="Digital Invitation Process"
            />
          </div>
          <div className="steps">
            <div className="step">
              <span>01</span>
              <div>
                <h3>Browse & Choose</h3>
                <p>
                  Explore our curated collection and preview any template live
                  in your browser — fully interactive, nothing hidden.
           </p>
              </div>
            </div>
            <div className="step">
              <span>02</span>
              <div>
                <h3>Personalise</h3>
                <p>
                  We customise the template with your names, dates, venue,
                  photos and everything that makes it yours.
           </p>
              </div>
            </div>
            <div className="step">
              <span>03</span>
              <div>
                <h3>Share & Celebrate</h3>
                <p>
                  Get a unique link to share with your guests via WhatsApp,
                  Instagram or any way you love. Simple as that.
           </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="section" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <div className="center-heading">
          <p className="eyebrow">WHY WEINVITEU</p>
          <h2>
            Crafted for <em>perfection.</em>
          </h2>
          <p>
            Every detail matters when it&apos;s your special day. Here&apos;s what makes
            our invitations stand apart.
          </p>
        </div>

        <div className="feature-grid">
          <article>
            <Sparkles size={22} />
            <h3>Fully 3D Interactive</h3>
            <p>
              Not just a flat image — our invitations are immersive 3D
              experiences your guests can interact with.
            </p>
          </article>
          <article>
            <Palette size={22} />
            <h3>Premium Design</h3>
            <p>
              Each template is hand-crafted by professional designers with
              meticulous attention to typography and colour.
            </p>
          </article>
          <article>
            <Share2 size={22} />
            <h3>Instant Sharing</h3>
            <p>
              Share your invitation via a single link — works beautifully on
              WhatsApp, Instagram, email and everywhere else.
            </p>
          </article>
          <article>
            <Heart size={22} />
            <h3>Made with Love</h3>
            <p>
              Every celebration is unique. We put genuine care into making
              sure your invitation reflects your story.
            </p>
          </article>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <span>✦</span>
        <h2>
          Ready to make your
          <br />
          invitation <em>unforgettable?</em>
        </h2>
        <div className="button-row" style={{ justifyContent: "center" }}>
          <Link href="/templates" className="button">
            Browse Templates <ArrowUpRight size={14} />
          </Link>
          <a
            href="/api/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="button secondary"
          >
            Chat on WhatsApp <ArrowUpRight size={14} />
          </a>
        </div>
        <p>WEINVITEU · A LITTLE MORE PERSONAL</p>
      </section>
    </main>
  );
}
