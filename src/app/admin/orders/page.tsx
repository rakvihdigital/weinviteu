"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import Link from "next/link";
import { Edit, History, Inbox, ExternalLink } from "lucide-react";
import { api, errorMessage, jsonBody } from "@/lib/client-api";
import type { Order } from "@/lib/models";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState<Order[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => {
    api<Order[]>('/api/admin/orders').then(data => { setOrders(data); setQuery(new URLSearchParams(window.location.search).get('q') || ''); }).catch(e => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);
  async function complete(id: string) {
    setPending(true);
    try {
      await api('/api/admin/orders', { ...jsonBody({ id, status: 'Completed' }), method: 'PATCH' });
      setOrders(previous => previous.map(o => o.id === id ? { ...o, status: 'Completed' } : o));
    } catch (e) { setError(errorMessage(e)); }
    finally { setPending(false); }
  }

  const getStatusClass = (status: string) => {
    switch(status) {
      case "New Inquiry": return styles.statusPending;
      case "Customizing": return styles.statusActive;
      case "Link Delivered": return styles.statusSent;
      case "Completed": return styles.statusSent;
      default: return "";
    }
  };

  const activeOrders = orders.filter(o => o.status !== "Completed");
  const historyOrders = orders.filter(o => o.status === "Completed");
  const dataToShow = (activeTab === "active" ? activeOrders : historyOrders).filter(o => `${o.client_name} ${o.email} ${o.template_name} ${o.id}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Inquiries & Orders</h2>
          <p>Manage all client requests, active edits, and past history.</p>
        </div>
      </div>

      <input aria-label="Search orders" placeholder="Search orders…" value={query} onChange={e => setQuery(e.target.value)} style={{ padding: 12, marginBottom: 16 }} />
      {error && <p role="alert">{error}</p>}
      <div className={styles.card} style={{ padding: 0, overflow: "auto" }}>
        
        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #eaeaea", background: "rgba(255, 255, 255, 0.05)" }}>
          <button 
            onClick={() => setActiveTab("active")}
            style={{
              padding: "16px 24px", background: "none", border: "none", cursor: "pointer",
              borderBottom: activeTab === "active" ? "2px solid #1a1a1a" : "2px solid transparent",
              color: activeTab === "active" ? "var(--ink)" : "var(--muted)",
              fontWeight: activeTab === "active" ? 600 : 500,
              display: "flex", alignItems: "center", gap: "8px", fontSize: "13px"
            }}
          >
            <Inbox size={16} /> Active Orders ({activeOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            style={{
              padding: "16px 24px", background: "none", border: "none", cursor: "pointer",
              borderBottom: activeTab === "history" ? "2px solid #1a1a1a" : "2px solid transparent",
              color: activeTab === "history" ? "var(--ink)" : "var(--muted)",
              fontWeight: activeTab === "history" ? 600 : 500,
              display: "flex", alignItems: "center", gap: "8px", fontSize: "13px"
            }}
          >
            <History size={16} /> Completed History ({historyOrders.length})
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
              {dataToShow.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--muted)", marginBottom: "10px" }}>{loading ? "Loading orders…" : "No orders found."}</p>
                  </td>
                </tr>
              )}
              {dataToShow.map((o) => (
                <tr key={o.id} style={{ animation: "fadeIn 0.3s ease" }}>
                  <td>
                    <div style={{ fontSize: "11px", color: "var(--muted)", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={o.id}>
                      {o.id}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{o.client_name}</span>
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>{o.email}</span>
                      {o.message && (
                        <span style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px", fontStyle: "italic", maxWidth: "200px" }}>
                          &ldquo;{o.message.length > 50 ? o.message.substring(0, 50) + '...' : o.message}&rdquo;
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{o.template_name}</td>
                  <td>{o.price || '₹0'}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td><span className={`${styles.statusBadge} ${getStatusClass(o.status)}`}>{o.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href={`/admin/customize?order=${o.id}`} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                        <Edit size={12} /> Edit
                      </Link>
                      {o.published_file && <a href={`/invite/${o.id}`} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                        <ExternalLink size={12} /> View Live
                      </a>}
                      {o.status !== "Completed" && <button disabled={pending} className={styles.btnSecondary} onClick={() => complete(o.id)}>Complete</button>}
                    </div>
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
