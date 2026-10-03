"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/invite/") || path.startsWith("/admin")) return null;
  return (
    <header className="header">
      <Link href="/" className="logo" onClick={() => setOpen(false)}>
        <span className="logo-mark">
          w<span>✦</span>
        </span>
        <span className="brand-name">
          WeInviteU<small>A LITTLE MORE PERSONAL</small>
        </span>
      </Link>
      <button
        className="icon-button mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="navigation"
        className={open ? "navigation open" : "navigation"}
        aria-label="Main navigation"
      >
        {[
          ["/", "Home"],
          ["/about", "About Us"],
          ["/templates", "Templates"],
          ["/contact", "Contact Us"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              (href === "/" ? path === href : path.startsWith(href))
                ? "page"
                : undefined
            }
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
