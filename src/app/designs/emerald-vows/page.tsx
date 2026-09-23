import DesignDetailPage, {
  designMetadata,
} from "@/components/DesignDetailPage";

const templateId = "emerald-vows";

export function generateMetadata() {
  return designMetadata(templateId);
}

export default function Page() {
  return <DesignDetailPage id={templateId} />;
}
