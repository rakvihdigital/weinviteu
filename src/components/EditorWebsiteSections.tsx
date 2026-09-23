"use client";
import GalleryImage from "./GalleryImage";
import { isLocalPhoto } from "@/lib/localPhotos";
import { displayDate } from "@/lib/share";
import {
  CalendarDays,
  MapPin,
  Clock,
  Pencil,
  Heart,
  Images,
  Send,
} from "lucide-react";
import type { Invitation } from "@/types/invitation";
import styles from "./EditorWebsiteSections.module.css";
type EditorTab = "Event" | "Story" | "Gallery" | "Style" | "Extras";
export default function EditorWebsiteSections({
  value,
  onEdit,
}: {
  value: Invitation;
  onEdit: (tab: EditorTab) => void;
}) {
  const storyTitle =
    value.occasion === "baby"
      ? "A little story, a lot of love."
      : value.occasion === "corporate"
        ? "About the gathering"
        : "The story behind the celebration";
  function heading(number: string, title: string, tab: EditorTab) {
    return (
      <header>
        <div>
          <span>{number}</span>
          <h3>{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onEdit(tab)}
          aria-label={`Edit ${tab.toLowerCase()} section`}
        >
          <Pencil size={12} /> Edit
        </button>
      </header>
    );
  }
  return (
    <div
      className={styles.sections}
      data-design={value.design}
      data-occasion={value.occasion}
    >
      <section>
        {heading("02", "The celebration details", "Event")}
        <div className={styles.details}>
          <div>
            <CalendarDays size={19} />
            <small>WHEN</small>
            <strong>
              {value.date ? displayDate(value.date) : "Choose a date"}
            </strong>
            <span>
              <Clock size={12} />
              {value.time} · UTC{value.timezone}
            </span>
          </div>
          <div>
            <MapPin size={19} />
            <small>WHERE</small>
            <strong>{value.venue || "Add your venue"}</strong>
            <span>{value.location || "Add an address"}</span>
          </div>
        </div>
      </section>
      {value.story && (
        <section className={styles.story}>
          {heading("03", storyTitle, "Story")}
          <Heart size={24} strokeWidth={1} />
          <p>{value.story}</p>
        </section>
      )}
      {value.gallery.length > 0 && (
        <section>
          {heading("04", "A glimpse of the celebration", "Gallery")}
          <p className={styles.intro}>
            Set the scene with your selected illustrations.
          </p>
          <div className={styles.gallery}>
            {value.gallery.map((id) => (
              <figure key={id}>
                <GalleryImage id={id} width={240} height={300} />
                <figcaption>{isLocalPhoto(id) ? "Your moment" : id}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {!value.gallery.length && (
        <button className={styles.addSection} onClick={() => onEdit("Gallery")}>
          <Images size={17} /> Add a gallery section
        </button>
      )}
      {value.rsvpEnabled && (
        <section className={styles.rsvp}>
          {heading("05", "Will you be joining us?", "Extras")}
          <Send size={23} />
          <p>Your guest invitation includes an RSVP demo.</p>
          <span>Preview the guest experience to try the response form.</span>
        </section>
      )}
    </div>
  );
}
