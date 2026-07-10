import Link from "next/link";
import { RadarIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg px-6 text-center">
      <RadarIcon size={28} className="text-accent" />
      <div>
        <p className="font-mono text-xs tracking-widest text-accent">SCAN.404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-text">
          Nothing on the radar here.
        </h1>
        <p className="mt-2 max-w-sm font-body text-sm text-text-muted">
          This page doesn&apos;t exist. The live feed is still running back on
          the homepage.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
      >
        Back to the scanner
      </Link>
    </div>
  );
}
