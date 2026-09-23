import Link from "next/link";
export const metadata = { title: "How it works" };
export default function HowItWorks() {
  return (
    <main className="section about-page">
      <div className="center-heading">
        <p className="eyebrow">FROM AN IDEA TO AN EXPERIENCE</p>
        <h1>
          Create. Share.
          <br />
          <em>Celebrate.</em>
        </h1>
        <p>A beautiful invitation should be a joy to create.</p>
      </div>
      <div className="how-cards">
        {[
          [
            "01",
            "Choose your canvas",
            "Explore designs for every occasion. Preview the complete guest experience before choosing your favourite.",
            "/designs",
            "Explore designs",
          ],
          [
            "02",
            "Make it yours",
            "Add your names, date, story, and venue. Try a new palette or typeface and watch your invitation change instantly.",
            "/create",
            "Open the editor",
          ],
          [
            "03",
            "Send a little joy",
            "Create a demo link, copy it, or share it on WhatsApp. Once the website is hosted, friends can open that link on any device.",
            "/invite/arjun-priya",
            "See a guest demo",
          ],
        ].map(([n, title, body, href, cta]) => (
          <article key={n}>
            <span className="step-number">{n}</span>
            <h2>{title}</h2>
            <p>{body}</p>
            <Link className="text-link" href={href}>
              {cta} ↗
            </Link>
          </article>
        ))}
      </div>
      <section className="faq">
        <h2>A few things to know.</h2>
        {[
          [
            "Do I need an account?",
            "No. This version is an interactive frontend prototype. You can explore every design and editor without signing up.",
          ],
          [
            "Are my invitations saved?",
            "No server storage is connected. Export your invitation as a JSON file and import it later, or keep its demo link. Closing or refreshing the editor discards unsaved changes.",
          ],
          [
            "Can guests RSVP?",
            "The invitation includes a working demonstration form, but responses are not sent or stored. Real RSVP collection needs the future database integration.",
          ],
          [
            "Can I share an invitation?",
            "Yes. The demo link contains the invitation details, so no database is needed. The website must be deployed for other people to open it. Links may be long, and anyone with the link can read the details.",
          ],
          [
            "Can I add my own photos and video?",
            "This release uses included sample illustrations, original audio loops, and animated artwork. Custom media storage will be added with the backend.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
