import { getTemplatePoster } from "@/lib/template-posters";
import { getTemplateUrl } from "@/lib/template-url";
import LiveFrame from "./LiveFrame";

export default function TemplateCover({ filename, title, eager = false }: { filename: string; title: string; eager?: boolean }) {
  const poster = getTemplatePoster(filename);
  if (!poster) return <LiveFrame src={`${getTemplateUrl(filename)}?muted=1`} title={title} loading="lazy" sandbox="allow-scripts allow-forms allow-popups allow-modals" />;
  return <img className="template-cover" src={poster} alt={`${title} invitation preview`}
    width={390} height={844} loading="eager" fetchPriority={eager ? "high" : "auto"} decoding="async" />;
}
