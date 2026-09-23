import { notFound } from "next/navigation";
import { demoInvitation, invitationForTemplate } from "@/data/demoInvitation";
import { templateRepository } from "@/lib/repository";
import InvitationExperience from "@/components/InvitationExperience";
import SharedInvitation from "@/components/SharedInvitation";
export const metadata = {
  title: "You are invited",
  robots: { index: false, follow: false },
};
export default async function Invite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "custom") return <SharedInvitation />;
  if (slug === "arjun-priya")
    return <InvitationExperience value={demoInvitation} />;
  const t = await templateRepository.find(slug);
  if (!t) notFound();
  return <InvitationExperience value={invitationForTemplate(t)} />;
}
