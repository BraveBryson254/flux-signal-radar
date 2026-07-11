"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // margin 0 so it triggers as soon as any part enters — more reliable on
  // short mobile viewports than a negative inset margin.
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Respect reduced-motion: skip the tween, show the final number.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  // Fallback: never leave a number stuck at 0 if in-view never registers
  // on some mobile browsers.
  useEffect(() => {
    const t = setTimeout(() => {
      setDisplay((d) => (d === 0 && value !== 0 ? value : d));
    }, 2000);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
