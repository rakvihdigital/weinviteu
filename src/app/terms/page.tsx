import styles from "../legal.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | WeInviteU",
  description: "Terms and conditions for using WeInviteU's digital invitation services.",
};

export default function TermsPage() {
  return (
    <main className={styles.legalPage}>
      <header className={styles.legalHeader}>
        <span className={styles.eyebrow}>LEGAL AGREEMENT</span>
        <h1>Terms & Conditions</h1>
        <p className={styles.lastUpdated}>Last updated: October 2026</p>
      </header>

      <div className={styles.legalContent}>
        <ol className={styles.legalList}>
          <li className={styles.legalItem}>
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using WeInviteU's digital invitation services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our platform.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Service Description</h2>
            <p>WeInviteU provides premium, interactive 3D digital invitations and related design services. The final product is a hosted web link customized with your event details.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>User Responsibilities</h2>
            <p>You are responsible for providing accurate and complete event information, including names, dates, venues, and media, necessary for us to customize your chosen template.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Intellectual Property</h2>
            <p>All templates, designs, 3D assets, code, and graphics on this platform are the exclusive property of WeInviteU. Purchasing a service grants you a license to share the invitation, not ownership of the design.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Payment & Pricing</h2>
            <p>All prices are subject to change. Full payment is required before we deliver the final customized interactive invitation link to you.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Revisions Policy</h2>
            <p>Standard packages include a set number of revisions (typically up to 2 rounds) for text and minor layout adjustments. Additional major structural or design changes may incur extra charges.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Delivery & Hosting</h2>
            <p>Your interactive invitation will be hosted on our secure servers. Standard hosting guarantees uptime for 3 months post your event date, after which the link may be archived.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Refunds & Cancellations</h2>
            <p>Due to the personalized nature of our digital products, we generally do not offer refunds once the customization process has begun. Exceptions are handled on a case-by-case basis.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Limitation of Liability</h2>
            <p>WeInviteU shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our digital invitations or hosting services.</p>
          </li>
          <li className={styles.legalItem}>
            <h2>Modifications to Terms</h2>
            <p>We reserve the right to update or modify these Terms and Conditions at any time. Continued use of our services following any changes constitutes your acceptance of the revised terms.</p>
          </li>
        </ol>
      </div>
    </main>
  );
}
