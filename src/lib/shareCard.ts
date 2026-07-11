"use client";

/**
 * Draws a branded achievement/rank share card to a canvas and returns a
 * PNG data URL for download. Pure client-side canvas — no external
 * rendering service needed.
 */
export function generateShareCard(opts: {
  headline: string;
  subline: string;
  statLabel: string;
  statValue: string;
}): string {
  const canvas = document.createElement("canvas");
  const W = 1000;
  const H = 600;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background — ink base with a violet radial glow, matching the brand.
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#17131f");
  bg.addColorStop(1, "#0d0b14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W - 150, 120, 20, W - 150, 120, 420);
  glow.addColorStop(0, "rgba(157,78,221,0.35)");
  glow.addColorStop(1, "rgba(157,78,221,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = "#2a2438";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // Brand mark
  ctx.fillStyle = "#9d4edd";
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.fillText("FLUX SIGNAL RADAR", 60, 80);

  // Headline
  ctx.fillStyle = "#f2eefa";
  ctx.font = "600 56px 'Space Grotesk', sans-serif";
  wrapText(ctx, opts.headline, 60, 220, W - 120, 62);

  // Subline
  ctx.fillStyle = "#8b85a0";
  ctx.font = "400 24px Inter, sans-serif";
  ctx.fillText(opts.subline, 60, 300);

  // Stat block
  ctx.fillStyle = "#8b85a0";
  ctx.font = "500 16px 'JetBrains Mono', monospace";
  ctx.fillText(opts.statLabel.toUpperCase(), 60, 460);
  ctx.fillStyle = "#c8ff4d";
  ctx.font = "600 48px 'Space Grotesk', sans-serif";
  ctx.fillText(opts.statValue, 60, 510);

  // Footer
  ctx.fillStyle = "#5a5468";
  ctx.font = "400 14px 'JetBrains Mono', monospace";
  ctx.fillText("flux-signal-radar.vercel.app", 60, H - 40);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, curY);
      line = word + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
