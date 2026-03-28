// ─────────────────────────────────────────────
// APHIP — Utility Functions
// ─────────────────────────────────────────────

import type { RiskCategory } from '@/types';
import {
  RISK_THRESHOLDS,
  RISK_CATEGORY_COLORS,
  RISK_CATEGORY_BG,
  RISK_CATEGORY_GLOW,
  RISK_CATEGORY_LABELS,
} from '@/constants';

// ── Math Utilities ──────────────────────────────

/**
 * Sigmoid activation function
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Linear interpolation between a and b
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t);
}

/**
 * Normalize a value from [inMin, inMax] to [outMin, outMax]
 */
export function normalize(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1
): number {
  if (inMax === inMin) return outMin;
  return clamp(((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin);
}

/**
 * Round to N decimal places
 */
export function round(value: number, decimals = 3): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ── Risk Category Resolver ──────────────────────

/**
 * Get risk category from a [0,1] score
 */
export function getRiskCategory(score: number): RiskCategory {
  const s = clamp(score);
  for (const [cat, [lo, hi]] of Object.entries(RISK_THRESHOLDS) as [RiskCategory, [number, number]][]) {
    if (s >= lo && s < hi) return cat;
  }
  return 'CRITICAL';
}

export function getCategoryColor(category: RiskCategory): string {
  return RISK_CATEGORY_COLORS[category];
}

export function getCategoryBg(category: RiskCategory): string {
  return RISK_CATEGORY_BG[category];
}

export function getCategoryGlow(category: RiskCategory): string {
  return RISK_CATEGORY_GLOW[category];
}

export function getCategoryLabel(category: RiskCategory): string {
  return RISK_CATEGORY_LABELS[category];
}

// ── Formatting ──────────────────────────────────

/**
 * Format a [0,1] score as percentage string
 */
export function fmtPercent(value: number, decimals = 1): string {
  return `${(clamp(value) * 100).toFixed(decimals)}%`;
}

/**
 * Format a [0,1] score as 0–100 integer
 */
export function fmtScore(value: number): number {
  return Math.round(clamp(value) * 100);
}

/**
 * Format confidence as percentage
 */
export function fmtConfidence(value: number): string {
  return `${Math.round(clamp(value, 0.5, 1) * 100)}%`;
}

/**
 * Format timestamp to HH:MM:SS
 */
export function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format timestamp to short time label (HH:MM)
 */
export function fmtTimeShort(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date
 */
export function fmtDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ── Chart Data Adapter ──────────────────────────

/**
 * Convert trend history to recharts-compatible format
 */
export function adaptChartData(
  history: Array<{
    time: string;
    t?: number;
    riskScore: number;
    waterRisk: number;
    vectorRisk: number;
    sanitation: number;
    exposure: number;
  }>
) {
  return history.map((point) => ({
    ...point,
    riskPct: round(point.riskScore, 1),
    waterPct: round(point.waterRisk * 100, 1),
    vectorPct: round(point.vectorRisk * 100, 1),
    sanitPct: round(point.sanitation * 100, 1),
    exposurePct: round(point.exposure * 100, 1),
  }));
}

// ── Logger ──────────────────────────────────────

const IS_DEV = import.meta.env.DEV;

export const log = {
  info: (...args: unknown[]) => {
    if (IS_DEV) console.log('%c[APHIP]', 'color:#38bdf8;font-weight:bold', ...args);
  },
  warn: (...args: unknown[]) => {
    if (IS_DEV) console.warn('%c[APHIP WARN]', 'color:#f59e0b;font-weight:bold', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('%c[APHIP ERR]', 'color:#ef4444;font-weight:bold', ...args);
  },
  model: (...args: unknown[]) => {
    if (IS_DEV) console.log('%c[MODEL]', 'color:#a78bfa;font-weight:bold', ...args);
  },
};

// ── Color Interpolation ─────────────────────────

/**
 * Interpolate between two hex colors based on t ∈ [0,1]
 */
export function interpolateColor(color1: string, color2: string, t: number): string {
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  const [r1, g1, b1] = hex2rgb(color1);
  const [r2, g2, b2] = hex2rgb(color2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Get color for a risk score ∈ [0,1]
 * Green → Amber → Orange → Red
 */
export function getRiskColor(score: number): string {
  const s = clamp(score);
  if (s < 0.35) return interpolateColor('#10b981', '#f59e0b', s / 0.35);
  if (s < 0.55) return interpolateColor('#f59e0b', '#f97316', (s - 0.35) / 0.2);
  return interpolateColor('#f97316', '#ef4444', (s - 0.55) / 0.45);
}

// ── SVG Arc Path ────────────────────────────────

/**
 * Build SVG arc path for gauge
 */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// ── Misc ────────────────────────────────────────

export function generateTimeLabel(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}