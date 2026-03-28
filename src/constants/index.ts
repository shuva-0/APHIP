// ─────────────────────────────────────────────
// APHIP — Constants
// ─────────────────────────────────────────────

import type { RiskCategory, FeatureSet } from '@/types';

// ── App Meta ─────────────────────────────────

export const APP_VERSION = '1.0.0';
export const APP_BUILD   = 'APHIP-BUILD-2025';

// ── Input → Numeric Mappings ─────────────────

export const CLARITY_MAP: Record<string, number> = {
  clear: 0,
  mild:  0.5,
  muddy: 1,
};

export const COLOR_MAP: Record<string, number> = {
  none:   0,
  yellow: 0.4,
  green:  0.7,
  brown:  1,
};

export const ODOR_MAP: Record<string, number> = {
  none:   0,
  mild:   0.5,
  strong: 1,
};

export const MOSQUITO_MAP: Record<string, number> = {
  none: 0,
  few:  0.5,
  many: 1,
};

export const GARBAGE_MAP: Record<string, number> = {
  low:    0,
  medium: 0.5,
  high:   1,
};

export const DRAINAGE_MAP: Record<string, number> = {
  good:     0,
  blocked:  0.6,
  overflow: 1,
};

export const RAINFALL_MAP: Record<string, number> = {
  none:  0,
  light: 0.5,
  heavy: 1,
};

export const DURATION_MAP: Record<string, number> = {
  '<1': 0,
  '1-3': 0.5,
  '>3':  1,
};

export const TREND_MAP: Record<string, number> = {
  improving: 0,
  same:      0.5,
  worsening: 1,
};

export const USAGE_MAP: Record<string, number> = {
  drinking: 1,
  washing:  0.5,
  none:     0,
};

export const POPULATION_MAP: Record<string, number> = {
  low:    0,
  medium: 0.5,
  high:   1,
};

export const ILLNESS_MAP: Record<string, number> = {
  none: 0,
  few:  0.5,
  many: 1,
};

export const ILLNESS_TYPE_MAP: Record<string, number> = {
  fever:    0.6,
  diarrhea: 0.9,
  unknown:  0.5,
};

// ── Risk Thresholds ──────────────────────────

export const RISK_THRESHOLDS: Record<RiskCategory, [number, number]> = {
  MINIMAL:  [0,    0.20],
  LOW:      [0.20, 0.35],
  MODERATE: [0.35, 0.55],
  HIGH:     [0.55, 0.75],
  CRITICAL: [0.75, 1.01],
};

// ── Category Colors ──────────────────────────

export const RISK_CATEGORY_COLORS: Record<RiskCategory, string> = {
  MINIMAL:  '#10b981',
  LOW:      '#34d399',
  MODERATE: '#f59e0b',
  HIGH:     '#f97316',
  CRITICAL: '#ef4444',
};

export const RISK_CATEGORY_BG: Record<RiskCategory, string> = {
  MINIMAL:  'rgba(16,185,129,0.08)',
  LOW:      'rgba(52,211,153,0.08)',
  MODERATE: 'rgba(245,158,11,0.08)',
  HIGH:     'rgba(249,115,22,0.08)',
  CRITICAL: 'rgba(239,68,68,0.08)',
};

export const RISK_CATEGORY_GLOW: Record<RiskCategory, string> = {
  MINIMAL:  '0 0 24px rgba(16,185,129,0.4)',
  LOW:      '0 0 24px rgba(52,211,153,0.4)',
  MODERATE: '0 0 24px rgba(245,158,11,0.4)',
  HIGH:     '0 0 24px rgba(249,115,22,0.4)',
  CRITICAL: '0 0 24px rgba(239,68,68,0.4)',
};

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  MINIMAL:  'Minimal Risk',
  LOW:      'Low Risk',
  MODERATE: 'Moderate Risk',
  HIGH:     'High Risk',
  CRITICAL: 'Critical Risk',
};

// ── Factor Colors & Labels ───────────────────

export const FACTOR_COLORS: Record<keyof FeatureSet, string> = {
  waterRisk:    '#38bdf8',
  vectorRisk:   '#f97316',
  sanitation:   '#8b5cf6',
  exposure:     '#fb923c',
  healthSignal: '#f43f5e',
};

export const FACTOR_LABELS: Record<keyof FeatureSet, string> = {
  waterRisk:    'Water Risk',
  vectorRisk:   'Vector Risk',
  sanitation:   'Sanitation',
  exposure:     'Exposure',
  healthSignal: 'Health Signal',
};

// ── Chart Config ─────────────────────────────

export const CHART_HISTORY_MAX = 30;