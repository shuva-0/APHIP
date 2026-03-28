// ─────────────────────────────────────────────
// APHIP — Motion Variants
// ─────────────────────────────────────────────

import type { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export const listVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
};

export const chartVariants: Variants = {
  initial: { opacity: 0, scaleY: 0.94 },
  animate: {
    opacity: 1, scaleY: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const recVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] },
  }),
};

export const gaugeVariants: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 22, duration: 1.0 },
  },
};

// ── Layout Variants (used by MainLayout) ─────

export const topbarVariants: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export const sidebarVariants: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: {
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};