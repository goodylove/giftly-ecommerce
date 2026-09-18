"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// `reducedMotion="user"` lets Framer suppress transform/layout animations for people
// who ask for reduced motion, while still allowing opacity so content stays visible.
// Doing it here rather than branching on useReducedMotion() in each component matters:
// the server can't know the preference, so render-time branching produces a different
// tree on the client and breaks hydration.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
