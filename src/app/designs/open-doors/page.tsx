import DesignDetailPage, {
  designMetadata,
} from "@/components/DesignDetailPage";

const templateId = "open-doors";

export function generateMetadata() {
  return designMetadata(templateId);
}

export default function Page() {
  return <DesignDetailPage id={templateId} />;
}
