import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import "./cinematic.css";
import "./studio.css";
import "./designs.css";
export const metadata: Metadata = {
  title: {
    default: "3D Digital Invitations for Every Occasion | WeInviteU",
    template: "%s | WeInviteU",
  },
  description:
    "Create stunning 3D digital invitation websites for weddings, birthdays, engagements, baby showers, anniversaries, parties, poojas and every special occasion. Create. Share. Celebrate.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <Header />
        <div id="content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
