import { invitationSchema, type Invitation } from "@/types/invitation";
const LIMIT = 24000;
export function encodeInvitation(value: Invitation): string {
  const bytes = new TextEncoder().encode(
    JSON.stringify(invitationSchema.parse(value)),
  );
  const encoded = btoa(
    Array.from(bytes, (b) => String.fromCharCode(b)).join(""),
  )
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
  if (encoded.length > LIMIT)
    throw new Error(
      "Your invitation is too large to share. Please shorten your story.",
    );
  return encoded;
}
export function decodeInvitation(value: string): Invitation {
  if (value.length > LIMIT) throw new Error("Invitation link is too large.");
  const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
  return invitationSchema.parse(
    JSON.parse(
      new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))),
    ),
  );
}
export function invitationUrl(value: Invitation) {
  return `${window.location.origin}/invite/custom#${encodeInvitation(value)}`;
}
export function eventDate(value: Invitation) {
  return new Date(`${value.date}T${value.time}:00${value.timezone}`);
}
export function displayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function calendarFile(value: Invitation) {
  const escape = (s: string) =>
    s
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const start = eventDate(value);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  // RFC 5545 fold lines at <=75 UTF-8 octets, including continuation space.
  const fold = (line: string) => {
    let out = "",
      part = "",
      count = 0;
    for (const c of line) {
      const size = new TextEncoder().encode(c).length;
      if (count + size > 74) {
        out += part + "\r\n";
        part = " ";
        count = 1;
      }
      part += c;
      count += size;
    }
    return out + part;
  };
  const body =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WeInviteU//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@weinviteu`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${escape(value.names)}`,
      `LOCATION:${escape(value.venue + ", " + value.location)}`,
      `DESCRIPTION:${escape(value.tagline)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n";
  const url = URL.createObjectURL(
    new Blob([body], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "weinviteu-event.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
