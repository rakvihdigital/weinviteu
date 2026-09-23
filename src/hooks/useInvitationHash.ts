"use client";
import { useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function getSnapshot() {
  return window.location.hash.slice(1);
}
function getServerSnapshot() {
  return null;
}
/** URL fragment state is unavailable on the server; hydrate from the browser safely. */
export function useInvitationHash() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
