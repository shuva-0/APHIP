// ─────────────────────────────────────────────
// APHIP — Global Config
// ─────────────────────────────────────────────

export const APP_CONFIG = {
  name:    'APHIP',
  version: '1.0.0',
  tagline: 'Adaptive Public Health Intelligence Platform',
} as const;

export const CHART_CONFIG = {
  animDuration:   600,
  historyMax:     30,
  updateInterval: 0, // ms — 0 means manual only
} as const;

export const ANIM_CONFIG = {
  entry:   0.5,
  gauge:   1.0,
  chart:   0.6,
  hover:   0.15,
  spring:  { type: 'spring', stiffness: 200, damping: 22 },
} as const;

export const COLORS = {
  bg:        '#0b1228',
  surface:   '#0f172a',
  glass:     'rgba(255,255,255,0.03)',
  border:    'rgba(255,255,255,0.06)',
  accent:    '#38bdf8',
  text:      '#cbd5e1',
  muted:     '#64748b',
  faint:     '#334155',
} as const;

export const GAUGE_CONFIG = {
  cx:         160,
  cy:         160,
  r:          120,
  startAngle: -220,
  endAngle:   40,
  strokeWidth: 18,
} as const;