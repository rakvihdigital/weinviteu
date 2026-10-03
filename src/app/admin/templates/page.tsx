"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

import { api, jsonBody, errorMessage } from "@/lib/client-api";
import { templateUrl, type Template } from "@/lib/models";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", category: "", badge: "", filename: "" });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    api<Template[]>('/api/admin/templates').then(setTemplates).catch(e => setError(errorMessage(e)));
  }, []);
  const fetchTemplates = async () => setTemplates(await api<Template[]>('/api/admin/templates'));
  const run = async (work: () => Promise<void>) => {
    setPending(true); setError('');
    try { await work(); await fetchTemplates(); }
    catch (e) { setError(errorMessage(e)); }
    finally { setPending(false); }
  };
  const handleEditClick = (t: Template) => {
    setEditingId(t.id);
    setEditForm({ title: t.title, category: t.category, badge: t.badge, filename: t.filename });
  };
  const handleSave = () => run(async () => {
    await api('/api/admin/templates', { ...jsonBody({ id: editingId, ...editForm }), method: 'PATCH' });
    setEditingId(null);
  });
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) { setError('Select an HTML file.'); return; }
    setIsUploading(true);
    await run(async () => {
      const form = new FormData();
      form.set('file', uploadFile);
      for (const key of ['title', 'category', 'badge'] as const) form.set(key, editForm[key]);
      await api('/api/admin/templates', { method: 'POST', body: form });
      setShowUploadModal(false); setUploadFile(null);
    });
    setIsUploading(false);
  };
  const handleDelete = (id: number) => {
    if (confirm('Delete this template from the library? Saved invitations will remain available.')) void run(async () => {
      await api('/api/admin/templates', { ...jsonBody({ id }), method: 'DELETE' });
    });
  };
  const handleToggleEnabled = (id: number, currentEnabled: boolean) => run(async () => {
    await api('/api/admin/templates', { ...jsonBody({ id, enabled: !currentEnabled }), method: 'PATCH' });
  });

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <fieldset disabled={pending} style={{ border: 0, padding: 0, minWidth: 0 }}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Templates Management</h2>
          <p>Manage your 3D digital invitation templates.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { setEditForm({ title: "", category: "", badge: "", filename: "" }); setShowUploadModal(true); }}>
          <Plus size={16} /> Add New Template
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
                  <a href={templateUrl(t.filename)} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary} style={{ padding: "4px 8px" }}>
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
                    <span className={styles.statusBadge} style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--ink)" }}>{t.badge}</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleEnabled(t.id, t.enabled !== false)}
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: "4px",
                      display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <div style={{
                      width: "36px", height: "20px", borderRadius: "10px",
                      background: t.enabled !== false ? "var(--gold)" : "#ccc",
                      position: "relative", transition: "background 0.2s"
                    }}>
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "50%",
                        background: "#fff", position: "absolute", top: "2px",
                        left: t.enabled !== false ? "18px" : "2px",
                        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                      }} />
                    </div>
                    <span style={{ fontSize: "11px", color: t.enabled !== false ? "var(--gold)" : "#999", fontWeight: 600 }}>
                      {t.enabled !== false ? "Live" : "Hidden"}
                    </span>
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {editingId === t.id ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button className={styles.btnPrimary} onClick={handleSave} style={{ padding: "4px 8px" }}>Save</button>
                        <button className={styles.btnSecondary} onClick={() => setEditingId(null)} style={{ padding: "4px 8px" }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className={styles.btnSecondary} onClick={() => handleEditClick(t)} style={{ padding: "4px 8px" }}>
                          <Edit2 size={12} />
                        </button>
                        <button className={styles.btnSecondary} onClick={() => handleDelete(t.id)} style={{ padding: "4px 8px", color: "red" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showUploadModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 100 }}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", width: "400px" }}>
              <h3 style={{ marginBottom: "20px" }}>Add New Template</h3>
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input required placeholder="Template Title" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>HTML File</label>
                  <input required type="file" accept=".html" onChange={e => e.target.files && setUploadFile(e.target.files[0])} style={{ padding: "10px", borderRadius: "6px", border: "1px dashed #ccc", background: "rgba(255, 255, 255, 0.05)" }} />
                </div>

                <input required placeholder="Category (e.g., Wedding)" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
                <input required placeholder="Badge (e.g., WEDDING)" value={editForm.badge} onChange={e => setEditForm({...editForm, badge: e.target.value})} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button type="submit" disabled={isUploading} className={styles.btnPrimary} style={{ flex: 1 }}>{isUploading ? 'Uploading...' : 'Save & Upload'}</button>
                  <button type="button" disabled={isUploading} onClick={() => { setShowUploadModal(false); setUploadFile(null); }} className={styles.btnSecondary} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
}
