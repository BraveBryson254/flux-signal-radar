"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Motion";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess } from "@/lib/tiers";
import { defaultPreferences, NotificationPreferences } from "@/lib/notificationData";
import { fetchPreferences, savePreferences } from "@/lib/notificationService";

function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative h-6 w-11 rounded-full transition-colors disabled:opacity-40"
      style={{ background: on ? "var(--color-accent)" : "var(--color-border)" }}
      aria-pressed={on}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-bg transition-transform"
        style={{ left: 2, transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [prefs, setPrefs] = useState<NotificationPreferences>(defaultPreferences);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefsLoading(true);
    fetchPreferences(user.id).then((data) => {
      setPrefs(data);
      setPrefsLoading(false);
    });
  }, [user]);

  if (isLoading || !user || prefsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  // Tier gating: browser push is Basic+, per V9 tier architecture
  const canPush = hasAccess(user.tier, "basic");

  const toggleGroup = (group: keyof Pick<NotificationPreferences, "markets" | "types" | "channels">, key: string) => {
    setPrefs((p) => ({ ...p, [group]: { ...p[group], [key]: !p[group][key] } }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    await savePreferences(user.id, prefs);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-2xl px-6 pt-28 pb-20">
        <Link href="/notifications" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text">
          <ArrowLeft size={13} /> Notifications
        </Link>

        <Reveal>
          <h1 className="font-display text-2xl font-semibold text-text">Notification preferences</h1>
          <p className="mt-2 font-body text-sm text-text-muted">
            Choose what you hear about and how. We only notify you about markets you follow.
          </p>
        </Reveal>

        <Section title="Markets">
          {Object.entries(prefs.markets).map(([k, v]) => (
            <Row key={k} label={k}>
              <Toggle on={v} onClick={() => toggleGroup("markets", k)} />
            </Row>
          ))}
        </Section>

        <Section title="Notification types">
          {Object.entries(prefs.types).map(([k, v]) => (
            <Row key={k} label={k}>
              <Toggle on={v} onClick={() => toggleGroup("types", k)} />
            </Row>
          ))}
        </Section>

        <Section title="Delivery channels">
          {Object.entries(prefs.channels).map(([k, v]) => {
            const isPush = k === "Browser push";
            const locked = isPush && !canPush;
            return (
              <Row key={k} label={k} note={locked ? "Basic and above" : undefined}>
                <Toggle on={locked ? false : v} onClick={() => !locked && toggleGroup("channels", k)} disabled={locked} />
              </Row>
            );
          })}
        </Section>

        <Section title="Frequency">
          <div className="flex flex-wrap gap-2 p-4">
            {(["instant", "hourly", "daily", "weekly"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setPrefs((p) => ({ ...p, frequency: f })); setSaved(false); }}
                className="rounded-full border px-3 py-1.5 font-mono text-xs capitalize transition-colors"
                style={{
                  borderColor: prefs.frequency === f ? "var(--color-accent)" : "var(--color-border)",
                  color: prefs.frequency === f ? "var(--color-accent)" : "var(--color-text-muted)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <Row label="Quiet hours (10pm–7am)">
            <Toggle on={prefs.quietHours} onClick={() => { setPrefs((p) => ({ ...p, quietHours: !p.quietHours })); setSaved(false); }} />
          </Row>
        </Section>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saved ? <><Check size={14} /> Saved</> : saving ? "Saving..." : "Save preferences"}
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">{title.toUpperCase()}</h2>
      <div className="divide-y divide-border rounded-xl border border-border bg-panel">{children}</div>
    </section>
  );
}

function Row({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <span className="font-body text-sm text-text">{label}</span>
        {note && <span className="ml-2 font-mono text-[10px] text-text-faint">{note}</span>}
      </div>
      {children}
    </div>
  );
}
