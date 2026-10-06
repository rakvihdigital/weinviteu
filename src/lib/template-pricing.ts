/**
 * Template Pricing & Valuation Helpers
 * Provides standardized pricing, original MRP, and discount calculations
 * across template cards and detail pages. Supports dynamic database-driven
 * `price` and `original_price` overrides from the admin panel.
 */

export interface TemplatePricing {
  price: string;          // e.g. "₹1,499"
  originalPrice: string;  // e.g. "₹2,999"
  discount: string;       // e.g. "50% OFF"
  numericPrice: number;   // e.g. 1499
  saveAmount: string;     // e.g. "Save ₹1,500"
}

// Category-based default price tiers
const CATEGORY_DEFAULTS: Record<string, { price: number; original: number }> = {
  wedding: { price: 1999, original: 3999 },
  corporate: { price: 2499, original: 4999 },
  traditional: { price: 1499, original: 2999 },
  anniversary: { price: 1499, original: 2999 },
  birthday: { price: 1299, original: 2499 },
  'baby shower': { price: 1299, original: 2499 },
};

const DEFAULT_TIER = { price: 1499, original: 2999 };

function formatRupee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getTemplatePricing(template: {
  price?: string | null;
  original_price?: string | null;
  category?: string | null;
}): TemplatePricing {
  // 1. If custom selling price is specified in the database
  if (template?.price && template.price.trim()) {
    const rawPrice = template.price.trim();
    const numPrice = parseInt(rawPrice.replace(/[^\d]/g, ''), 10);

    // Check if custom original (slashed/MRP) price is also provided in the database
    if (template?.original_price && template.original_price.trim()) {
      const rawOrig = template.original_price.trim();
      const numOrig = parseInt(rawOrig.replace(/[^\d]/g, ''), 10);

      if (!isNaN(numPrice) && !isNaN(numOrig) && numOrig > numPrice) {
        const discountPct = Math.round(((numOrig - numPrice) / numOrig) * 100);
        return {
          price: formatRupee(numPrice),
          originalPrice: formatRupee(numOrig),
          discount: `${discountPct}% OFF`,
          numericPrice: numPrice,
          saveAmount: `Save ${formatRupee(numOrig - numPrice)}`,
        };
      } else if (!isNaN(numPrice) && !isNaN(numOrig)) {
        return {
          price: formatRupee(numPrice),
          originalPrice: formatRupee(numOrig),
          discount: 'Special Offer',
          numericPrice: numPrice,
          saveAmount: '',
        };
      }
      return {
        price: rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`,
        originalPrice: rawOrig.startsWith('₹') ? rawOrig : `₹${rawOrig}`,
        discount: 'Special Offer',
        numericPrice: !isNaN(numPrice) ? numPrice : 0,
        saveAmount: '',
      };
    }

    // Custom price exists, but original price was not specified: calculate default ~50% MRP
    if (!isNaN(numPrice) && numPrice > 0) {
      const computedOrig = Math.round(numPrice * 2);
      const discountPct = Math.round(((computedOrig - numPrice) / computedOrig) * 100);
      return {
        price: formatRupee(numPrice),
        originalPrice: formatRupee(computedOrig),
        discount: `${discountPct}% OFF`,
        numericPrice: numPrice,
        saveAmount: `Save ${formatRupee(computedOrig - numPrice)}`,
      };
    }

    return {
      price: rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`,
      originalPrice: '',
      discount: 'Special Offer',
      numericPrice: 0,
      saveAmount: '',
    };
  }

  // 2. Fallback to category standard tier when not customized in database
  const catKey = (template?.category || '').trim().toLowerCase();
  const tier = CATEGORY_DEFAULTS[catKey] || DEFAULT_TIER;
  const discountPct = Math.round(((tier.original - tier.price) / tier.original) * 100);

  return {
    price: formatRupee(tier.price),
    originalPrice: formatRupee(tier.original),
    discount: `${discountPct}% OFF`,
    numericPrice: tier.price,
    saveAmount: `Save ${formatRupee(tier.original - tier.price)}`,
  };
}
