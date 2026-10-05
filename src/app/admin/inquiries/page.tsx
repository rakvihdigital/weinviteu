"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Search,
  CheckCircle,
  Wand2,
  Clock,
  Check
} from "lucide-react";
import { api, errorMessage, jsonBody } from "@/lib/client-api";
import type { Order } from "@/lib/models";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    api<Order[]>('/api/admin/orders')
      .then((data) => {
        // Inquiries are client submissions that haven't been published/customized into an invitation order yet
        const leads = data.filter((o) => !o.published_file || o.status === 'New Inquiry' || o.status === 'Contacted');
        setInquiries(leads);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const markContacted = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Contacted' ? 'New Inquiry' : 'Contacted';
    setUpdatingId(id);
    try {
      await api('/api/admin/orders', {
        ...jsonBody({ id, status: nextStatus }),
        method: 'PATCH'
      });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = inquiries.filter((inquiry) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "new"
        ? inquiry.status === "New Inquiry"
        : inquiry.status === "Contacted";

    const searchText = `${inquiry.client_name} ${inquiry.email} ${inquiry.template_name} ${inquiry.message || ""}`.toLowerCase();
    const matchesSearch = searchText.includes(query.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const newCount = inquiries.filter((i) => i.status === "New Inquiry").length;
  const contactedCount = inquiries.filter((i) => i.status === "Contacted").length;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Client Inquiries</h2>
          <p>Prospective guest requests submitted via your website contact form. Review messages and start custom designs.</p>
        </div>
      </div>

      {error && (
        <div role="alert" className={styles.editorMessage}>
          {error}
        </div>
      )}

      {/* Metrics Bar */}
      <div className={styles.statsGrid} style={{ marginBottom: "28px" }}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(212, 175, 55, 0.12)", color: "var(--gold)" }}>
            <MessageSquare size={22} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Leads</p>
            <h4>{inquiries.length}</h4>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", borderColor: "rgba(245, 158, 11, 0.3)" }}>
            <Clock size={22} />
          </div>
          <div className={styles.statInfo}>
            <p>Needs Response</p>
            <h4>{newCount}</h4>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", borderColor: "rgba(59, 130, 246, 0.3)" }}>
            <CheckCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <p>Contacted</p>
            <h4>{contactedCount}</h4>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.35)", pointerEvents: "none" }} />
          <input
            aria-label="Search inquiries"
            placeholder="Search inquiries by client name, email, occasion or message…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              background: "rgba(255, 255, 255, 0.035)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13.5px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: "8px 16px", fontSize: "11.5px" }}
          >
            All Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={filter === "new" ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: "8px 16px", fontSize: "11.5px" }}
          >
            New ({newCount})
          </button>
          <button
            onClick={() => setFilter("contacted")}
            className={filter === "contacted" ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: "8px 16px", fontSize: "11.5px" }}
          >
            Contacted ({contactedCount})
          </button>
        </div>
      </div>

      {/* Inquiries Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {loading && (
          <div className={styles.card} style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "var(--muted)", margin: 0 }}>Loading client inquiries…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className={styles.card} style={{ textAlign: "center", padding: "50px 20px" }}>
            <MessageSquare size={36} color="var(--gold)" style={{ margin: "0 auto 14px", opacity: 0.7 }} />
            <h3 style={{ margin: "0 0 6px", fontFamily: "var(--serif)", fontSize: "18px" }}>No Inquiries Found</h3>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "13px" }}>
              {query ? "Try clearing your search query." : "When clients submit the contact form on your website, their requests will appear here."}
            </p>
          </div>
        )}

        {filtered.map((inquiry) => {
          const isNew = inquiry.status === "New Inquiry";
          return (
            <div
              key={inquiry.id}
              className={styles.card}
              style={{
                borderLeft: isNew ? "4px solid var(--gold)" : "4px solid rgba(59, 130, 246, 0.5)",
                padding: "24px 28px",
              }}
            >
              {/* Header: Client & Meta */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: isNew ? "rgba(212, 175, 55, 0.15)" : "rgba(59, 130, 246, 0.15)",
                      border: isNew ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid rgba(59, 130, 246, 0.3)",
                      color: isNew ? "var(--gold)" : "#60a5fa",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: "15px",
                      flexShrink: 0,
                    }}
                  >
                    {inquiry.client_name ? inquiry.client_name.charAt(0).toUpperCase() : "C"}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "#fff" }}>
                        {inquiry.client_name}
                      </h3>
                      <span
                        className={styles.statusBadge}
                        style={
                          isNew
                            ? { background: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)" }
                            : { background: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)" }
                        }
                      >
                        {inquiry.status}
                      </span>
                      <span
                        style={{
                          fontSize: "11.5px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "rgba(255, 255, 255, 0.06)",
                          color: "#fce7b2",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          fontWeight: 500,
                        }}
                      >
                        Occasion: {inquiry.template_name || "General Inquiry"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", fontSize: "12px", color: "var(--muted)" }}>
                      <a href={`mailto:${inquiry.email}`} style={{ color: "var(--muted)", textDecoration: "underline" }}>
                        {inquiry.email}
                      </a>
                      <span>•</span>
                      <span>
                        Received on {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Convert to Custom Invitation */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    disabled={updatingId === inquiry.id}
                    onClick={() => markContacted(inquiry.id, inquiry.status)}
                    className={styles.btnSecondary}
                    style={{ padding: "8px 14px", fontSize: "11px" }}
                    title="Toggle contacted status"
                  >
                    <Check size={13} />
                    <span>{inquiry.status === "Contacted" ? "Mark as New" : "Mark as Contacted"}</span>
                  </button>

                  <a
                    href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Regarding your ${inquiry.template_name || 'invitation'} inquiry - WeInviteU Atelier`)}`}
                    className={styles.btnSecondary}
                    style={{ padding: "8px 14px", fontSize: "11px" }}
                  >
                    <Mail size={13} />
                    <span>Reply Email</span>
                  </a>

                  <Link
                    href={`/admin/customize?order=${inquiry.id}`}
                    className={styles.btnPrimary}
                    style={{ padding: "8px 16px", fontSize: "11px" }}
                    title="Start customizing a 3D invitation for this client"
                  >
                    <Wand2 size={13} />
                    <span>Start Customization</span>
                  </Link>
                </div>
              </div>

              {/* Message Box */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  marginTop: "8px",
                }}
              >
                <div style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gold)", fontWeight: 600, marginBottom: "6px" }}>
                  Client Message & Requirements:
                </div>
                <p style={{ margin: 0, fontSize: "13.5px", color: "rgba(255, 255, 255, 0.88)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {inquiry.message ? inquiry.message : <em style={{ color: "var(--muted)" }}>No specific message provided. Client requested details for {inquiry.template_name || 'an invitation'}.</em>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
