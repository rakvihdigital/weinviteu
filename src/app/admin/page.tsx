import { Eye, MousePointerClick, Inbox, CreditCard } from "lucide-react";
import styles from "./admin.module.css";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here is what's happening with your studio today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: "#3b82f6", background: "#eff6ff" }}>
            <Eye size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Views</p>
            <h4>12,450</h4>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: "#10b981", background: "#ecfdf5" }}>
            <MousePointerClick size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Template Previews</p>
            <h4>3,120</h4>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: "#f59e0b", background: "#fffbeb" }}>
            <Inbox size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>New Inquiries</p>
            <h4>45</h4>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: "#8b5cf6", background: "#f5f3ff" }}>
            <CreditCard size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Active Orders</p>
            <h4>12</h4>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Recent Inquiries & Orders</h3>
          <Link href="/admin/orders" className={styles.btnSecondary}>
            View All
          </Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Template Requested</th>
              <th>Occasion</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ananya & Rahul</td>
              <td>Temple Cinematic</td>
              <td>Wedding</td>
              <td>Oct 2, 2026</td>
              <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>New Inquiry</span></td>
              <td>
                <Link href="/admin/customize?order=123" className={styles.btnPrimary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                  Review & Customize
                </Link>
              </td>
            </tr>
            <tr>
              <td>Priya Sharma</td>
              <td>Baby Shower Bloom</td>
              <td>Baby Shower</td>
              <td>Oct 1, 2026</td>
              <td><span className={`${styles.statusBadge} ${styles.statusActive}`}>Customizing</span></td>
              <td>
                <Link href="/admin/customize?order=122" className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                  Edit Draft
                </Link>
              </td>
            </tr>
            <tr>
              <td>Mehta Family</td>
              <td>Griha Pravesh</td>
              <td>Traditional</td>
              <td>Sep 28, 2026</td>
              <td><span className={`${styles.statusBadge} ${styles.statusSent}`}>Link Delivered</span></td>
              <td>
                <button className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                  View Live
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
