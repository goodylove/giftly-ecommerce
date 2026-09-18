"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Reduced motion is handled globally by MotionConfig in components/ui/motion-provider.tsx,
// so this renders the same tree on the server and the client.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      // A negative bottom margin holds the trigger until the element is properly
      // on screen, so the animation isn't already over by the time you look at it.
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
