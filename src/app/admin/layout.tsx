"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  LayoutTemplate,
  Settings,
  LogOut,
  Search,
  ExternalLink,
  Wand2
} from "lucide-react";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Inquiries & Orders", icon: Inbox },
    { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/admin/customize", label: "Customizer", icon: Wand2 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  if (path === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/images/logo.png" alt="WeInviteU" style={{ width: "32px", height: "auto" }} />
            WeInviteU Admin
          </h1>
        </div>

        <nav className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" style={{ marginBottom: "12px" }}>
            <ExternalLink size={15} /> View Live Site
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: 0,
              fontSize: "13px",
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <form action="/admin/orders" className={styles.topbarSearch}>
            <Search size={16} color="#aaa" style={{ position: "absolute", margin: "11px 14px" }} />
            <input name="q" aria-label="Search orders" type="search" placeholder="Search orders..." style={{ paddingLeft: "36px" }} />
          </form>
          <div className={styles.topbarUser}>
            <div className={styles.avatar}>A</div>
            <span>Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
}
