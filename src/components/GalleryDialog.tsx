"use client";
import { useEffect, useRef } from "react";
import GalleryImage from "./GalleryImage";
export default function GalleryDialog({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="gallery-dialog"
      aria-label="Gallery photo"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button autoFocus className="button" onClick={onClose}>
        Close image ×
      </button>
      <GalleryImage id={image} width={640} height={800} />
    </dialog>
  );
}
