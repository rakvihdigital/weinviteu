/**
 * Template Content & Walkthrough Analyzer
 * Extracts and synthesizes the exact starting-to-end journey of an invitation template.
 */

export interface TemplateStepItem {
  step: number;
  title: string;
  badge: string;
  phase: 'start' | 'experience' | 'details' | 'interaction' | 'end';
  headline: string;
  description: string;
  whatGuestsExperience: string;
  customizableFields: string[];
  features: string[];
}

export interface TemplateWalkthrough {
  openingAction: string;
  openingDescription: string;
  hasAudio: boolean;
  audioDescription: string;
  totalSteps: number;
  steps: TemplateStepItem[];
  highlights: string[];
  techSpecs: {
    label: string;
    value: string;
  }[];
}

/** Read headings and supported media from HTML; never infer features from a category. */
export function getTemplateWalkthrough(template: { title: string; filename: string; category: string }, html = ''): TemplateWalkthrough {
  const content = html.replace(/<!--[^]*?-->|<(script|style)\b[^>]*>[^]*?<\/\1\s*>/gi, '');
  const cleanText = (value: string) => value.replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  const headings = Array.from(content.matchAll(/<h[1-3]\b[^>]*>([^]*?)<\/h[1-3]\s*>/gi))
    .map(match => cleanText(match[1])).filter(Boolean);
  const hasAudio = /<audio\b|new\s+(?:window\.)?Audio\s*\(|AudioContext|webkitAudioContext/i.test(html);
  const hasMaps = /href\s*=\s*["'][^"']*(?:maps\.google|google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple)/i.test(content);
  const steps: TemplateStepItem[] = headings.map((heading, index) => ({
    step: index + 1, title: heading, badge: 'SECTION', phase: 'details', headline: '',
    description: 'Heading present in this template.', whatGuestsExperience: '', customizableFields: [], features: [],
  }));
  return {
    openingAction: template.title,
    openingDescription: 'Open the live preview to see the entrance, animations and full invitation.',
    hasAudio, audioDescription: hasAudio ? 'Audio support is present in this template.' : '',
    totalSteps: steps.length, steps,
    highlights: [
      'Personalize the wording available in this template',
      ...(hasAudio ? ['Audio support is present in the template'] : []),
      ...(hasMaps ? ['Map directions link is present in the template'] : []),
    ],
    techSpecs: [
      { label: 'Preview', value: 'Interactive browser preview' },
      ...(hasAudio ? [{ label: 'Audio', value: 'Audio support detected' }] : []),
      ...(hasMaps ? [{ label: 'Directions', value: 'Map link detected' }] : []),
    ],
  };
}
