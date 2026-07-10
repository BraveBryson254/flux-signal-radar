"use client";

/**
 * Shimmer skeleton for loading states. Uses a CSS animation (defined in
 * globals.css) so it's GPU-cheap and respects prefers-reduced-motion.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-16 w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
