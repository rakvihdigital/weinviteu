"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Invitation } from "@/types/invitation";
import { decodeInvitation, encodeInvitation } from "@/lib/share";
import InvitationExperience from "./InvitationExperience";
export default function SharedInvitation({
  preview = false,
}: {
  preview?: boolean;
}) {
  const [value, setValue] = useState<Invitation | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    function read() {
      try {
        const hash = window.location.hash.slice(1);
        if (!hash) throw new Error();
        setValue(decodeInvitation(hash));
        setError("");
      } catch {
        setError(
          "This invitation link is incomplete or invalid. Please ask the host for a new link.",
        );
      }
    }
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  if (error)
    return (
      <main className="empty">
        <h1>We couldn’t open this invitation.</h1>
        <p>{error}</p>
        <Link className="button" href="/create">
          Create an invitation
        </Link>
      </main>
    );
  if (!value)
    return (
      <main className="empty" aria-busy="true">
        Opening your invitation…
      </main>
    );
  return (
    <>
      {preview && (
        <div className="preview-banner">
          <span>Guest preview · demo</span>
          <Link
            href={`/create?template=${value.templateId}#${encodeInvitation(value)}`}
          >
            ← Continue editing
          </Link>
        </div>
      )}
      <InvitationExperience value={value} />
    </>
  );
}
