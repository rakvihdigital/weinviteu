"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

const initialTemplates = [
  { id: 1, title: "Anniversary Glow", category: "Anniversary", badge: "ANNIVERSARY", filename: "anniversary-invitation (1).html", status: "Active" },
  { id: 2, title: "Baby Shower Bloom", category: "Baby Shower", badge: "BABY SHOWER", filename: "baby-shower-invitation.html", status: "Active" },
  { id: 3, title: "Birthday Sparkle", category: "Birthday", badge: "BIRTHDAY", filename: "birthday-invitation.html", status: "Active" },
  { id: 4, title: "Red & Gold Royale", category: "Birthday", badge: "BIRTHDAY", filename: "birthday-red-gold.html", status: "Active" },
  { id: 5, title: "Griha Pravesh", category: "Traditional", badge: "HOUSEWARMING", filename: "griha-pravesh-invitation.html", status: "Active" },
  { id: 6, title: "Classic Elegance", category: "Wedding", badge: "WEDDING", filename: "invitation (2).html", status: "Active" },
  { id: 7, title: "Sacred Pooja", category: "Traditional", badge: "POOJA", filename: "pooja-invitation.html", status: "Active" },
  { id: 8, title: "Summit Event", category: "Corporate", badge: "CORPORATE", filename: "summit-invitation.html", status: "Active" },
  { id: 9, title: "Temple Cinematic", category: "Wedding", badge: "WEDDING", filename: "temple-invitation.html", status: "Active" },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", category: "", badge: "" });

  const handleEditClick = (t: any) => {
    setEditingId(t.id);
    setEditForm({ title: t.title, category: t.category, badge: t.badge });
  };

  const handleSave = () => {
    setTemplates(templates.map(t => 
      t.id === editingId 
        ? { ...t, title: editForm.title, category: editForm.category, badge: editForm.badge } 
        : t
    ));
    setEditingId(null);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Templates Management</h2>
          <p>Manage your 3D digital invitation templates.</p>
        </div>
        <button className={styles.btnPrimary}>
          <Plus size={16} /> Upload New Template
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Template Library ({templates.length})</h3>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Template Title</th>
              <th>Category</th>
              <th>Badge</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td>
                  <a href={`/templates/${encodeURIComponent(t.filename)}`} target="_blank" className={styles.btnSecondary} style={{ padding: "4px 8px" }}>
                    <Eye size={14} />
                  </a>
                </td>
                <td>
                  {editingId === t.id ? (
                    <input 
                      value={editForm.title} 
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                      style={{ padding: "6px", width: "150px" }}
                    />
                  ) : (
                    <strong>{t.title}</strong>
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input 
                      value={editForm.category} 
                      onChange={e => setEditForm({...editForm, category: e.target.value})}
                      style={{ padding: "6px", width: "100px" }}
                    />
                  ) : (
                    t.category
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input 
                      value={editForm.badge} 
                      onChange={e => setEditForm({...editForm, badge: e.target.value})}
                      style={{ padding: "6px", width: "100px" }}
                    />
                  ) : (
                    <span className={styles.statusBadge} style={{ background: "#f0f0f0", color: "#333" }}>{t.badge}</span>
                  )}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles.statusActive}`}>{t.status}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {editingId === t.id ? (
                      <button onClick={handleSave} className={styles.btnPrimary} style={{ padding: "6px 12px", fontSize: "11px" }}>Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(t)} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "11px" }}>
                        <Edit2 size={12} /> Edit Details
                      </button>
                    )}
                    <button className={styles.btnSecondary} style={{ padding: "6px 8px", color: "#dc2626" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
