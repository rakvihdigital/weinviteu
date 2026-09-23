"use client";
import { useMemo } from "react";
import type { Template, Invitation } from "@/types/invitation";
import Builder from "./Builder";
import { decodeInvitation } from "@/lib/share";
import { useInvitationHash } from "@/hooks/useInvitationHash";
export default function BuilderLoader({ template }: { template: Template }) {
  const hash = useInvitationHash();
  const result = useMemo(() => {
    let initial: Invitation | undefined;
    let error = "";
    if (hash) {
      try {
        const decoded = decodeInvitation(hash);
        if (!decoded.templateId || decoded.templateId === template.id) {
          initial = decoded;
        }
      } catch {
        error =
          "The saved preview could not be restored. The original template is loaded.";
      }
    }
    return { initial, error };
  }, [hash, template.id]);
  if (hash === null) return <main className="empty">Loading your editor…</main>;
  return (
    <>
      {result.error && (
        <p role="alert" className="status-line">
          {result.error}
        </p>
      )}
      <Builder key={hash} template={template} restored={result.initial} />
    </>
  );
}
