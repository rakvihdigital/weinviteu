import { templates } from "@/data/templates";
import type { Occasion, Template } from "@/types/invitation";
/** UI reads through this boundary. Replace the implementation after database setup. */
export interface TemplateRepository {
  list(category?: Occasion): Promise<Template[]>;
  find(id: string): Promise<Template | undefined>;
}
export const templateRepository: TemplateRepository = {
  async list(category) {
    return category
      ? templates.filter((t) => t.category === category)
      : templates;
  },
  async find(id) {
    return templates.find((t) => t.id === id);
  },
};
