import Link from "next/link";
import {
  ArrowUpRight,
  Music2,
  MousePointer2,
  Smartphone,
  Send,
} from "lucide-react";
import CollectionHero from "@/components/CollectionHero";
import ExperienceLab from "@/components/ExperienceLab";
import TemplateGallery from "@/components/TemplateGallery";
import { templateRepository } from "@/lib/repository";
import { occasionData } from "@/data/occasions";
export default async function Home() {
  const all = await templateRepository.list();
  return (
    <main className="studio-home">
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
              Big feelings deserve a better invitation. Discover designs as
              individual as your celebration—with a little 3D magic and a
              soundtrack of your own.
            </p>
            <div className="button-row">
              <Link className="button" href="/designs">
                Find your design <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/create">
                Make it yours ↗
              </Link>
            </div>
          </div>
          <CollectionHero />
        </div>
      </section>
      <div
        className="studio-ticker"
        aria-label="Your people. Your story. Your invitation. Let’s celebrate. Made with love. Moments to remember."
      >
        <div className="celebration-track">
          {[0, 1].map((copy) => (
            <div
              className="celebration-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {[
                "Your people.",
                "Your story.",
                "Your invitation.",
                "Let’s celebrate.",
                "Made with love.",
                "Moments to remember.",
              ].map((phrase) => (
                <span key={phrase}>
                  {phrase}
                  <b aria-hidden="true">✳</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section className="section studio-collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / THE NEW COLLECTION</p>
            <h2>Pick a personality.</h2>
          </div>
          <div>
            <p>
              A front-page love story. A ticket to a great night.
              <br />A record worth playing again. Find your kind of invite.
            </p>
            <Link className="text-link" href="/designs">
              Explore all {all.length} designs <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="occasion-collection-rows">
          {occasionData.map((occasion, index) => (
            <section
              className="occasion-collection-row"
              key={occasion.id}
              aria-labelledby={`collection-${occasion.id}`}
            >
              <div className="collection-row-heading">
                <h3 id={`collection-${occasion.id}`}>
                  <span>0{index + 1}</span>
                  {occasion.name}
                </h3>
                <Link href={`/designs?category=${occasion.id}`}>
                  Explore occasion <ArrowUpRight size={14} />
                </Link>
              </div>
              <TemplateGallery
                templates={all.filter(
                  (template) => template.category === occasion.id,
                )}
                compact
              />
            </section>
          ))}
        </div>
      </section>
      <ExperienceLab />
      <section className="section studio-occasions">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / LIFE IS THE OCCASION</p>
            <h2>
              Whatever you’re celebrating,
              <br />
              <em>we’re here for it.</em>
            </h2>
          </div>
        </div>
        <div className="occasion-card-grid">
          {occasionData.map((o, i) => (
            <Link
              className={`occasion-card occasion-${o.id}`}
              key={o.id}
              href={`/designs?category=${o.id}`}
            >
              <div className="occasion-card-top">
                <span>0{i + 1}</span>
                <span className="occasion-card-icon" aria-hidden="true">
                  {o.mark}
                </span>
              </div>
              <h3>{o.name}</h3>
              <p>{o.description}</p>
              <div className="occasion-card-bottom">
                <span>
                  {all.filter((template) => template.category === o.id).length}{" "}
                  designs to make yours
                </span>
                <ArrowUpRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="invitation-journey" aria-labelledby="journey-heading">
        <div className="journey-heading">
          <div>
            <p className="eyebrow">04 / FROM “THIS ONE” TO “SEE YOU THERE”</p>
            <h2 id="journey-heading">
              Your moment.
              <br />
              <em>Three little steps.</em>
            </h2>
          </div>
          <p>
            From finding your favourite design to bringing your favourite people
            together. Let’s make it yours.
          </p>
        </div>
        <ol className="journey-steps">
          {[
            [
              "01",
              "Choose your look.",
              "Twenty-four invitations across eight occasions. Find the one that feels like you.",
              "/designs",
              "Find your design",
              "THE FIRST SPARK",
            ],
            [
              "02",
              "Tell your story.",
              "Add names, dates, your venue, a little personality, and the perfect soundtrack.",
              "/create",
              "Make it personal",
              "THE PERSONAL TOUCH",
            ],
            [
              "03",
              "Bring them together.",
              "Preview your invitation, create a demo link, and share the excitement.",
              "/invite/arjun-priya",
              "See a guest preview",
              "THE HAPPY BEGINNING",
            ],
          ].map(([n, title, body, href, action, label]) => (
            <li className={`journey-step journey-step-${n}`} key={n}>
              <div className="journey-step-top">
                <span>{n}</span>
                <span>{label}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </div>
              <div className="journey-art" aria-hidden="true">
                {n === "01" && (
                  <div className="journey-design-stack">
                    <span className="journey-mini mini-left">
                      a little
                      <br />
                      <i>magic.</i>
                    </span>
                    <span className="journey-mini mini-main">
                      <small>THE WEDDING OF</small>
                      <strong>A &amp; A</strong>
                      <i>forever starts here</i>
                      <b>✦</b>
                    </span>
                    <span className="journey-mini mini-right">
                      let’s
                      <br />
                      <i>party.</i>
                    </span>
                    <span className="journey-selection">✓ This is the one</span>
                  </div>
                )}
                {n === "02" && (
                  <div className="journey-editor">
                    <div className="journey-editor-bar">
                      <i />
                      <i />
                      <i />
                      <span>Make it yours</span>
                    </div>
                    <div className="journey-editor-content">
                      <small>YOUR NAMES</small>
                      <strong>
                        Aarav &amp; Ananya<span>│</span>
                      </strong>
                      <small>THE BIG DAY</small>
                      <div className="journey-editor-date">
                        24 February 2027 <span>♡</span>
                      </div>
                      <div className="journey-swatches">
                        <i />
                        <i />
                        <i />
                        <i />
                        <span>Your kind of colour.</span>
                      </div>
                    </div>
                    <span className="journey-edit-badge">
                      A little more you.
                    </span>
                  </div>
                )}
                {n === "03" && (
                  <div className="journey-message-scene">
                    <div className="journey-message">
                      <span className="journey-message-icon">
                        <Send size={22} />
                      </span>
                      <small>A LITTLE SOMETHING FOR YOU</small>
                      <strong>You’re invited.</strong>
                      <span className="journey-message-link">
                        Open your invitation ↗
                      </span>
                    </div>
                    <span className="journey-reply">Wouldn’t miss it! ♡</span>
                    <span className="journey-message-star">✧</span>
                  </div>
                )}
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link href={href} className="journey-step-link">
                {action}
                <ArrowUpRight size={16} />
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="feature-section" aria-labelledby="feature-heading">
        <div className="feature-section-heading">
          <div>
            <p className="eyebrow">THE DETAILS MAKE THE DIFFERENCE</p>
            <h2 id="feature-heading">
              A little extra, <em>in every invite.</em>
            </h2>
          </div>
          <p>
            More feeling. Less effort. Everything you need to make your
            invitation your own.
          </p>
        </div>
        <div className="feature-card-grid">
          {[
            [MousePointer2, "A little depth", "Interactive 3D entrances"],
            [Music2, "Set the mood", "Your choice of soundtrack"],
            [
              Smartphone,
              "Made for every screen",
              "Responsive invitation layouts",
            ],
            [Send, "Share the excitement", "One invitation, one link"],
          ].map(([Icon, title, desc], index) => {
            const I = Icon as typeof Music2;
            return (
              <article
                className={`feature-card feature-card-${index}`}
                key={String(title)}
              >
                <div className="feature-card-top">
                  <span className="feature-icon">
                    <I size={24} strokeWidth={1.5} />
                  </span>
                  <span>0{index + 1}</span>
                </div>
                <div className="feature-illustration" aria-hidden="true">
                  {index === 0 && (
                    <div className="feature-door">
                      <i />
                      <i />
                      <span>✦</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="feature-wave">
                      {[18, 34, 48, 27, 60, 42, 24, 50, 35, 18].map(
                        (height, i) => (
                          <i key={i} style={{ height }} />
                        ),
                      )}
                    </div>
                  )}
                  {index === 2 && (
                    <div className="feature-devices">
                      <span className="feature-desktop">A &amp; A</span>
                      <span className="feature-phone">♡</span>
                    </div>
                  )}
                  {index === 3 && (
                    <div className="feature-share">
                      <span>you’re invited</span>
                      <span>See you there! ♡</span>
                      <i>↗</i>
                    </div>
                  )}
                </div>
                <h3>{String(title)}</h3>
                <p>{String(desc)}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="closing-section">
        <div className="closing-banner">
          <div className="closing-copy">
            <span className="eyebrow">LET’S MAKE SOMETHING WORTH OPENING.</span>
            <h2>
              You bring the people.
              <br />
              We’ll bring the <em>invite.</em>
            </h2>
            <p>Your next beautiful memory starts with an invitation.</p>
            <div className="closing-actions">
              <Link className="button" href="/designs">
                Explore the collection <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/invite/arjun-priya">
                Take a little look <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="closing-art" aria-hidden="true">
            <span className="closing-spark spark-one">✦</span>
            <span className="closing-spark spark-two">✧</span>
            <div className="closing-invite">
              <span>A MOMENT FOR US</span>
              <strong>
                You’re
                <br />
                <em>invited.</em>
              </strong>
              <i>With love, always.</i>
            </div>
            <div className="closing-envelope">
              <span>W</span>
            </div>
            <span className="closing-art-note">
              Good things are on their way.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
