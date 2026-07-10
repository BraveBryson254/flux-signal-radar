import { Tier } from "./mockAuth";

export interface TierDefinition {
  id: Tier;
  name: string;
  persona: string;
  price: number; // USD/month, 0 for free
  tagline: string;
  features: string[];
  recommended?: boolean;
}

export const tiers: TierDefinition[] = [
  {
    id: "free",
    name: "Apprentice",
    persona: "Apprentice Trader",
    price: 0,
    tagline: "Learn, explore, and build the habit.",
    features: [
      "Daily free signal + market outlook",
      "Beginner Academy & sample library",
      "Trading games, missions & XP",
      "Weekly demo competitions",
      "Public community & leaderboard",
      "Basic trading journal",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    persona: "Professional Trader",
    price: 10,
    tagline: "Everything you need to trade consistently.",
    features: [
      "Unlimited signals + full history",
      "Full Academy, library & video center",
      "Advanced journal & personal analytics",
      "Watchlists, alerts & saved charts",
      "Standard AI Trading Coach",
      "Competition participation",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    persona: "Trading Workstation",
    price: 20,
    recommended: true,
    tagline: "A professional multi-market workstation.",
    features: [
      "Everything in Basic",
      "Advanced scanner & multi-market dashboard",
      "Gold / Forex / NASDAQ / US30 analytics",
      "Trade replay & AI trade reviews",
      "Psychology, risk & portfolio analytics",
      "Priority support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    persona: "Institutional Grade",
    price: 30,
    tagline: "The flagship, institutional-grade platform.",
    features: [
      "Everything in Pro",
      "AI Trading Lab & order flow dashboard",
      "Liquidity mapping & Smart Money analytics",
      "Elite competitions & VIP leaderboards",
      "Private community & mentorship",
      "API & automation placeholders",
    ],
  },
];

export const tierRank: Record<Tier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  elite: 3,
};

export function hasAccess(userTier: Tier, requiredTier: Tier): boolean {
  return tierRank[userTier] >= tierRank[requiredTier];
}

export function tierById(id: Tier): TierDefinition {
  return tiers.find((t) => t.id === id)!;
}
