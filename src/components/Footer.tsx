"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { occasionData } from "@/data/occasions";

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/invite/")) return null;
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link
            className="footer-wordmark"
            href="/"
            aria-label="WeInviteU home"
          >
            <span>
              w<sup>✦</sup>
            </span>
            WeInviteU
          </Link>
          <p>
            A beautiful beginning for every celebration. Personal invitations,
            meaningful details, and all your favourite people.
          </p>
          <Link className="footer-start" href="/create">
            Create your invitation <ArrowUpRight size={16} />
          </Link>
          <span className="footer-signoff">
            <Heart size={13} /> Made for moments that matter.
          </span>
        </div>
        <nav className="footer-column" aria-label="Explore WeInviteU">
          <h2>Explore</h2>
          <Link href="/">Home</Link>
          <Link href="/designs">All invitation designs</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/about">Our story</Link>
          <Link href="/invite/arjun-priya">
            Experience a demo <ArrowUpRight size={12} />
          </Link>
        </nav>
        <nav className="footer-column" aria-label="Celebration occasions">
          <h2>Celebrate</h2>
          {occasionData.slice(0, 4).map((o) => (
            <Link key={o.id} href={`/designs?category=${o.id}`}>
              {o.name}
            </Link>
          ))}
        </nav>
        <nav className="footer-column" aria-label="More celebration occasions">
          <h2>More moments</h2>
          {occasionData.slice(4).map((o) => (
            <Link key={o.id} href={`/designs?category=${o.id}`}>
              {o.name}
            </Link>
          ))}
        </nav>
        <div className="footer-column footer-contact">
          <h2>Let’s connect</h2>
          <span className="demo-contact-label">DEMO CONTACT DETAILS</span>
          <span>
            <Mail size={14} /> hello@weinviteu.example
          </span>
          <span>
            <Phone size={14} /> +91 XXXXX XXXXX
          </span>
          <span>
            <MapPin size={14} /> Your city, India
          </span>
          <div
            className="footer-socials"
            aria-label="Demo social profiles — links coming soon"
          >
            <span title="Instagram — demo placeholder">
              <Instagram size={17} />
              <span className="social-label">Instagram (demo)</span>
            </span>
            <span title="Facebook — demo placeholder">
              <Facebook size={17} />
              <span className="social-label">Facebook (demo)</span>
            </span>
            <span title="WhatsApp — demo placeholder">
              <MessageCircle size={17} />
              <span className="social-label">WhatsApp (demo)</span>
            </span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <small>
          © {new Date().getFullYear()} WeInviteU. All rights reserved.
        </small>
        <span className="developer-credit">
          Developed by{" "}
          <a
            href="https://rakvih.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rakvih Solutions <ArrowUpRight size={12} />
          </a>
        </span>
        <Link href="#content">Back to top ↑</Link>
      </div>
    </footer>
  );
}
