"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import type { Tier } from "@/lib/mockAuth";

/**
 * Renders children when the current user meets `requiredTier`, otherwise
 * an upgrade prompt. Centralizes the previously-duplicated
 * "unlocked ? content : /pricing" pattern used across the app.
 */
export default function TierGate({
  requiredTier,
  children,
  title,
  description,
}: {
  requiredTier: Tier;
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const { user } = useAuth();
  const tier = user?.tier ?? "free";

  if (hasAccess(tier, requiredTier)) return <>{children}</>;

  const req = tierById(requiredTier);
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-accent bg-panel/50 p-8 text-center">
      <Lock size={18} className="text-accent" />
      {title && <p className="font-display text-sm font-semibold text-text">{title}</p>}
      <p className="max-w-sm font-body text-sm text-text-muted">
        {description ?? `This is available on the ${req.name} plan and above.`}
      </p>
      <Link
        href="/pricing"
        className="mt-1 rounded-lg bg-accent px-4 py-2 font-body text-xs font-semibold text-bg transition-transform hover:scale-[1.03]"
      >
        Unlock with {req.name} — ${req.price}/mo
      </Link>
    </div>
  );
}
