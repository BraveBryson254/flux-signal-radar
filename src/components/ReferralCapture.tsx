"use client";

import { useEffect } from "react";

const STORAGE_KEY = "flux_referral_code";

/**
 * Mounted globally. If a visitor lands on any page with ?ref=CODE in the
 * URL, the code is saved so it survives navigation through to signup —
 * ambassador links point at the homepage, not directly at /signup.
 */
export default function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) window.localStorage.setItem(STORAGE_KEY, ref.toUpperCase());
  }, []);

  return null;
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}
