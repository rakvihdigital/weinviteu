"use client";
import { useSyncExternalStore } from "react";
import Image from "next/image";
import { isLocalPhoto, readPhoto, PHOTO_EVENT } from "@/lib/localPhotos";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PHOTO_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PHOTO_EVENT, callback);
  };
}
export default function GalleryImage({
  id,
  alt,
  width = 480,
  height = 600,
  loading,
  className,
}: {
  id: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  className?: string;
}) {
  const data = useSyncExternalStore(
    subscribe,
    () => readPhoto(id),
    () => null,
  );
  if (isLocalPhoto(id) && !data)
    return (
      <div
        className="photo-unavailable"
        role="img"
        aria-label="Photo stored in another browser"
      >
        Photo available only in the browser where it was uploaded.
      </div>
    );
  return (
    <Image
      src={data ?? `/gallery/${id}.svg`}
      alt={
        alt ??
        (isLocalPhoto(id)
          ? "Uploaded celebration photo"
          : `${id} celebration illustration`)
      }
      width={width}
      height={height}
      unoptimized={isLocalPhoto(id)}
      loading={loading}
      className={className}
    />
  );
}
