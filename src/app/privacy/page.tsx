import styles from "../legal.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WeInviteU",
  description: "Learn how WeInviteU collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.legalPage}>
      <header className={styles.legalHeader}>
        <span className={styles.eyebrow}>DATA PROTECTION</span>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: October 2026</p>
      </header>

      <div className={styles.legalContent}>
        <ol className={styles.legalList}>
          <li className={styles.legalItem}>
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email address, phone number, event details, and media (photos/videos) necessary to create your digital invitation.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>How We Use Your Information</h2>
            <p>The information collected is used exclusively to customize your digital invitation, communicate with you regarding your order, and improve our services and user experience.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Data Storage & Security</h2>
            <p>We implement industry-standard security measures to protect your personal information and media files from unauthorized access, alteration, disclosure, or destruction.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Third-Party Sharing</h2>
            <p>We do not sell, trade, or rent your personal identification information to third parties. We may share generic aggregated demographic information not linked to any personal identification.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Media & Content Privacy</h2>
            <p>The photos and personal details you provide for your invitation are hosted securely on our servers. Since you will distribute the link to your guests, the privacy of the invitation ultimately relies on how you share it.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Cookies & Tracking</h2>
            <p>Our website may use &quot;cookies&quot; to enhance user experience. Your web browser places cookies on your hard drive for record-keeping purposes and to track information about how you use our site.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Data Retention</h2>
            <p>We retain your event data and media files for a period of up to 3 months post your event date to ensure your invitation link remains active. After this period, we may securely delete the data.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal data held by us at any time by contacting our support team.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Children&apos;s Privacy</h2>
            <p>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children without verified parental consent.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Changes to This Policy</h2>
            <p>WeInviteU has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage you to frequently check this page for any changes.</p>
          </li>
        </ol>
      </div>
    </main>
  );
}
