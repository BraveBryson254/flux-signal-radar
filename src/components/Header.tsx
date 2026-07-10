"use client";

import { Radar } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <Radar size={18} className="text-accent" />
          <span className="font-display text-sm font-semibold tracking-tight text-text">
            FLUX SIGNAL RADAR
          </span>
        </a>
        <nav className="hidden items-center gap-8 font-body text-sm text-text-muted md:flex">
          <a href="#feed" className="transition-colors hover:text-text">Live feed</a>
          <a href="#methodology" className="transition-colors hover:text-text">Methodology</a>
        </nav>
        <a
          href="#feed"
          className="rounded-lg border border-border px-4 py-2 font-body text-sm font-medium text-text transition-colors hover:border-text-faint"
        >
          Open scanner
        </a>
      </div>
    </header>
  );
}
