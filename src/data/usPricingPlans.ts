import type { USPlanTier } from "../context/CreateCentreContext";

export interface USPricingPlan {
  id: USPlanTier;
  name: string;
  description: string;
  priceLine: string;
  priceMonthly: number;
  priceAnnual: number;
  recommended?: boolean;
}

export const US_PRICING_PLANS: USPricingPlan[] = [
  {
    id: "smart",
    name: "Smart",
    description: "Cost-sensitive small labs & solo offices needing rapid core setup.",
    priceLine: "USD $600/mo · billed annually $7,200/yr · Self-service onboarding",
    priceMonthly: 600,
    priceAnnual: 7200,
  },
  {
    id: "optimized",
    name: "Optimised",
    description: "Mid-size standalone labs wanting efficiency without deep customization.",
    priceLine: "USD $1,400/mo · billed annually $16,800/yr · 8-week assisted setup",
    priceMonthly: 1400,
    priceAnnual: 16800,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Growing multi-location labs needing tailored, scalable operations.",
    priceLine: "USD $2,750/mo · billed annually $33,000/yr · Custom-assisted onboarding",
    priceMonthly: 2750,
    priceAnnual: 33000,
    recommended: true,
  },
  {
    id: "power",
    name: "Power",
    description: "Enterprise multi-site networks with complex, high-volume demands.",
    priceLine: "USD $4,900/mo · billed annually $58,800/yr · On-site + dedicated AM",
    priceMonthly: 4900,
    priceAnnual: 58800,
  },
];

export const US_PLAN_LABELS: Record<USPlanTier, string> = {
  smart: "Smart",
  optimized: "Optimised",
  pro: "Pro",
  power: "Power",
};
