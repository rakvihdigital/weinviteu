import PhotoInvitationHero from "./PhotoInvitationHero";
import { invitationForTemplate } from "@/data/demoInvitation";
import type { Invitation, Template } from "@/types/invitation";
export default function GalleryTemplatePreview({
  template,
  value,
  paletteValue,
}: {
  template: Template;
  value?: Invitation;
  paletteValue?: Invitation;
}) {
  return (
    <PhotoInvitationHero
      template={template}
      value={value ?? paletteValue ?? invitationForTemplate(template)}
      compact={!value}
    />
  );
}
