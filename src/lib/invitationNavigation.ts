import type { MouseEvent } from "react";
/** Scroll without replacing the invitation data stored in the URL fragment. */
export function scrollToInvitationSection(
  event: MouseEvent<HTMLAnchorElement>,
) {
  const target = document.getElementById(event.currentTarget.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ block: "start", behavior: "auto" });
}
