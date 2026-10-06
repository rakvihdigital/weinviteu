"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, ArrowRight, MessageSquare } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setOpen(false);
  }

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (path.startsWith("/invite/") || path.startsWith("/admin")) return null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/templates", label: "Templates" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <header className="header">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <img
            src="/images/logo.png"
            alt="WeInviteU"
            className="logo-img"
          />
          <span className="brand-name">
            WeInviteU<small>A LITTLE MORE PERSONAL</small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="header-nav-wrap">
          <nav className="desktop-navigation" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => {
              const isActive = href === "/" ? path === href : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="nav-label">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="header-cta-group">
            <a
              href="/api/whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="header-cta whatsapp"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={20} />
              <span>WhatsApp</span>
            </a>
            <Link href="/contact" className="header-cta primary">
              <span>Get in Touch</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          className="icon-button mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-overlay ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav
        id="mobile-navigation"
        className={`mobile-navigation ${open ? "open" : ""}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav-links">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/" ? path === href : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mobile-nav-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{label}</span>
                <ArrowRight size={15} className="mobile-nav-arrow" />
              </Link>
            );
          })}
        </div>

        <div className="mobile-cta-group">
          <a
            href="/api/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-cta whatsapp"
            onClick={() => setOpen(false)}
          >
            <WhatsAppIcon size={20} />
            <span>WhatsApp</span>
          </a>
          <Link
            href="/contact"
            className="mobile-nav-cta primary"
            onClick={() => setOpen(false)}
          >
            <MessageSquare size={14} />
            <span>Get in Touch</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mobile-nav-footer">
          Handcrafted 3D Digital Invitations
        </div>
      </nav>
    </>
  );
}
