"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import Link from "next/link";
import { Eye, Edit, History, Inbox, ExternalLink } from "lucide-react";

const mockOrders = [
  { id: "ORD-123", client: "Ananya & Rahul", email: "ananya@example.com", template: "Temple Cinematic", status: "New Inquiry", date: "Oct 2, 2026", price: "₹2,500" },
  { id: "ORD-122", client: "Priya Sharma", email: "priya@example.com", template: "Baby Shower Bloom", status: "Customizing", date: "Oct 1, 2026", price: "₹1,500" },
  { id: "ORD-121", client: "Mehta Family", email: "mehta@example.com", template: "Griha Pravesh", status: "Link Delivered", date: "Sep 28, 2026", price: "₹1,800" },
  { id: "ORD-120", client: "TechCorp Inc.", email: "hr@techcorp.com", template: "Summit Event", status: "Link Delivered", date: "Sep 25, 2026", price: "₹5,000" },
];

const mockHistory = [
  { id: "ORD-119", client: "Sneha & Varun", email: "sneha@example.com", template: "Classic Elegance", status: "Completed", date: "Sep 15, 2026", price: "₹2,500" },
  { id: "ORD-118", client: "Rohan's 1st Birthday", email: "rohan.dad@example.com", template: "Birthday Sparkle", status: "Completed", date: "Sep 10, 2026", price: "₹1,200" },
  { id: "ORD-117", client: "Karthik Family", email: "karthik@example.com", template: "Sacred Pooja", status: "Completed", date: "Aug 22, 2026", price: "₹1,800" },
  { id: "ORD-116", client: "Anjali & Vikram", email: "anjali@example.com", template: "Anniversary Glow", status: "Completed", date: "Aug 05, 2026", price: "₹2,000" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("active");

  const getStatusClass = (status: string) => {
    switch(status) {
      case "New Inquiry": return styles.statusPending;
      case "Customizing": return styles.statusActive;
      case "Link Delivered": return styles.statusSent;
      case "Completed": return styles.statusSent;
      default: return "";
    }
  };

  const dataToShow = activeTab === "active" ? mockOrders : mockHistory;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Inquiries & Orders</h2>
          <p>Manage all client requests, active edits, and past history.</p>
        </div>
      </div>

      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        
        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #eaeaea", background: "#fafafa" }}>
          <button 
            onClick={() => setActiveTab("active")}
            style={{
              padding: "16px 24px", background: "none", border: "none", cursor: "pointer",
              borderBottom: activeTab === "active" ? "2px solid #1a1a1a" : "2px solid transparent",
              color: activeTab === "active" ? "#1a1a1a" : "#888",
              fontWeight: activeTab === "active" ? 600 : 500,
              display: "flex", alignItems: "center", gap: "8px", fontSize: "13px"
            }}
          >
            <Inbox size={16} /> Active Orders ({mockOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            style={{
              padding: "16px 24px", background: "none", border: "none", cursor: "pointer",
              borderBottom: activeTab === "history" ? "2px solid #1a1a1a" : "2px solid transparent",
              color: activeTab === "history" ? "#1a1a1a" : "#888",
              fontWeight: activeTab === "history" ? 600 : 500,
              display: "flex", alignItems: "center", gap: "8px", fontSize: "13px"
            }}
          >
            <History size={16} /> Completed History ({mockHistory.length})
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Details</th>
                <th>Template</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataToShow.map((o) => (
                <tr key={o.id} style={{ animation: "fadeIn 0.3s ease" }}>
                  <td><strong>{o.id}</strong></td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{o.client}</span>
                      <span style={{ fontSize: "11px", color: "#888" }}>{o.email}</span>
                    </div>
                  </td>
                  <td>{o.template}</td>
                  <td>{o.price}</td>
                  <td>{o.date}</td>
                  <td><span className={`${styles.statusBadge} ${getStatusClass(o.status)}`}>{o.status}</span></td>
                  <td>
                    {activeTab === "active" ? (
                      <Link href={`/admin/customize?order=${o.id.replace('ORD-', '')}`} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                        <Edit size={12} /> Customize Link
                      </Link>
                    ) : (
                      <button className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "11px", color: "#555" }}>
                        <ExternalLink size={12} /> View Live Link
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
