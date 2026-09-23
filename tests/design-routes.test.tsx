import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { templates } from "@/data/templates";
import DesignDetailPage, {
  designMetadata,
} from "@/components/DesignDetailPage";

const routes = import.meta.glob(
  "../src/app/designs/*/page.tsx",
  { eager: true },
) as unknown as Record<string, { default: () => { props: { id: string } } }>;

describe("individual design pages", () => {
  it("gives every current design its own matching route file", () => {
    expect(Object.keys(routes)).toHaveLength(templates.length);
    for (const template of templates) {
      expect(
        routes[`../src/app/designs/${template.id}/page.tsx`].default().props.id,
      ).toBe(template.id);
    }
  });

  it.each(templates)(
    "keeps $id preview, metadata and actions matched",
    async (template) => {
      const html = renderToStaticMarkup(
        await DesignDetailPage({ id: template.id }),
      );
      expect(html).toContain(`data-template-id="${template.id}"`);
      expect(html).toContain(`href="/create?template=${template.id}"`);
      expect(html).toContain(`href="/invite/${template.id}"`);
      expect(html).toContain(`href="/designs?category=${template.category}"`);
      expect((await designMetadata(template.id)).title).toContain(
        template.name,
      );
    },
  );
});
