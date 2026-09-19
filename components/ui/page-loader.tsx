"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Masks the ~0.7s window where below-the-fold sections fade in via `Reveal`
// (whileInView), so the whole page reads as one settled frame instead of
// "nav/footer first, content trickling in after". Lives in the root layout,
// which doesn't remount on client-side navigation, so this only plays once
// per hard page load.
export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          aria-hidden="true"
        >
          <motion.span
            className="wordmark"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1, 0.97] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            Giftly<span className="text-brand">.</span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
