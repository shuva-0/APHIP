// ─────────────────────────────────────────────
// APHIP — Risk Engine
// Feature Engineering + Validation + Model + Simulation + Optimization
// ─────────────────────────────────────────────


export type RawFeatures = {
  water: number | null;
  exposure: number | null;
  vector: number | null;
  sanitation: number | null;
  health: number | null;
};

export type NormalizedFeatures = {
  water: number;
  exposure: number;
  vector: number;
  sanitation: number;
  health: number;
};

import type {
  UserInput,
  FeatureSet,
  RiskOutput,
  ValidationFlag,
  ContributingFactor,
  Recommendation,
  SimulationOverrides,
} from '@/types';
import {
  CLARITY_MAP,
  COLOR_MAP,
  ODOR_MAP,
  MOSQUITO_MAP,
  GARBAGE_MAP,
  DRAINAGE_MAP,
  ILLNESS_MAP,
  ILLNESS_TYPE_MAP,
  FACTOR_COLORS,
  FACTOR_LABELS,
} from '@/constants';
import { sigmoid, clamp, getRiskCategory, log } from '@/utils';

// ── FEATURE ENGINEERING ──────────────────────────────────────────────────────

export function computeFeatures(input: UserInput): FeatureSet {
  // Water Risk: clarity (40%) + odor (30%) + color (30%)
  const waterRisk = clamp(
    0.4 * CLARITY_MAP[input.clarity] +
    0.3 * ODOR_MAP[input.odor] +
    0.3 * COLOR_MAP[input.color]
  );

  // Vector Risk: mosquito (50%) + stagnation (50%)
  const vectorRisk = clamp(
    0.5 * MOSQUITO_MAP[input.mosquito] +
    0.5 * (input.stagnation ? 1 : 0)
  );

  // Sanitation: garbage (50%) + drainage (50%)
  const sanitation = clamp(
    0.5 * GARBAGE_MAP[input.garbage] +
    0.5 * DRAINAGE_MAP[input.drainage]
  );

  // Exposure: population (60%) + usage (40%)
const exposureUsage =
  input.usage === 'drinking' ? 1 :
  input.usage === 'washing' ? 0.5 : 0;

const populationVal =
  input.population === 'high' ? 1 :
  input.population === 'medium' ? 0.5 : 0;

let exposure = clamp(
  0.6 * populationVal +
  0.4 * exposureUsage
);

// ── Logical constraints ──
if (populationVal === 0 || exposureUsage === 0) {
  exposure = 0;
}

  // Health Signal: illness level + illness type (if applicable)
  const illnessBase  = ILLNESS_MAP[input.illness];
  const illnessType  = input.illness !== 'none' ? ILLNESS_TYPE_MAP[input.illnessType] : 0;
  const healthSignal = clamp(
    illnessBase * 0.6 + illnessType * 0.4
  );

  log.model('Features computed:', { waterRisk, vectorRisk, sanitation, exposure, healthSignal });

  return { waterRisk, vectorRisk, sanitation, exposure, healthSignal };
}

// ── VALIDATION ENGINE ────────────────────────────────────────────────────────

export function computeConfidence(input: UserInput, features: FeatureSet): {
  confidence: number;
  flags: ValidationFlag[];
} {
  const flags: ValidationFlag[] = [];

  // Flag: clear water but strong odor
  if (input.clarity === 'clear' && input.odor === 'strong') {
    flags.push({
      code: 'CLARITY_ODOR_CONFLICT',
      message: 'Clear water reported with strong odor — possible chemical contamination not visible to naked eye.',
      severity: 'warning',
    });
  }

  // Flag: no stagnation but many mosquitoes
  if (!input.stagnation && input.mosquito === 'many') {
    flags.push({
      code: 'VECTOR_STAGNATION_CONFLICT',
      message: 'High mosquito density without stagnant water — mosquito breeding site may be nearby but unobserved.',
      severity: 'warning',
    });
  }

  // Flag: no illness but very high risk
  if (input.illness === 'none' && features.waterRisk > 0.7 && features.vectorRisk > 0.7) {
    flags.push({
      code: 'SILENT_HIGH_RISK',
      message: 'No illness reported despite high environmental risk factors — early-stage outbreak possible.',
      severity: 'warning',
    });
  }

  // Flag: many illnesses but good water quality
  if (input.illness === 'many' && features.waterRisk < 0.2 && features.vectorRisk < 0.2) {
    flags.push({
      code: 'ILLNESS_RISK_MISMATCH',
      message: 'High illness reports with low observable risk factors — consider alternative contamination source.',
      severity: 'error',
    });
  }

  // Confidence penalty per flag
const penaltyPerFlag = 0.1;
const baseConfidence = 1 - flags.length * penaltyPerFlag;

// Add sparsity penalty
const featureValues = Object.values(features);
const active = featureValues.filter(v => v > 0.05).length / featureValues.length;

const confidence = clamp(baseConfidence * active, 0.4, 1);

  log.model('Confidence:', confidence, 'Flags:', flags.length);

  return { confidence, flags };
}

// ── RISK MODEL ───────────────────────────────────────────────────────────────
function normalize(f: RawFeatures): NormalizedFeatures {
  return {
    water: (f.water ?? 0) / 100,
    exposure: (f.exposure ?? 0) / 100,
    vector: (f.vector ?? 0) / 100,
    sanitation: (f.sanitation ?? 0) / 100,
    health: (f.health ?? 0) / 100,
  };
}

export function computeRisk(features: FeatureSet, confidence: number) {
  const { waterRisk, vectorRisk, sanitation, exposure } = features;

  // All inputs assumed 0–1

  const riskRule = clamp(
  0.3 * waterRisk +
  0.3 * vectorRisk +
  0.2 * sanitation +
  0.2 * exposure,
  0, 1
);

const riskMl = clamp(
  sigmoid(
    2 * vectorRisk +
    1.5 * waterRisk +
    1.2 * sanitation
  ),
  0, 1
);

const rawScore = clamp(
  0.6 * riskRule + 0.4 * riskMl,
  0, 1
);

  // FINAL SCALE → convert to %
  const riskScore = clamp(rawScore * 100 * confidence, 0, 100);

  return {
    riskRule: riskRule * 100,
    riskMl: riskMl * 100,
    rawScore: rawScore * 100,
    riskScore,
  };
}

// ── CONTRIBUTING FACTORS ─────────────────────────────────────────────────────

function buildContributingFactors(
  features: FeatureSet,
  riskScore: number
): ContributingFactor[] {
  const weights: Record<keyof FeatureSet, number> = {
    waterRisk:    0.30,
    vectorRisk:   0.25,
    sanitation:   0.20,
    exposure:     0.15,
    healthSignal: 0.10,
  };

  const factors = (Object.keys(weights) as (keyof FeatureSet)[]).map((key) => {
    const value = clamp(features[key], 0, 1);

    return {
      name:   FACTOR_LABELS[key],
      value,
      weight: weights[key],
      impact: clamp(value * weights[key] * 100, 0, 100),
      color:  FACTOR_COLORS[key],
    };
  });

  return factors.sort((a, b) => b.impact - a.impact);
}

// ── OPTIMIZATION ENGINE ──────────────────────────────────────────────────────

export function getRecommendations(
  input: UserInput,
  features: FeatureSet,
  riskScore: number
): Recommendation[] {
  const recs: Recommendation[] = [];
  let rank = 1;

  // ── Immediate / Critical ──

  if (features.vectorRisk > 0.6) {
    recs.push({
      rank: rank++,
      action: 'Eliminate Stagnant Water Sources',
      description: 'Immediately drain all stagnant water pools, clear blocked drainage channels, and cover water storage containers. This is the most impactful single action to reduce vector-borne disease risk.',
      urgency: 'IMMEDIATE',
      impact: 'HIGH',
      factor: 'Vector Risk',
      icon: '🦟',
    });
  }

  if (features.waterRisk > 0.6) {
    recs.push({
      rank: rank++,
      action: 'Issue Drinking Water Advisory',
      description: 'Immediately advise the community to boil water before consumption or distribute safe bottled water. Contaminated water sources should be closed and marked with hazard signage.',
      urgency: 'IMMEDIATE',
      impact: 'HIGH',
      factor: 'Water Risk',
      icon: '🚰',
    });
  }

  if (riskScore > 0.55 && input.vulnerable) {
    recs.push({
      rank: rank++,
      action: 'Evacuate or Shield Vulnerable Populations',
      description: 'Prioritize protection of children under 5, elderly, pregnant women, and immunocompromised individuals. Consider temporary relocation from highest-risk zones.',
      urgency: 'IMMEDIATE',
      impact: 'HIGH',
      factor: 'Exposure',
      icon: '🏥',
    });
  }

  if (input.illness === 'many') {
    recs.push({
      rank: rank++,
      action: 'Activate Disease Surveillance Protocol',
      description: 'Report cluster of cases to district health authorities. Collect samples for laboratory confirmation. Begin contact tracing and case isolation procedures.',
      urgency: 'IMMEDIATE',
      impact: 'HIGH',
      factor: 'Health Signal',
      icon: '🔬',
    });
  }

  // ── Short-Term ──

  if (features.sanitation > 0.4) {
    recs.push({
      rank: rank++,
      action: 'Improve Drainage Infrastructure',
      description: 'Clear all blocked drains and channels. Coordinate with municipal authorities to repair overflowing drainage systems. Establish regular maintenance schedule.',
      urgency: 'SHORT_TERM',
      impact: 'HIGH',
      factor: 'Sanitation',
      icon: '🔧',
    });
  }

  if (input.garbage === 'high' || input.garbage === 'medium') {
    recs.push({
      rank: rank++,
      action: 'Organize Community Sanitation Drive',
      description: 'Mobilize community volunteers for waste collection. Establish designated garbage collection points. Coordinate with local waste management authorities for timely disposal.',
      urgency: 'SHORT_TERM',
      impact: 'MEDIUM',
      factor: 'Sanitation',
      icon: '♻️',
    });
  }

  if (features.vectorRisk > 0.3) {
    recs.push({
      rank: rank++,
      action: 'Deploy Vector Control Measures',
      description: 'Apply larvicides to water bodies that cannot be drained. Schedule adult mosquito fogging in high-density areas. Distribute insecticide-treated nets to vulnerable households.',
      urgency: 'SHORT_TERM',
      impact: 'HIGH',
      factor: 'Vector Risk',
      icon: '🛡️',
    });
  }

  if (input.usage === 'drinking' && features.waterRisk > 0.3) {
    recs.push({
      rank: rank++,
      action: 'Install Point-of-Use Water Treatment',
      description: 'Distribute water purification tablets, portable filters, or solar disinfection kits to affected households. Train community members on correct usage procedures.',
      urgency: 'SHORT_TERM',
      impact: 'HIGH',
      factor: 'Water Risk',
      icon: '💧',
    });
  }

  // ── Long-Term ──

  recs.push({
    rank: rank++,
    action: 'Establish Community Health Monitoring Network',
    description: 'Train community health workers to conduct weekly environmental assessments using this platform. Create a rapid reporting chain from field observers to district health officers.',
    urgency: 'LONG_TERM',
    impact: 'HIGH',
    factor: 'Health Signal',
    icon: '📡',
  });

  if (features.sanitation > 0.3) {
    recs.push({
      rank: rank++,
      action: 'Develop Long-Term WASH Infrastructure',
      description: 'Engage with NGOs and government programs to fund improved Water, Sanitation, and Hygiene (WASH) facilities. Prioritize community-led total sanitation (CLTS) programs.',
      urgency: 'LONG_TERM',
      impact: 'HIGH',
      factor: 'Sanitation',
      icon: '🏗️',
    });
  }

  recs.push({
    rank: rank++,
    action: 'Community Health Education Campaign',
    description: 'Conduct regular workshops on waterborne disease prevention, vector control, and environmental hygiene. Distribute multilingual educational materials. Engage schools and local leaders.',
    urgency: 'LONG_TERM',
    impact: 'MEDIUM',
    factor: 'Exposure',
    icon: '📚',
  });

  return recs;
}

// ── SIMULATION ENGINE ────────────────────────────────────────────────────────

export function simulateRisk(
  baseFeatures: FeatureSet,
  overrides: SimulationOverrides
): {
  features: FeatureSet;
  riskRule: number;
  riskMl: number;
  rawScore: number;
  riskScore: number;
  category: ReturnType<typeof getRiskCategory>;
} {
  // Merge overrides into base features
  const features: FeatureSet = {
    ...baseFeatures,
    ...Object.fromEntries(
      Object.entries(overrides).filter(([, v]) => v !== undefined)
    ),
  };

  // Apply risk model with full confidence (simulation doesn't re-validate)
  const { riskRule, riskMl, rawScore, riskScore } = computeRisk(features, 0.9);
  const category = getRiskCategory(riskScore/100);

  log.model('Simulation result:', { features, riskScore, category });

  return { features, riskRule, riskMl, rawScore, riskScore, category };
}

// ── FULL PIPELINE ────────────────────────────────────────────────────────────

export function runRiskPipeline(input: UserInput): RiskOutput {
  // Step 1: Feature engineering
  const features = computeFeatures(input);

  // Step 2: Validation + confidence
  const { confidence, flags } = computeConfidence(input, features);

  // Step 3: Risk computation
  const { riskRule, riskMl, rawScore, riskScore } = computeRisk(features, confidence);

  // Step 4: Category
  const category = getRiskCategory(riskScore/100);

  // Step 5: Contributing factors
  const contributingFactors = buildContributingFactors(features, riskScore);

  // Step 6: Recommendations
  const recommendations = getRecommendations(input, features, riskScore);

  const output: RiskOutput = {
    input,
    features,
    riskRule,
    riskMl,
    rawScore,
    confidence,
    flags,
    riskScore,
    category,
    contributingFactors,
    recommendations,
    timestamp: Date.now(),
  };

  log.info('Pipeline complete:', { riskScore, category, confidence });

  return output;
}