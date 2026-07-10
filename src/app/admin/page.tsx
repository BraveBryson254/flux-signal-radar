"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockSignals } from "@/lib/mockData";
import { tiers } from "@/lib/tiers";

// MOCK admin data — replace with real queries against your Supabase/Postgres
// users table once auth and billing are wired in.
const mockStats = {
  totalUsers: 214,
  byTier: { free: 148, basic: 41, moderate: 19, pro: 6 },
  mrr: 41 * 10 + 19 * 20 + 6 * 30,
  recentActivity: [
    { type: "signup", label: "new@trader.com signed up", time: "12m ago" },
    { type: "upgrade", label: "kim@trader.com upgraded to Pro", time: "1h ago" },
    { type: "cancel", label: "j.doe@mail.com cancelled Basic", time: "3h ago" },
    { type: "signup", label: "amina@fx.co signed up", time: "5h ago" },
  ],
};

export default function AdminPage() {
  const todaysFreeSignal = mockSignals[0];

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <h1 className="mb-1 font-display text-2xl font-semibold text-text">Admin</h1>
        <p className="mb-10 font-mono text-xs text-text-faint">
          Internal view — not linked from public nav
        </p>

        {/* Top stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total users" value={mockStats.totalUsers.toString()} />
          <StatCard label="MRR (est.)" value={`$${mockStats.mrr.toLocaleString()}`} />
          <StatCard label="Paid subscribers" value={(mockStats.totalUsers - mockStats.byTier.free).toString()} />
          <StatCard
            label="Free \u2192 paid rate"
            value={`${Math.round(((mockStats.totalUsers - mockStats.byTier.free) / mockStats.totalUsers) * 100)}%`}
          />
        </div>

        {/* Tier breakdown */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Subscribers by tier</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-panel p-5"
              >
                <p className="font-mono text-xs text-text-faint">{t.name.toUpperCase()}</p>
                <p className="mt-2 font-display text-2xl font-semibold text-text">
                  {mockStats.byTier[t.id]}
                </p>
                <p className="mt-1 font-mono text-xs text-text-muted">
                  ${t.price === 0 ? "0" : (t.price * mockStats.byTier[t.id]).toLocaleString()} MRR
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Today's free signal override */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">
            Today&apos;s free-tier signal
          </h2>
          <div className="rounded-lg border border-border bg-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-text">
                  {todaysFreeSignal.instrument} — {todaysFreeSignal.direction.toUpperCase()}
                </p>
                <p className="font-mono text-xs text-text-faint">
                  Confluence {todaysFreeSignal.confluence}% · auto-selected by the daily scan job
                </p>
              </div>
              <button className="rounded-lg border border-border px-4 py-2 font-body text-xs text-text-muted transition-colors hover:border-text-faint">
                Override selection
              </button>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Recent activity</h2>
          <div className="divide-y divide-border rounded-lg border border-border bg-panel">
            {mockStats.recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <span className="font-body text-sm text-text-muted">{a.label}</span>
                <span className="font-mono text-xs text-text-faint">{a.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <p className="font-mono text-xs text-text-faint">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-text">{value}</p>
    </div>
  );
}
