import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import "./studio.css";
export const metadata: Metadata = {
  title: {
    default: "We Invite u",
    template: "%s | We Invite u",
  },
  description:
    "Create stunning 3D digital invitation websites for weddings, birthdays, engagements, baby showers, anniversaries, parties, poojas and every special occasion. Create. Share. Celebrate.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
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
