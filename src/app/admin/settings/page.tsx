"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    studio_name: "",
    contact_email: "",
    whatsapp_number: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/settings').then(async response => {
      if (!response.ok) throw new Error('Could not load settings. Reload before editing.');
      setSettings(await response.json());
    }).catch(error => setMessage(error.message)).finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const result = await res.json();
        setMessage(result.error || "Failed to save settings.");
      }
    } catch {
      setMessage("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
        <Loader2 className={styles.spinner} size={30} color="var(--gold)" />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Settings</h2>
          <p>Configure your admin panel and studio details.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {message && <span style={{ fontSize: "13px", color: message.includes("success") ? "#10b981" : "#ef4444" }}>{message}</span>}
          <button
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className={styles.spinner} size={16} /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start", flexWrap: "wrap" }}>

        <div className={styles.card} style={{ flex: "1 1 400px" }}>
          <div className={styles.cardHeader}>
            <h3>Studio Details</h3>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>Studio Name</label>
            <input
              type="text"
              value={settings.studio_name || ""}
              onChange={e => setSettings({...settings, studio_name: e.target.value})}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "rgba(255,255,255,0.05)", color: "var(--ink)", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>Contact Email</label>
            <input
              type="email"
              value={settings.contact_email || ""}
              onChange={e => setSettings({...settings, contact_email: e.target.value})}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "rgba(255,255,255,0.05)", color: "var(--ink)", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>WhatsApp Number</label>
            <input
              type="text"
              value={settings.whatsapp_number || ""}
              onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "rgba(255,255,255,0.05)", color: "var(--ink)", outline: "none" }}
            />
            <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>This number will be used for all WhatsApp buttons.</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>Studio Location</label>
            <input
              type="text"
              value={settings.location || ""}
              onChange={e => setSettings({...settings, location: e.target.value})}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "rgba(255,255,255,0.05)", color: "var(--ink)", outline: "none" }}
            />
          </div>
        </div>


      </div>
    </div>
  );
}
