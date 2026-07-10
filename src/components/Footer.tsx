export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <span className="font-display text-sm font-semibold text-text">
              FLUX SIGNAL RADAR
            </span>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
              A live confluence scanner across forex, metals, and indices.
              Built for traders who want the setup, not the noise.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="font-mono text-xs tracking-widest text-text-faint">PRODUCT</p>
              <ul className="mt-3 space-y-2 font-body text-sm text-text-muted">
                <li><a href="#feed" className="hover:text-text">Live feed</a></li>
                <li><a href="#methodology" className="hover:text-text">Methodology</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="font-mono text-[11px] leading-relaxed text-text-faint">
            RISK DISCLOSURE — Signals shown are for informational purposes only
            and do not constitute financial advice. Trading leveraged products
            carries a high level of risk and may not be suitable for all
            investors. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
