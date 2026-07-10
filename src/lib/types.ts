export type Direction = "long" | "short";

export type Session = "asian" | "london" | "new-york";

export type StrategyId =
  | "smc"
  | "ict"
  | "wyckoff"
  | "snr"
  | "r-multiple"
  | "propfirm";

export interface Strategy {
  id: StrategyId;
  label: string;
  short: string;
  description: string;
}

export interface Signal {
  id: string;
  instrument: string;
  assetClass: "forex" | "metals" | "indices" | "crypto";
  direction: Direction;
  confluence: number; // 0-100
  session: Session;
  timeframe: string;
  strategies: StrategyId[];
  riskReward: number; // e.g. 2.4
  entry: number;
  stop: number;
  target: number;
  detectedAt: string; // ISO-ish label, e.g. "2m ago"
  trend: number[]; // recent normalized price points, oldest to newest, for the sparkline
}
