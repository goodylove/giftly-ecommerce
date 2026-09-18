"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { CardArtwork } from "@/components/gift-cards/card-artwork";
import type { GiftCard } from "@/lib/gift-cards";

// Depth per card: the nearest card travels furthest, which is what sells the parallax.
const LAYERS = [
  { className: "hero-card hero-card--back", depth: 10 },
  { className: "hero-card hero-card--mid", depth: 20 },
  { className: "hero-card hero-card--front", depth: 34 },
];

export function HeroCards({ cards }: { cards: GiftCard[] }) {
  const shouldReduceMotion = useReducedMotion();

  // -0.5 … 0.5 across the hero, smoothed so the stack glides instead of snapping.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.6 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    // Event handlers never reach the SSR markup, so gating here can't desync hydration.
    if (shouldReduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      className="hero-visual"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <div className="hero-stage">
        {cards.map((card, index) => (
          <Layer key={card.id} card={card} layer={LAYERS[index]} x={x} y={y} index={index} />
        ))}
      </div>
    </div>
  );
}

function Layer({
  card,
  layer,
  x,
  y,
  index,
}: {
  card: GiftCard;
  layer: (typeof LAYERS)[number];
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  index: number;
}) {
  const translateX = useTransform(x, [-0.5, 0.5], [-layer.depth, layer.depth]);
  const translateY = useTransform(y, [-0.5, 0.5], [-layer.depth * 0.6, layer.depth * 0.6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [12, -12]);
  const rotateX = useTransform(y, [-0.5, 0.5], [-9, 9]);

  return (
    <motion.div
      className={layer.className}
      style={{ x: translateX, y: translateY, rotateX, rotateY }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <CardArtwork card={card} />
    </motion.div>
  );
}
