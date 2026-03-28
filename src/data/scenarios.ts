// ─────────────────────────────────────────────
// APHIP — Scenario Presets
// ─────────────────────────────────────────────

import type { UserInput, RiskCategory } from '@/types';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  category: RiskCategory;
  input: UserInput;
}

export const scenarios: Record<string, Scenario> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal — Safe Village',
    description: 'Clean water, no vectors, good sanitation, low population exposure.',
    category: 'MINIMAL',
    input: {
      clarity: 'clear',
      color: 'none',
      odor: 'none',
      stagnation: false,
      mosquito: 'none',
      garbage: 'low',
      drainage: 'good',
      rainfall: 'none',
      duration: '<1',
      trend: 'improving',
      usage: 'washing',
      population: 'low',
      vulnerable: false,
      illness: 'none',
      illnessType: 'unknown',
    },
  },

  lowRisk: {
    id: 'lowRisk',
    name: 'Low — Rural Dry Season',
    description: 'Mild water discoloration, few mosquitoes, manageable conditions.',
    category: 'LOW',
    input: {
      clarity: 'mild',
      color: 'yellow',
      odor: 'none',
      stagnation: false,
      mosquito: 'few',
      garbage: 'low',
      drainage: 'good',
      rainfall: 'light',
      duration: '<1',
      trend: 'same',
      usage: 'washing',
      population: 'low',
      vulnerable: false,
      illness: 'none',
      illnessType: 'unknown',
    },
  },

  moderate: {
    id: 'moderate',
    name: 'Moderate — Post-Rain Flood',
    description: 'Muddy water, stagnant pools forming, blocked drainage after heavy rain.',
    category: 'MODERATE',
    input: {
      clarity: 'muddy',
      color: 'brown',
      odor: 'mild',
      stagnation: true,
      mosquito: 'few',
      garbage: 'medium',
      drainage: 'blocked',
      rainfall: 'heavy',
      duration: '1-3',
      trend: 'worsening',
      usage: 'washing',
      population: 'medium',
      vulnerable: false,
      illness: 'none',
      illnessType: 'unknown',
    },
  },

  highRisk: {
    id: 'highRisk',
    name: 'High — Urban Slum Monsoon',
    description: 'Contaminated water being consumed, many mosquitoes, overflow drainage.',
    category: 'HIGH',
    input: {
      clarity: 'muddy',
      color: 'green',
      odor: 'strong',
      stagnation: true,
      mosquito: 'many',
      garbage: 'high',
      drainage: 'overflow',
      rainfall: 'heavy',
      duration: '>3',
      trend: 'worsening',
      usage: 'drinking',
      population: 'high',
      vulnerable: true,
      illness: 'few',
      illnessType: 'fever',
    },
  },

  critical: {
    id: 'critical',
    name: 'Critical — Active Outbreak',
    description: 'Full contamination scenario with active disease spread and overwhelmed systems.',
    category: 'CRITICAL',
    input: {
      clarity: 'muddy',
      color: 'brown',
      odor: 'strong',
      stagnation: true,
      mosquito: 'many',
      garbage: 'high',
      drainage: 'overflow',
      rainfall: 'heavy',
      duration: '>3',
      trend: 'worsening',
      usage: 'drinking',
      population: 'high',
      vulnerable: true,
      illness: 'many',
      illnessType: 'diarrhea',
    },
  },
};

export const scenarioList: Scenario[] = Object.values(scenarios);

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}