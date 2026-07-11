"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

/**
 * Display-only currency conversion. Subscription price of record stays
 * USD internally (see /lib/tiers.ts) — this only affects what number
 * is shown to the user. Rates are static placeholders; swap for a live
 * FX rate fetch when wiring up real billing.
 */
export type Currency = "USD" | "KES" | "EUR" | "GBP";

const RATES: Record<Currency, number> = {
  USD: 1,
  KES: 129,
  EUR: 0.92,
  GBP: 0.79,
};

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  KES: "KSh",
  EUR: "€",
  GBP: "£",
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = "flux-signal-radar:currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Currency | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && RATES[stored]) setCurrencyState(stored);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem(STORAGE_KEY, c);
  };

  const format = (usdAmount: number) => {
    if (usdAmount === 0) return `${SYMBOLS[currency]}0`;
    const converted = usdAmount * RATES[currency];
    const rounded = currency === "KES" ? Math.round(converted) : Math.round(converted * 100) / 100;
    return `${SYMBOLS[currency]}${rounded.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
