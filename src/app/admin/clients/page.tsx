"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { Search, Mail, Phone } from "lucide-react";

const mockClients = [
  { id: 1, name: "Ananya & Rahul", email: "ananya@example.com", phone: "+91 98765 43210", totalOrders: 1, joined: "Oct 2, 2026", status: "Active" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", phone: "+91 91234 56789", totalOrders: 2, joined: "Aug 15, 2026", status: "Active" },
  { id: 3, name: "Mehta Family", email: "mehta@example.com", phone: "+91 99887 76655", totalOrders: 1, joined: "Sep 28, 2026", status: "Active" },
  { id: 4, name: "TechCorp Inc.", email: "hr@techcorp.com", phone: "+91 99999 88888", totalOrders: 4, joined: "Jan 10, 2026", status: "Active" },
];

export default function ClientsPage() {
  const [clients] = useState(mockClients);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Client Management</h2>
          <p>View and manage your customer database.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>All Clients ({clients.length})</h3>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#888" style={{ position: "absolute", margin: "9px 12px" }} />
            <input type="text" placeholder="Search clients..." style={{ padding: "8px 12px 8px 32px", borderRadius: "20px", border: "1px solid #ddd", fontSize: "12px", outline: "none" }} />
          </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Info</th>
              <th>Total Orders</th>
              <th>Joined Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#666" }}><Mail size={12} /> {c.email}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#666" }}><Phone size={12} /> {c.phone}</span>
                  </div>
                </td>
                <td>{c.totalOrders} Orders</td>
                <td>{c.joined}</td>
                <td><span className={`${styles.statusBadge} ${styles.statusActive}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
