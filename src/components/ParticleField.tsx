"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide ambient background: dim particles drift and occasionally
 * "flare" (a signal detected in the noise), with faint connecting lines
 * and periodic comet-style streaks. Mounted once in the root layout,
 * fixed behind all page content.
 */
export default function ParticleField() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return; // render static, no animation loop

    const bgCanvas = bgRef.current;
    const fgCanvas = fgRef.current;
    if (!bgCanvas || !fgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    if (!bgCtx || !fgCtx) return;

    let w = 0;
    let h = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let animationId: number;

    const COLORS = {
      dim: "139,133,160",
      lime: "200,255,77",
      coral: "255,92,122",
      violet: "157,78,221",
    };

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      depth: number;
      flare: number;
      flareTarget: number;
      nextFlare: number;
      flareColor?: string;
    };

    function makeParticles(count: number, depth: number): Particle[] {
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * (0.15 + depth * 0.1),
          vy: (Math.random() - 0.5) * (0.15 + depth * 0.1),
          r: (Math.random() * 1.1 + 0.5) * (0.6 + depth),
          depth,
          flare: 0,
          flareTarget: 0,
          nextFlare: Math.random() * 2500 + 500,
        });
      }
      return arr;
    }

    let backLayer: Particle[] = [];
    let frontLayer: Particle[] = [];

    type Streak = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    };
    let streaks: Streak[] = [];

    function spawnStreak() {
      const fromLeft = Math.random() > 0.5;
      streaks.push({
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.7 + h * 0.1,
        vx: (fromLeft ? 1 : -1) * (3 + Math.random() * 2),
        vy: (Math.random() - 0.5) * 0.8,
        life: 1,
        color: Math.random() > 0.5 ? COLORS.lime : COLORS.violet,
      });
    }

    function resize() {
      w = bgCanvas!.width = fgCanvas!.width = window.innerWidth;
      h = bgCanvas!.height = fgCanvas!.height = window.innerHeight;
      backLayer = makeParticles(60, 0.4);
      frontLayer = makeParticles(40, 1);
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      targetMouseX = (e.clientX / w - 0.5) * 2;
      targetMouseY = (e.clientY / h - 0.5) * 2;
    }
    window.addEventListener("mousemove", handleMouseMove);

    const streakInterval = setInterval(spawnStreak, 4000);

    function drawParticleLayer(
      ctx: CanvasRenderingContext2D,
      particles: Particle[],
      dt: number,
      parallaxStrength: number
    ) {
      const offsetX = mouseX * 20 * parallaxStrength;
      const offsetY = mouseY * 20 * parallaxStrength;

      particles.forEach((p, i) => {
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        p.nextFlare -= dt;
        if (p.nextFlare <= 0) {
          p.flareTarget = 1;
          p.nextFlare = Math.random() * 5000 + 3000;
          const r = Math.random();
          p.flareColor = r < 0.4 ? COLORS.lime : r < 0.7 ? COLORS.coral : COLORS.violet;
        }
        p.flare += (p.flareTarget - p.flare) * 0.035 * dt * 0.06;
        if (p.flare > 0.95) p.flareTarget = 0;
        if (p.flare < 0.02 && p.flareTarget === 0) p.flare = 0;

        const px = p.x + offsetX;
        const py = p.y + offsetY;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = 110;
          if (dist < threshold) {
            const strength = (1 - dist / threshold) * (0.5 + Math.max(p.flare, q.flare));
            ctx.strokeStyle = `rgba(${COLORS.violet},${0.1 * strength})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(q.x + offsetX, q.y + offsetY);
            ctx.stroke();
          }
        }

        const baseOpacity = (0.22 + p.flare * 0.6) * (0.5 + p.depth * 0.5);
        const color = p.flare > 0.05 ? p.flareColor! : COLORS.dim;
        const radius = p.r + p.flare * 3;

        if (p.flare > 0.08) {
          const glowR = radius * 6 * p.flare;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          grad.addColorStop(0, `rgba(${color},${0.3 * p.flare})`);
          grad.addColorStop(1, `rgba(${color},0)`);
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, radius * 2.5 + p.flare * 14, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color},${0.35 * (1 - p.flare) + 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${baseOpacity})`;
        ctx.fill();
      });
    }

    function drawStreaks(ctx: CanvasRenderingContext2D, dt: number) {
      streaks = streaks.filter((s) => s.life > 0);
      streaks.forEach((s) => {
        s.x += s.vx * dt * 0.06;
        s.y += s.vy * dt * 0.06;
        if (s.x < -100 || s.x > w + 100) s.life = 0;

        const grad = ctx.createLinearGradient(
          s.x - s.vx * 12,
          s.y - s.vy * 12,
          s.x,
          s.y
        );
        grad.addColorStop(0, `rgba(${s.color},0)`);
        grad.addColorStop(1, `rgba(${s.color},0.7)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 12, s.y - s.vy * 12);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},0.8)`;
        ctx.fill();
      });
    }

    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      bgCtx!.clearRect(0, 0, w, h);
      fgCtx!.clearRect(0, 0, w, h);

      drawParticleLayer(bgCtx!, backLayer, dt, 0.4);
      drawParticleLayer(fgCtx!, frontLayer, dt, 1);
      drawStreaks(fgCtx!, dt);

      animationId = requestAnimationFrame(tick);
    }
    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(streakInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={bgRef} className="absolute inset-0" />
      <canvas ref={fgRef} className="absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(13,11,20,0.75) 100%)",
        }}
      />
    </div>
  );
}
