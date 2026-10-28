import Image from "next/image";

/** Decorative palace artwork, loaded early because it fills the opening viewport. */
export default function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <Image
        src="/images/hero-palace-sunset.webp"
        alt=""
        fill
        sizes="100vw"
        preload
        className="hero-backdrop-image"
      />
    </div>
  );
}
