"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Radar } from "lucide-react";
import CountUp from "./CountUp";
import NewsletterSignup from "./NewsletterSignup";
import {
  company,
  leadership,
  contact,
  location,
  platformLinks,
  legalLinks,
  socialLinks,
  platformStats,
  trustIndicators,
} from "@/lib/footerData";

function Icon({ name, size = 15, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Circle) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 pt-16">
      <div className="mx-auto max-w-6xl">
        {/* Top: company + newsletter */}
        <div className="grid grid-cols-1 gap-10 border-b border-border pb-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Radar size={18} className="text-accent" />
              <span className="font-display text-sm font-semibold text-text">{company.name}</span>
            </div>
            <p className="mt-1 font-mono text-xs text-accent">{company.tagline}</p>
            <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-text-muted">
              {company.description}
            </p>
          </div>
          <NewsletterSignup />
        </div>

        {/* Leadership */}
        <div className="grid grid-cols-1 gap-6 border-b border-border py-12 sm:grid-cols-2">
          {leadership.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex items-start gap-4 rounded-lg border border-border bg-panel p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-panel-raised font-display text-sm font-semibold text-accent">
                {leader.initials}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-text">{leader.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-accent">{leader.role}</p>
                <p className="mt-2 font-body text-xs leading-relaxed text-text-muted">{leader.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 border-b border-border py-12 sm:grid-cols-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-text-faint">PLATFORM</p>
            <ul className="mt-3 space-y-2">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-sm text-text-muted hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-widest text-text-faint">LEGAL</p>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-sm text-text-muted hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-widest text-text-faint">CONTACT</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-text-muted">
              <li>{contact.support}</li>
              <li>{contact.business}</li>
              <li>{contact.partnerships}</li>
              <li className="text-text-faint">{contact.phone}</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-widest text-text-faint">{location.label.toUpperCase()}</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-text-muted">
              <li>{location.city}</li>
              <li className="text-xs leading-relaxed text-text-faint">{location.coverage}</li>
              <li className="text-xs text-text-faint">{location.hours}</li>
            </ul>
          </div>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 gap-6 border-b border-border py-12 sm:grid-cols-3 lg:grid-cols-6">
          {platformStats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-2xl font-semibold text-text">
                <CountUp value={s.value} suffix={s.suffix ?? "+"} />
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-wide text-text-faint">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b border-border py-8 sm:justify-start">
          {trustIndicators.map((t) => (
            <div key={t.label} className="flex items-center gap-1.5">
              <Icon name={t.icon} size={13} className="text-accent" />
              <span className="font-mono text-[11px] text-text-faint">{t.label}</span>
            </div>
          ))}
        </div>

        {/* Social */}
        <div className="flex flex-wrap justify-center gap-3 py-8 sm:justify-start">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Icon name={s.icon} size={15} />
            </a>
          ))}
        </div>

        {/* Mission */}
        <div className="border-t border-border py-10">
          <p className="mx-auto max-w-2xl text-center font-body text-sm leading-relaxed text-text-muted">
            {company.mission}
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-2 border-t border-border py-8 text-center">
          <p className="font-mono text-[11px] text-text-faint">
            © 2026 Flux Signal Radar. Built with ♥ in Nairobi, Kenya.
          </p>
          <p className="font-mono text-[11px] text-text-faint">
            Founded by Bryson Brave &amp; Marrion Brave. Empowering the next generation of African traders.
          </p>
          <p className="mt-2 max-w-xl font-mono text-[10px] leading-relaxed text-text-faint">
            RISK DISCLOSURE — Signals shown are for informational purposes only and do not
            constitute financial advice. Trading leveraged products carries a high level of risk
            and may not be suitable for all investors. Past performance is not indicative of
            future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
