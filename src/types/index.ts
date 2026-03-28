// ─────────────────────────────────────────────
// APHIP — Core Types
// ─────────────────────────────────────────────

export type UserInput = {
  clarity: 'clear' | 'mild' | 'muddy';
  color: 'none' | 'yellow' | 'green' | 'brown';
  odor: 'none' | 'mild' | 'strong';

  stagnation: boolean;
  mosquito: 'none' | 'few' | 'many';
  garbage: 'low' | 'medium' | 'high';
  drainage: 'good' | 'blocked' | 'overflow';

  rainfall: 'none' | 'light' | 'heavy';
  duration: '<1' | '1-3' | '>3';
  trend: 'improving' | 'same' | 'worsening';

  usage: 'drinking' | 'washing' | 'none';
  population: 'low' | 'medium' | 'high';
  vulnerable: boolean;

  illness: 'none' | 'few' | 'many';
  illnessType: 'fever' | 'diarrhea' | 'unknown';
};

export type RiskCategory = 'MINIMAL' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type FeatureSet = {
  waterRisk: number;
  vectorRisk: number;
  sanitation: number;
  exposure: number;
  healthSignal: number;
};

export type ValidationFlag = {
  code: string;
  message: string;
  severity: 'warning' | 'error';
};

export type ContributingFactor = {
  name: string;
  value: number;
  weight: number;
  impact: number;
  color: string;
};

export type Recommendation = {
  rank: number;
  action: string;
  description: string;
  urgency: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  factor: string;
  icon: string;
};

export type RiskOutput = {
  // Raw inputs
  input: UserInput;
  // Derived features
  features: FeatureSet;
  // Model scores
  riskRule: number;
  riskMl: number;
  rawScore: number;
  // Confidence
  confidence: number;
  flags: ValidationFlag[];
  // Final output
  riskScore: number;
  category: RiskCategory;
  // Breakdown
  contributingFactors: ContributingFactor[];
  recommendations: Recommendation[];
  // Timestamp
  timestamp: number;
};

export type SimulationOverrides = Partial<FeatureSet>;

export type TrendPoint = {
  time: string;
  riskScore: number;
  waterRisk: number;
  vectorRisk: number;
  sanitation: number;
  exposure: number;
  category: RiskCategory;
};

export type ChartPoint = TrendPoint & {
  riskPct: number;
  waterPct: number;
  vectorPct: number;
  sanitPct: number;
  exposurePct: number;
};

export type ActiveTab = 'dashboard' | 'simulation' | 'actions' | 'history';

export type DisplayState = {
  riskColor: string;
  categoryColor: string;
  categoryBg: string;
  categoryGlow: string;
  categoryLabel: string;
};

export type FeatureDisplay = {
  key: keyof FeatureSet;
  label: string;
  value: number;
  color: string;
};