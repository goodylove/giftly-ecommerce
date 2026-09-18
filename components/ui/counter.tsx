"use client";
import { useEffect, useRef } from "react";

// Server-renders the final value, then counts up to it once scrolled into view.
// Props stay serializable (no formatter callbacks) so server components can render this.
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (amount: number) =>
      `${prefix}${new Intl.NumberFormat("en-NG").format(amount)}${suffix}`;

    el.textContent = format(0);
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = format(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${new Intl.NumberFormat("en-NG").format(value)}${suffix}`}
    </span>
  );
}
