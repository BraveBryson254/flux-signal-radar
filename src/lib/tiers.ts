import { Tier } from "./mockAuth";

export interface TierDefinition {
  id: Tier;
  name: string;
  price: number; // USD per month, 0 for free
  tagline: string;
  features: string[];
  recommended?: boolean;
}

export const tiers: TierDefinition[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    tagline: "One great setup a day, on us.",
    features: [
      "1 signal per day (today's single best setup)",
      "Full entry / stop / target detail",
      "Confluence score visible",
      "Strategy tags locked",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 10,
    tagline: "The full live feed, unlocked.",
    features: [
      "Full live feed, all instruments",
      "All 6 strategies unlocked",
      "60 second refresh",
      "Up to 3 watchlist pairs",
    ],
  },
  {
    id: "moderate",
    name: "Moderate",
    price: 20,
    tagline: "Stop babysitting the dashboard.",
    recommended: true,
    features: [
      "Everything in Basic",
      "15 second refresh",
      "Unlimited watchlist",
      "Email + Telegram alerts",
      "Win-rate & avg R per strategy",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 30,
    tagline: "Wire it straight into your EA.",
    features: [
      "Everything in Moderate",
      "Real-time refresh",
      "Push alerts",
      "Full backtest archive",
      "API / webhook access",
      "Priority support",
    ],
  },
];

export const tierRank: Record<Tier, number> = {
  free: 0,
  basic: 1,
  moderate: 2,
  pro: 3,
};

export function hasAccess(userTier: Tier, requiredTier: Tier): boolean {
  return tierRank[userTier] >= tierRank[requiredTier];
}
