"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  LayoutTemplate,
  Users,
  Settings,
  LogOut,
  Bell,
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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Inquiries & Orders", icon: Inbox },
    { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/admin/customize", label: "Customizer", icon: Wand2 },
    { href: "/admin/clients", label: "Clients", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1>
            <span>✦</span> WeInviteU Admin
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
            style={{
              background: "none",
              border: "none",
              color: "#8c8e7e",
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
          <div className={styles.topbarSearch}>
            <Search size={16} color="#aaa" style={{ position: "absolute", margin: "11px 14px" }} />
            <input type="text" placeholder="Search orders, templates, clients..." style={{ paddingLeft: "36px" }} />
          </div>
          <div className={styles.topbarUser}>
            <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
              <Bell size={20} color="#666" />
              <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: "#e53e3e", borderRadius: "50%" }}></span>
            </button>
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
