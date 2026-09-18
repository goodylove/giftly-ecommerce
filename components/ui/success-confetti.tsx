"use client";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

// Renders nothing — canvas-confetti creates its own fixed-position canvas on
// document.body and removes it automatically once the particles settle.
export function SuccessConfetti() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    confetti({
      particleCount: 130,
      spread: 70,
      startVelocity: 38,
      scalar: 0.9,
      origin: { y: 0.6 },
      // Brand rose + charcoal + white, not canvas-confetti's multicolor default —
      // keeps it reading as on-brand rather than generic party confetti.
      colors: ["#e11d48", "#fb7185", "#18181b", "#ffffff"],
      // canvas-confetti's own prefers-reduced-motion check — the correct place
      // for this, not a manual re-implementation.
      disableForReducedMotion: true,
    });
  }, []);

  return null;
}
