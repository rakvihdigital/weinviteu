import { describe, it, expect } from 'vitest';
import { getTemplatePricing } from '../src/lib/template-pricing';
import { getTemplateWalkthrough } from '../src/lib/template-content';

describe('template-pricing', () => {
  it('computes category default pricing with discounts', () => {
    const wedding = getTemplatePricing({ category: 'Wedding' });
    expect(wedding.price).toBe('₹1,999');
    expect(wedding.originalPrice).toBe('₹3,999');
    expect(wedding.discount).toBe('50% OFF');
    expect(wedding.numericPrice).toBe(1999);

    const birthday = getTemplatePricing({ category: 'Birthday' });
    expect(birthday.price).toBe('₹1,299');
    expect(birthday.originalPrice).toBe('₹2,499');
    expect(birthday.discount).toBe('48% OFF');

    const traditional = getTemplatePricing({ category: 'Traditional' });
    expect(traditional.price).toBe('₹1,499');
    expect(traditional.originalPrice).toBe('₹2,999');
  });

  it('respects explicitly provided custom prices in template', () => {
    const custom = getTemplatePricing({ price: '₹2,499', category: 'Wedding' });
    expect(custom.price).toBe('₹2,499');
    expect(custom.originalPrice).toBe('₹4,998');
    expect(custom.discount).toBe('50% OFF');
    expect(custom.numericPrice).toBe(2499);
  });

  it('respects both custom price and custom original_price from database', () => {
    const customWithMRP = getTemplatePricing({
      price: '₹1,499',
      original_price: '₹2,999',
      category: 'Wedding',
    });
    expect(customWithMRP.price).toBe('₹1,499');
    expect(customWithMRP.originalPrice).toBe('₹2,999');
    expect(customWithMRP.discount).toBe('50% OFF');
    expect(customWithMRP.saveAmount).toBe('Save ₹1,500');

    const custom70Off = getTemplatePricing({
      price: '999',
      original_price: '3999',
    });
    expect(custom70Off.price).toBe('₹999');
    expect(custom70Off.originalPrice).toBe('₹3,999');
    expect(custom70Off.discount).toBe('75% OFF');
  });
});

describe('template-content starting-to-end walkthrough', () => {
  it('extracts complete step-by-step contents for Temple Cinematic', () => {
    const walkthrough = getTemplateWalkthrough({
      filename: 'temple-invitation.html',
      title: 'Temple Cinematic',
      category: 'Wedding',
    });

    expect(walkthrough.openingAction).toContain('Wax Seal');
    expect(walkthrough.hasAudio).toBe(true);
    expect(walkthrough.totalSteps).toBe(10);
    expect(walkthrough.steps.length).toBe(10);

    // Verify sequential progression from Step 1 to Step 10
    expect(walkthrough.steps[0].step).toBe(1);
    expect(walkthrough.steps[0].badge).toBe('START');
    expect(walkthrough.steps[0].whatGuestsExperience).toBeDefined();

    expect(walkthrough.steps[1].badge).toBe('AUDIO');
    expect(walkthrough.steps[2].title).toContain('Muhurtham');
    expect(walkthrough.steps[3].title).toContain('Bride & Groom');
    expect(walkthrough.steps[6].badge).toBe('VENUE');
    expect(walkthrough.steps[7].badge).toBe('GALLERY');
    expect(walkthrough.steps[8].badge).toBe('RSVP');

    const lastStep = walkthrough.steps[walkthrough.steps.length - 1];
    expect(lastStep.step).toBe(10);
    expect(lastStep.badge).toBe('END');
    expect(lastStep.customizableFields.length).toBeGreaterThan(0);
  });

  it('extracts complete step-by-step contents for Classic Elegance (Golden Key)', () => {
    const walkthrough = getTemplateWalkthrough({
      filename: 'invitation (2).html',
      title: 'Classic Elegance',
      category: 'Wedding',
    });

    expect(walkthrough.openingAction).toContain('Golden Key');
    expect(walkthrough.steps[0].title).toContain('Golden Key');
    expect(walkthrough.steps[0].features).toContain('Draggable physics key');
  });

  it('provides rich step-by-step contents for arbitrary celebration templates', () => {
    const walkthrough = getTemplateWalkthrough({
      filename: 'some-custom-upload.html',
      title: 'Royal Celebration',
      category: 'Anniversary',
    });

    expect(walkthrough.steps.length).toBeGreaterThanOrEqual(7);
    expect(walkthrough.steps[0].phase).toBe('start');
    expect(walkthrough.steps[walkthrough.steps.length - 1].phase).toBe('end');
    expect(walkthrough.highlights.length).toBeGreaterThan(0);
    expect(walkthrough.techSpecs.length).toBeGreaterThan(0);
  });
});
