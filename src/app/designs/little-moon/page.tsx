import DesignDetailPage, {
  designMetadata,
} from "@/components/DesignDetailPage";

const templateId = "little-moon";

export function generateMetadata() {
  return designMetadata(templateId);
}

export default function Page() {
  return <DesignDetailPage id={templateId} />;
}
