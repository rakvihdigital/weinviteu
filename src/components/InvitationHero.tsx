import PhotoInvitationHero from "./PhotoInvitationHero";
import type { Invitation, Template } from "@/types/invitation";
export default function InvitationHero({
  template,
  value,
}: {
  template: Template;
  value: Invitation;
}) {
  return <PhotoInvitationHero template={template} value={value} />;
}
