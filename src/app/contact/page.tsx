import { Mail, MapPin, Phone, MessageCircle, Send } from "lucide-react";
import styles from "./contact.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | WeInviteU",
  description: "Get in touch with us to craft the perfect digital invitation for your special moment.",
};

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      {/* Hero */}
      <section className={styles.contactHero}>
        <span className={styles.eyebrow}>GET IN TOUCH</span>
        <h1>
          Let's create
          <br />
          <em>something beautiful.</em>
        </h1>
        <p>
          Whether you have a question about our templates, need a custom design,
          or just want to say hello, we're here to help make your celebration perfect.
        </p>
      </section>

      {/* Grid */}
      <div className={styles.contactGrid}>
        
        {/* Left: Contact Info */}
        <div className={styles.contactInfo}>
          <h2>Reach Out</h2>
          <p>We'd love to hear from you. Our team is available to answer any questions you might have about our 3D interactive invitations.</p>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Mail size={18} />
            </div>
            <div>
              <h3>Email</h3>
              <a href="mailto:hello@weinviteu.com">hello@weinviteu.com</a>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Phone size={18} />
            </div>
            <div>
              <h3>Phone</h3>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <MapPin size={18} />
            </div>
            <div>
              <h3>Studio</h3>
              <p>WeInviteU Design Studio<br />Bangalore, India</p>
            </div>
          </div>

          <div className={styles.whatsappPromo}>
            <p>Looking for a quick response?</p>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className={styles.waButton}>
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className={styles.contactForm}>
          <h2>Send a Message</h2>
          <form action="#">
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="E.g., Ananya & Rahul" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="you@example.com" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="eventType">Occasion / Event Type</label>
              <input type="text" id="eventType" placeholder="E.g., Wedding, Birthday" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">How can we help?</label>
              <textarea id="message" rows={5} placeholder="Tell us about your event and what you're looking for..." required></textarea>
            </div>
            
            <button type="submit" className={styles.submitButton}>
              Send Message <Send size={15} />
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
