import type { Metadata } from "next";
import { templateRepository } from "@/lib/repository";
import BuilderLoader from "@/components/BuilderLoader";
export const metadata: Metadata = {
  title: "Create your invitation",
  robots: { index: false, follow: false },
};
export default async function Create({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: id } = await searchParams;
  const t =
    (await templateRepository.find(id ?? "royal-garden")) ??
    (await templateRepository.list())[0];
  return (
    <div className="create-route">
      <BuilderLoader key={t.id} template={t} />
    </div>
  );
}
