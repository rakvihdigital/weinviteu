"use client";

import styles from "../admin.module.css";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Settings</h2>
          <p>Configure your admin panel and studio details.</p>
        </div>
        <button className={styles.btnPrimary}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        
        <div className={styles.card} style={{ flex: 1 }}>
          <div className={styles.cardHeader}>
            <h3>Studio Details</h3>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#555" }}>Studio Name</label>
            <input type="text" defaultValue="WeInviteU Design Studio" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#555" }}>Contact Email</label>
            <input type="email" defaultValue="hello@weinviteu.com" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#555" }}>WhatsApp Number</label>
            <input type="text" defaultValue="+91 98765 43210" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
            <p style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>This number will be used for all 'Chat on WhatsApp' buttons.</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#555" }}>Studio Location</label>
            <input type="text" defaultValue="Bangalore, India" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
          </div>
        </div>

        <div className={styles.card} style={{ flex: 1 }}>
          <div className={styles.cardHeader}>
            <h3>Admin Preferences</h3>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              Receive email notifications for new inquiries
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              Enable WhatsApp order tracking integration
            </label>
          </div>

          <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "14px", color: "#d97706", marginBottom: "10px" }}>Danger Zone</h3>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>Actions here cannot be undone.</p>
            <button className={styles.btnSecondary} style={{ color: "#dc2626", borderColor: "#fca5a5", width: "100%", justifyContent: "center" }}>
              Clear Cache & Reset Stats
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
