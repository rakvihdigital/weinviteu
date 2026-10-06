import { readFileSync, statSync } from 'node:fs';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TemplateCard from '../src/components/TemplateCard';
import { getTemplatePoster } from '../src/lib/template-posters';

afterEach(cleanup);
describe('fast template covers', () => {
  it('renders a real image rather than starting an animated iframe for a known template', () => {
    const view = render(<TemplateCard template={{ id: 3, title: 'Birthday Sparkle', filename: 'birthday-invitation.html', category: 'Birthday', badge: 'BIRTHDAY' }} />);
    expect(view.container.querySelector('iframe')).toBeNull();
    expect(view.getByAltText('Birthday Sparkle invitation preview').getAttribute('src')).toBe('/template-posters/birthday-invitation.webp');
    expect(view.getByRole('link', { name: 'Preview Birthday Sparkle in new tab' }).getAttribute('href')).toBe('/templates/birthday-invitation.html');
  });
  it('supports encoded filenames and uploaded templates with real, small cover files', () => {
    for (const filename of ['invitation (2).html', 'https://example.com/base-templates/2e1171ae-aab1-4889-904d-8b5190d39f10.html']) {
      const poster = getTemplatePoster(filename)!;
      const file = `public${decodeURIComponent(poster)}`;
      expect(readFileSync(file).subarray(8, 12).toString()).toBe('WEBP');
      expect(statSync(file).size).toBeLessThan(150000);
    }
    expect(getTemplatePoster('new-upload.html')).toBeNull();
  });
});
