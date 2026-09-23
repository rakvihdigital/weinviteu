"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { preparePhoto, savePhoto } from "@/lib/localPhotos";
import GalleryImage from "./GalleryImage";

export default function SectionPhotoUpload({
  label,
  photo,
  onChange,
}: {
  label: string;
  photo?: string;
  onChange: (photo: string | undefined) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(savePhoto(await preparePhoto(file)));
      setMessage(`${label} updated.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to upload this photo.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div className="photo-upload">
      <h3>{label}</h3>
      <p className="photo-upload-help">
        Choose a photo just for this section. Saved in this browser for your
        preview.
      </p>
      <input
        ref={input}
        className="photo-upload-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={`Upload ${label.toLowerCase()}`}
        disabled={busy}
        onChange={(e) => void upload(e.target.files?.[0])}
      />
      {photo && (
        <div className="uploaded-photo">
          <GalleryImage id={photo} alt={label} width={320} height={200} />
          <button
            type="button"
            disabled={busy}
            onClick={() => onChange(undefined)}
          >
            Remove {label.toLowerCase()}
          </button>
        </div>
      )}
      <button
        type="button"
        className="photo-upload-button"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <Upload size={22} />
        <strong>
          {busy
            ? "Preparing photo…"
            : `${photo ? "Replace" : "Upload"} ${label.toLowerCase()}`}
        </strong>
        <span>JPG, PNG or WebP · up to 20 MB</span>
      </button>
      <p role="status" className="photo-upload-status">
        {message}
      </p>
    </div>
  );
}
