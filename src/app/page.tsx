import type React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Heart, Palette, Share2, Crown, Star, Gift, Flame } from "lucide-react";
import TemplateCard from "@/components/TemplateCard";
import LiveFrame from "@/components/LiveFrame";
import { getTemplatePoster } from "@/lib/template-posters";
import HeroChakra from "@/components/HeroChakra";
import { getTemplateUrl } from "@/lib/template-url";

import { templateIsVisible } from "@/lib/template-visibility";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable caching so new templates show up immediately

export default async function Home() {
  const [
    { data: activeCategories },
    { data: rawTemplates }
  ] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('templates').select('*').neq('enabled', false)
  ]);

  const activeCats = activeCategories || [];
  const activeCatNames = new Set(activeCats.map(c => c.name.trim().toLowerCase()));

  // Only keep templates that belong to an active category
  const allTemplates = (rawTemplates || []).filter(t => templateIsVisible(t, activeCats));

  // Compute per-category counts dynamically from templates
  const countByCategory = (cat: string) => {
    const n = (allTemplates || []).filter((t) => t.category?.toLowerCase() === cat.toLowerCase()).length;
    return n === 1 ? '1 template' : `${n} template${n !== 1 ? 's' : ''}`;
  };

  const rawOccasions = [
    {
      icon: 'crown',
      badge: 'Royal & Timeless',
      title: 'Weddings',
      category: 'Wedding',
      description: 'Grand palace mandaps, floral romance, and breathtaking ceremony reveals.',
      bg: '/images/occasion-wedding.webp',
    },
    {
      icon: 'gift',
      badge: 'Milestone & Fun',
      title: 'Birthdays',
      category: 'Birthday',
      description: 'Champagne flutes, sparkling fairy lights, and unforgettable party moments.',
      bg: '/images/occasion-birthday.webp',
    },
    {
      icon: 'star',
      badge: 'Sweet Beginnings',
      title: 'Baby Showers',
      category: 'Baby Shower',
      description: 'Pastel floral cradles, golden stars, and heartfelt welcomes for your little one.',
      bg: '/images/occasion-babyshower.webp',
    },
    {
      icon: 'flame',
      badge: 'Sacred Rituals',
      title: 'Traditional',
      category: 'Traditional',
      description: 'Temple courtyard pooja, Griha Pravesh, marigold rangolis, and brass diya rituals.',
      bg: '/images/occasion-traditional.webp',
    },
  ];

  const occasionsList = rawOccasions.filter(o =>
    activeCatNames.has(o.category.toLowerCase())
  );

  // Ticker strip: active categories in the order set in Admin → Categories; each links to its templates.
  const tickerItems = activeCats.map((cat) => ({
    label: cat.name.trim(),
    href: `/templates?category=${encodeURIComponent(cat.name.trim())}`,
  }));

  const templatesList = allTemplates || [];
  const weddingTemplates = templatesList.filter((t) => t.category?.toLowerCase() === "wedding");
  const heroMobileTemplate = weddingTemplates[0] || templatesList[0];
  const heroLaptopTemplate = weddingTemplates[1] || templatesList[1] || heroMobileTemplate;

  const iconMap: Record<string, React.ReactNode> = {
    crown: <Crown size={22} />,
    gift: <Gift size={22} />,
    star: <Star size={22} />,
    flame: <Flame size={22} />,
  };

  return (
    <main className="studio-home">
      {/* ── 1. Hero: Light Peach / Warm Ivory ── */}
      <section className="studio-hero-banner">
        <div className="hero-artwork" aria-hidden="true" />
        <HeroChakra />
        <div className="studio-hero">
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
              <div className="hero-button-row">
                <Link href="/templates" className="button-browse-templates hero-btn-primary">
                  Browse Templates <ArrowUpRight size={15} />
                </Link>
                <Link href="/contact" className="button-get-in-touch hero-btn-secondary">
                  Get in Touch <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="studio-footnote">
                {templatesList.length} handcrafted template{templatesList.length !== 1 ? 's' : ''} · Fully interactive 3D
              </div>
            </div>

            {/* Phone + Laptop mockup */}
            <div className="hero-devices-stage">
              <div className="hero-devices">
                {/* Mobile phone */}
                {heroMobileTemplate && (
                  <Link
                    key={heroMobileTemplate.filename}
                    href={getTemplateUrl(heroMobileTemplate.filename)}
                    target="_blank"
                    className="hero-phone-wrap hero-phone-0"
                  >
                    <div className="hero-phone-frame">
                      <div className="hero-phone-inner">
                        <div className="hero-phone-notch" />
                        <LiveFrame hero poster={getTemplatePoster(heroMobileTemplate.filename)}
                          src={`${getTemplateUrl(heroMobileTemplate.filename)}?autoscroll=1&muted=1`}
                          title={heroMobileTemplate.title} loading="eager" scrolling="no"
                          sandbox="allow-scripts allow-forms allow-popups allow-modals" />
                      </div>
                    </div>
                    <span className="hero-phone-label">{heroMobileTemplate.title}</span>
                  </Link>
                )}

                {/* Laptop */}
                {heroLaptopTemplate && (
                  <Link
                    key={heroLaptopTemplate.filename}
                    href={getTemplateUrl(heroLaptopTemplate.filename)}
                    target="_blank"
                    className="hero-laptop-wrap"
                  >
                    <div className="hero-laptop-frame">
                      <div className="hero-laptop-screen">
                        <LiveFrame hero poster={getTemplatePoster(heroLaptopTemplate.filename)}
                          src={`${getTemplateUrl(heroLaptopTemplate.filename)}?autoscroll=1&muted=1`}
                          title={heroLaptopTemplate.title} loading="eager" scrolling="no"
                          sandbox="allow-scripts allow-forms allow-popups allow-modals" />
                      </div>
                    </div>
                    <div className="hero-laptop-base">
                      <div className="hero-laptop-notch" />
                    </div>
                    <span className="hero-phone-label">{heroLaptopTemplate.title}</span>
                  </Link>
                )}

                <div className="collage-seal">
                  <b>3D</b>
                  INTERACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker strip: occasions from the database ── */}
      {tickerItems.length > 0 && (
        <nav className="occasion-ticker" aria-label="Occasions we design for">
          <div className="occasion-ticker-track" style={{ "--ticker-duration": `${Math.max(24, tickerItems.length * 5)}s` } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="occasion-ticker-group" aria-hidden={copy === 1 || undefined}>
                {tickerItems.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} tabIndex={copy === 1 ? -1 : undefined}>{item.label}</Link>
                    <svg className="occasion-ticker-sep" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 0 9.6 6.4 16 8 9.6 9.6 8 16 6.4 9.6 0 8 6.4 6.4Z" />
                    </svg>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>
      )}

      {/* ── 2. Categories / Occasions: Light Black / Soft Obsidian ── */}
      <section className="home-band home-band-dark occasions-section">
        <div className="section-container">
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
              <Link
                href={`/templates?category=${encodeURIComponent(o.category)}`}
                key={i}
                className="occasion-card"
              >
                <img src={o.bg} alt={o.title} className="occasion-bg" />
                <div className="occasion-overlay" />
                
                <div className="occasion-top">
                  <span className="occasion-badge">
                    {o.badge}
                  </span>
                  <span className="occasion-arrow-btn" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                <div className="occasion-content">
                  <div className="occasion-icon-halo">{iconMap[o.icon]}</div>
                  <h3 className="occasion-title">{o.title}</h3>
                  <p className="occasion-desc">{o.description}</p>
                  <div className="occasion-footer">
                    <span className="occasion-count-pill">{countByCategory(o.category)}</span>
                    <span className="occasion-cta">
                      Explore Collection <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Preview Collection: Light Peach / Warm Ivory ── */}
      <section className="home-band home-band-peach home-templates-section">
        <div className="section-container">
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
              See all {templatesList.length} templates <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="home-templates-grid">
            {templatesList.slice(0, 6).map((t) => (
              <TemplateCard key={t.filename} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How It Works: Light Black / Soft Obsidian ── */}
      <section className="home-band home-band-dark how-it-works-section">
        <div className="section-container">
          <div className="center-heading" style={{ marginBottom: "36px" }}>
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
                src="/images/how_it_works.webp"
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
        </div>
      </section>

      {/* ── 5. Features Grid: Light Peach / Warm Ivory ── */}
      <section className="home-band home-band-peach why-section">
        <div className="section-container">
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
              <div className="feature-icon-halo"><Sparkles size={22} /></div>
              <h3>Fully 3D Interactive</h3>
              <p>
                Not just a flat image — our invitations are immersive 3D
                experiences your guests can interact with.
              </p>
            </article>
            <article>
              <div className="feature-icon-halo"><Palette size={22} /></div>
              <h3>Premium Design</h3>
              <p>
                Each template is hand-crafted by professional designers with
                meticulous attention to typography and colour.
              </p>
            </article>
            <article>
              <div className="feature-icon-halo"><Share2 size={22} /></div>
              <h3>Instant Sharing</h3>
              <p>
                Share your invitation via a single link — works beautifully on
                WhatsApp, Instagram, email and everywhere else.
              </p>
            </article>
            <article>
              <div className="feature-icon-halo"><Heart size={22} /></div>
              <h3>Made with Love</h3>
              <p>
                Every celebration is unique. We put genuine care into making
                sure your invitation reflects your story.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── 6. Closing CTA: Light Black / Royal Obsidian ── */}
      <section className="home-band home-band-dark cta-section">
        <div className="section-container">
          <h2>
            Ready to make your
            <br />
            invitation <em>unforgettable?</em>
          </h2>
          <div className="button-row" style={{ justifyContent: "center" }}>
            <Link href="/templates" className="button-browse-templates">
              Browse Templates <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="button-get-in-touch"
            >
              Get in Touch <ArrowUpRight size={14} />
            </Link>
          </div>
          <p className="cta-brand-tag">WEINVITEU · A LITTLE MORE PERSONAL</p>
        </div>
      </section>
    </main>
  );
}
