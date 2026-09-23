import DesignDetailPage, {
  designMetadata,
} from "@/components/DesignDetailPage";

const templateId = "royal-garden";

export function generateMetadata() {
  return designMetadata(templateId);
}

export default function Page() {
  return <DesignDetailPage id={templateId} />;
}
