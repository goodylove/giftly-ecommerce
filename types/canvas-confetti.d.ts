declare module "canvas-confetti" {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  // `reset` is a property on the default export at runtime, not a separate
  // named export — the ESM build (dist/confetti.module.mjs) only re-exports
  // `default` and `create`.
  interface Confetti {
    (options?: Options): Promise<void>;
    reset: () => void;
  }

  const confetti: Confetti;
  export default confetti;
}
