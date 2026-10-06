import { describe, it, expect } from 'vitest';
import { getTemplatePricing } from '../src/lib/template-pricing';
import { getTemplateWalkthrough } from '../src/lib/template-content';

const template = { title: 'Uploaded invite', filename: 'upload.html', category: 'Wedding' };
describe('accurate template details and pricing', () => {
  it('never invents discounts for missing or invalid original prices', () => {
    for (const original_price of [undefined, '', 'invalid', '999', '1499']) {
      const result = getTemplatePricing({ price: '1499', original_price });
      expect(result.discount).toBe('');
      expect(result.originalPrice).toBe('');
      expect(result.numericPrice).toBe(1499);
    }
    expect(getTemplatePricing({ category: 'Wedding' }).discount).toBe('');
  });
  it('uses explicit original prices and preserves paise', () => {
    const result = getTemplatePricing({ price: '₹1,499.50', original_price: '₹2,999' });
    expect(result.numericPrice).toBe(1499.5);
    expect(result.price).toBe('₹1,499.5');
    expect(result.originalPrice).toBe('₹2,999');
    expect(result.discount).toBe('50% OFF');
  });
  it('does not claim audio, RSVP or gallery sections without a source', () => {
    const result = getTemplateWalkthrough(template);
    expect(result.steps).toEqual([]);
    expect(result.hasAudio).toBe(false);
    expect(JSON.stringify(result)).not.toMatch(/guestbook|gallery|60FPS|100%|Wax Seal/);
  });
  it('reads headings in document order and ignores script/style/comment text', () => {
    const result = getTemplateWalkthrough(template, '<!-- <h1>Fake</h1> --><script>const x="<h2>Fake</h2>"</script><style>/*<h2>Fake</h2>*/</style><h1>Our <em>Wedding</em></h1><h2>Venue &amp; Directions</h2><audio></audio><a href="https://maps.app.goo.gl/test">Map</a>');
    expect(result.steps.map(s => s.title)).toEqual(['Our Wedding', 'Venue & Directions']);
    expect(result.hasAudio).toBe(true);
    expect(result.highlights).toContain('Map directions link is present in the template');
  });
});
