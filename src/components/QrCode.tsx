"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Renders a QR code for the given text as a data URL image. Generated
 * client-side, no network call — works offline and needs no API key.
 */
export default function QrCode({ value, size = 140 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#0d0b14", light: "#f2eefa" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-panel-raised"
        style={{ width: size, height: size }}
      >
        <span className="font-mono text-[9px] text-text-faint">Generating…</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={dataUrl} alt="Referral link QR code" width={size} height={size} className="rounded-lg" />;
}
