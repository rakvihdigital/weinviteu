"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import styles from "./contact.module.css";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({
    studio_name: "",
    contact_email: "",
    whatsapp_number: "",
    location: ""
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(data);
          setSettingsLoaded(true);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('orders').insert({
        client_name: formData.name,
        email: formData.email,
        template_name: formData.eventType || "Not specified",
        status: "New Inquiry",
        price: "₹0",
        message: formData.message
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: "", email: "", eventType: "", message: "" });
    } catch (err: unknown) {
      alert("Something went wrong. Please try again or reach us on WhatsApp.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.contactPage}>
      {/* Hero Banner */}
      <section className={styles.contactHeroBanner}>
        <div className={styles.contactHero}>
          <span className={styles.eyebrow}>GET IN TOUCH</span>
          <h1>
            Let&apos;s create
            <br />
            <em>something beautiful.</em>
          </h1>
          <p>
            Whether you have a question about our templates, need a custom design,
            or just want to say hello, we&apos;re here to help make your celebration perfect.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className={styles.contactGrid}>

        {/* Left: Contact Info */}
        <div className={styles.contactInfo}>
          <h2>Reach Out</h2>
          <p>We&apos;d love to hear from you. Our team is available to answer any questions you might have about our 3D interactive invitations.</p>

          {settingsLoaded ? (
            <>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Mail size={18} />
                </div>
                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Phone size={18} />
                </div>
                <div>
                  <h3>Phone</h3>
                  <a href={`tel:${settings.whatsapp_number.replace(/\s+/g, '')}`}>{settings.whatsapp_number}</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h3>Studio</h3>
                  <p>{settings.studio_name}<br />{settings.location}</p>
                </div>
              </div>

              <div className={styles.whatsappPromo}>
                <p>Looking for a quick response?</p>
                <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.waButton}>
                  <WhatsAppIcon size={18} />
                  Chat on WhatsApp
                </a>
              </div>
            </>
          ) : (
            <p style={{ opacity: 0.5, fontSize: "14px" }}>Loading contact details…</p>
          )}
        </div>

        {/* Right: Contact Form */}
        <div className={styles.contactForm}>
          <h2>Send a Message</h2>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <CheckCircle size={48} color="var(--gold)" style={{ marginBottom: "20px" }} />
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Thank you!</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "25px" }}>
                We&apos;ve received your inquiry and will get back to you within 24 hours.
                You can also track your order status once we begin working on your invitation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className={styles.submitButton}
                style={{ maxWidth: "200px", margin: "0 auto" }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text" id="name" placeholder="E.g., Ananya & Rahul" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email" id="email" placeholder="you@example.com" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="eventType">Occasion / Event Type</label>
                <input
                  type="text" id="eventType" placeholder="E.g., Wedding, Birthday"
                  value={formData.eventType}
                  onChange={e => setFormData({...formData, eventType: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">How can we help?</label>
                <textarea
                  id="message" rows={5} placeholder="Tell us about your event and what you're looking for..." required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"} <Send size={15} />
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}
