import { notFound } from "next/navigation";
import { templateRepository } from "@/lib/repository";
import DesignDetailContent from "./DesignDetailContent";
export async function designMetadata(id: string) {
  const template = await templateRepository.find(id);
  return {
    title: template
      ? `${template.name} · Invitation Design`
      : "Design not found",
    description: template?.description,
  };
}
export default async function DesignDetailPage({ id }: { id: string }) {
  const template = await templateRepository.find(id);
  if (!template) notFound();
  const related = (await templateRepository.list(template.category)).filter(
    (item) => item.id !== id,
  );
  return <DesignDetailContent key={id} template={template} related={related} />;
}
