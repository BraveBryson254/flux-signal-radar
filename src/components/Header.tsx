"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Radar, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/mockAuth";
import NotificationCenter from "@/components/NotificationCenter";

const marketingLinks = [
  { href: "/feed", label: "Live feed" },
  { href: "/methodology", label: "Methodology" },
  { href: "/pricing", label: "Pricing" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/academy", label: "Academy" },
  { href: "/games", label: "Arena" },
  { href: "/community", label: "Community" },
  { href: "/ambassador", label: "Ambassador" },
  { href: "/coach", label: "Coach" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    // Pause momentum scroll while the mobile menu is open so it can't
    // scroll behind the overlay, then resume.
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleOpenScanner = () => {
    closeMenu();
    router.push(user ? "/dashboard" : "/signup");
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Radar size={18} className="text-accent" />
          <span className="font-display text-sm font-semibold tracking-tight text-text">
            FLUX SIGNAL RADAR
          </span>
          <AnimatePresence>
            {scrolled && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="ml-1 hidden items-center gap-1.5 rounded-full border border-border bg-panel px-2 py-0.5 sm:flex"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-[10px] text-accent">SCANNING</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-text-muted md:flex">
          {(user ? appLinks : marketingLinks).map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NotificationCenter />
              <Link
                href="/profile"
                className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-border px-4 py-2 font-body text-sm font-medium text-text transition-colors hover:border-text-faint"
              >
                Log in
              </Link>
              <button
                onClick={handleOpenScanner}
                className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
              >
                Start free trial
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text md:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border bg-bg md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {(user ? appLinks : marketingLinks).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-body text-base text-text-muted transition-colors hover:bg-panel hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-body text-base text-text-muted transition-colors hover:bg-panel hover:text-text"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-body text-base text-text-muted transition-colors hover:bg-panel hover:text-text"
                >
                  Log in
                </Link>
              )}
              {!user && (
                <button
                  onClick={handleOpenScanner}
                  className="mt-2 rounded-lg bg-accent px-3 py-3 text-center font-body text-sm font-semibold text-bg"
                >
                  Start free trial
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
