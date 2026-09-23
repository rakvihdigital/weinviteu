import Link from "next/link";
export const metadata = { title: "About WeInviteU" };
export default function About() {
  return (
    <main className="section about-page">
      <div className="center-heading">
        <p className="eyebrow">WHY WEINVITEU</p>
        <h1>
          Not just an invitation.
          <br />
          <em>An experience.</em>
        </h1>
        <p>
          We believe a celebration begins long before the first guest arrives.
        </p>
      </div>
      <section className="about-story">
        <span className="flourish">❦</span>
        <h2>Make the beginning as meaningful as the moment.</h2>
        <p>
          There is something special about being invited. It says: you matter,
          you belong, and this moment would be better with you in it.
        </p>
        <p>
          WeInviteU brings that feeling to the digital world. Thoughtful design,
          a little movement, your own story, and every detail your guests need —
          together in one beautiful experience.
        </p>
        <Link className="button" href="/how-it-works">
          Discover how it works ↗
        </Link>
      </section>
    </main>
  );
}
