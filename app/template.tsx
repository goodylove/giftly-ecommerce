"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// template.tsx remounts on every navigation, which gives each route an entrance
// animation. Kept short and opacity-led so it doesn't hold up the first paint.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      data-page-transition
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
