"use client";
import { useRef, useState } from "react";
import { Upload, X, ArrowLeft, ArrowRight } from "lucide-react";
import { isLocalPhoto, preparePhoto, savePhoto } from "@/lib/localPhotos";
import GalleryImage from "./GalleryImage";
export default function GalleryUpload({
  gallery,
  onChange,
}: {
  gallery: string[];
  onChange: (gallery: string[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMessage("");
    const added: string[] = [];
    try {
      const room = 12 - gallery.length;
      if (files.length > room)
        throw new Error(
          `You can add ${room} more photo${room === 1 ? "" : "s"} (12 gallery items maximum).`,
        );
      for (const file of Array.from(files))
        added.push(savePhoto(await preparePhoto(file)));
      setMessage(
        `${added.length} photo${added.length === 1 ? "" : "s"} added. Your preview is updated.`,
      );
    } catch (error) {
      setMessage(
        error instanceof DOMException && error.name === "QuotaExceededError"
          ? "Browser storage is full. Try fewer or smaller photos."
          : error instanceof Error
            ? error.message
            : "This photo could not be uploaded. Try another file.",
      );
    } finally {
      if (added.length) onChange([...gallery, ...added]);
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  function move(index: number, offset: number) {
    const next = [...gallery];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  }
  return (
    <div className="photo-upload">
      <input
        ref={input}
        className="photo-upload-input"
        id="gallery-photo-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={busy}
        onChange={(e) => void upload(e.target.files)}
        aria-label="Upload gallery photos"
      />
      <button
        className="photo-upload-button"
        type="button"
        disabled={busy || gallery.length >= 12}
        onClick={() => input.current?.click()}
      >
        <Upload size={24} />
        <strong>
          {busy ? "Preparing your photos…" : "Upload your photos"}
        </strong>
        <span>JPG, PNG or WebP · up to 20 MB each</span>
      </button>
      <p className="photo-upload-help">
        Photos stay in this browser. They appear in your live preview and guest
        preview here, but won’t be visible to guests on other devices until
        hosting is connected.
      </p>
      <p role="status" className="photo-upload-status">
        {message}
      </p>
      <div className="uploaded-photo-grid">
        {gallery.map(
          (id, index) =>
            isLocalPhoto(id) && (
              <div key={id} className="uploaded-photo">
                <GalleryImage id={id} width={180} height={180} />
                <div>
                  <span>Photo {index + 1}</span>
                  <button
                    aria-label={`Remove photo ${index + 1}`}
                    onClick={() =>
                      onChange(gallery.filter((_, i) => i !== index))
                    }
                    disabled={busy}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div>
                  <button
                    aria-label={`Move photo ${index + 1} earlier`}
                    disabled={busy || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    aria-label={`Move photo ${index + 1} later`}
                    disabled={busy || index === gallery.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
