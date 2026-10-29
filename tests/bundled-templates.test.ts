import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { bundledTemplates, withBundledTemplates } from '../src/lib/bundled-templates';
import { templateIsVisible } from '../src/lib/template-visibility';
import { getTemplatePoster } from '../src/lib/template-posters';
import { templateFields } from '../src/lib/template-fields';
import type { Category } from '../src/lib/models';
const categories: Category[] = bundledTemplates.map((item, i) => ({ id: i + 1, name: item.category, slug: item.category.toLowerCase(), badge: '', display_order: i, is_active: true }));
describe('bundled 3D invitation collection', () => {
  it('adds one design to each category, while a registered row overrides a matching file', () => {
    expect(new Set(bundledTemplates.map(t => t.category)).size).toBe(8);
    const registered = { ...bundledTemplates[0], id: 42, enabled: false };
    const merged = withBundledTemplates([registered], categories);
    expect(merged).toHaveLength(8);
    expect(merged.find(t => t.filename === registered.filename)?.id).toBe(42);
    expect(merged.filter(t => templateIsVisible(t, categories))).toHaveLength(7);
    expect(merged.filter(t => templateIsVisible(t, []))).toHaveLength(0);
  });
  it('ships every HTML file and cover, with parseable scripts and editable event details', () => {
    for (const template of bundledTemplates) {
      const source = readFileSync(`public/templates/${template.filename}`, 'utf8');
      for (const script of source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) expect(() => new Script(script[1])).not.toThrow();
      expect(templateFields(source).some(field => field.id === 'CFG.venue')).toBe(true);
      const poster = getTemplatePoster(template.filename);
      expect(poster).toBeTruthy();
      expect(existsSync(`public${decodeURIComponent(poster!)}`)).toBe(true);
    }
  });
  it('gives each non-naming category a separate entrance structure', () => {
    const entrances = ['door door-left', 'gift-box', 'cloud cloud-left', 'temple-roof', 'stage-panel', 'album-slide', 'launch-ribbon'];
    bundledTemplates.slice(1).forEach((template, index) => {
      const source = readFileSync(`public/templates/${template.filename}`, 'utf8');
      expect(source).toContain(`id="book"`);
      expect(source).toContain(`id="open"`);
      expect(source).toContain(entrances[index]);
      expect(source).not.toContain('class="book" id="book"');
    });
  });

});
