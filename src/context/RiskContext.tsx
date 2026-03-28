// ─────────────────────────────────────────────
// APHIP — Risk Context
// Central state management for the entire app
// ─────────────────────────────────────────────

import React, {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type {
  UserInput,
  RiskOutput,
  SimulationOverrides,
  TrendPoint,
  ChartPoint,
  ActiveTab,
  DisplayState,
  FeatureDisplay,
  FeatureSet,
} from '@/types';
import { riskService } from '@/services/riskService';
import { simulateRisk } from '@/models/riskEngine';
import {
  getCategoryColor,
  getCategoryBg,
  getCategoryGlow,
  getCategoryLabel,
  getRiskColor,
  adaptChartData,
  generateTimeLabel,
} from '@/utils';
import { FACTOR_COLORS, FACTOR_LABELS, CHART_HISTORY_MAX } from '@/constants';
import { scenarios } from '@/data/scenarios';

// ── Default Input ────────────────────────────

const DEFAULT_INPUT: UserInput = {
  clarity: 'clear',
  color: 'none',
  odor: 'none',
  stagnation: false,
  mosquito: 'none',
  garbage: 'low',
  drainage: 'good',
  rainfall: 'none',
  duration: '<1',
  trend: 'same',
  usage: 'washing',
  population: 'low',
  vulnerable: false,
  illness: 'none',
  illnessType: 'unknown',
};

// ── State Shape ──────────────────────────────

interface RiskState {
  input: UserInput;
  output: RiskOutput | null;
  trendHistory: TrendPoint[];
  overrides: SimulationOverrides;
  isSimMode: boolean;
  activeTab: ActiveTab;
}

// ── Actions ──────────────────────────────────

type Action =
  | { type: 'SET_INPUT'; payload: Partial<UserInput> }
  | { type: 'SET_OUTPUT'; payload: RiskOutput }
  | { type: 'PUSH_TREND'; payload: TrendPoint }
  | { type: 'SET_OVERRIDE'; payload: SimulationOverrides }
  | { type: 'RESET_SIM' }
  | { type: 'TOGGLE_SIM_MODE' }
  | { type: 'SET_TAB'; payload: ActiveTab }
  | { type: 'LOAD_SCENARIO'; payload: UserInput };

function reducer(state: RiskState, action: Action): RiskState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: { ...state.input, ...action.payload } };

    case 'SET_OUTPUT':
      return { ...state, output: action.payload };

    case 'PUSH_TREND': {
      const next = [...state.trendHistory, action.payload];
      return {
        ...state,
        trendHistory: next.length > CHART_HISTORY_MAX
          ? next.slice(next.length - CHART_HISTORY_MAX)
          : next,
      };
    }

    case 'SET_OVERRIDE':
      return { ...state, overrides: { ...state.overrides, ...action.payload } };

    case 'RESET_SIM':
      return { ...state, overrides: {}, isSimMode: false };

    case 'TOGGLE_SIM_MODE':
      return { ...state, isSimMode: !state.isSimMode };

    case 'SET_TAB':
      return { ...state, activeTab: action.payload };

    case 'LOAD_SCENARIO':
      return { ...state, input: action.payload, overrides: {}, isSimMode: false };

    default:
      return state;
  }
}

// ── Initial State ────────────────────────────

function buildInitial(): RiskState {
  const initial = riskService.assess(DEFAULT_INPUT);
  return {
    input: DEFAULT_INPUT,
    output: initial,
    trendHistory: [],
    overrides: {},
    isSimMode: false,
    activeTab: 'dashboard',
  };
}

// ── Context Shape ────────────────────────────

export interface RiskContextValue {
  // State
  input: UserInput;
  output: RiskOutput | null;
  baseOutput: RiskOutput | null;
  simOutput: ReturnType<typeof simulateRisk> | null;
  trendHistory: TrendPoint[];
  overrides: SimulationOverrides;
  isSimMode: boolean;
  activeTab: ActiveTab;
  // Derived
  display: DisplayState | null;
  chartData: ChartPoint[];
  featureDisplay: FeatureDisplay[];
  // Actions
  updateInput: (partial: Partial<UserInput>) => void;
  setSimOverride: (partial: SimulationOverrides) => void;
  resetSimulation: () => void;
  toggleSimMode: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  loadScenario: (id: string) => void;
}

export const RiskContext = createContext<RiskContextValue | null>(null);

// ── Provider ─────────────────────────────────

export const RiskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  // Track last input to detect changes
  const lastInputRef = useRef<UserInput>(state.input);

  // ── Update Input ──────────────────────────

  const updateInput = useCallback((partial: Partial<UserInput>) => {
    dispatch({ type: 'SET_INPUT', payload: partial });
    const newInput = { ...lastInputRef.current, ...partial };
    lastInputRef.current = newInput;

    const result = riskService.assess(newInput);
    dispatch({ type: 'SET_OUTPUT', payload: result });

    // Push to trend history
    const prev = state.trendHistory[state.trendHistory.length - 1];

const decay = 0.85;

const persistentRisk = prev
  ? decay * prev.riskScore + (1 - decay) * result.riskScore
  : result.riskScore;
  
    dispatch({
      type: 'PUSH_TREND',
      payload: {
        time: generateTimeLabel(),
        riskScore: Math.min(100, persistentRisk),
        waterRisk:  result.features.waterRisk,
        vectorRisk: result.features.vectorRisk,
        sanitation: result.features.sanitation,
        exposure:   result.features.exposure,
        category:   result.category,
      },
    });
  }, []);

  // ── Load Scenario ─────────────────────────

  const loadScenario = useCallback((id: string) => {
    const scenario = scenarios[id];
    if (!scenario) return;

    dispatch({ type: 'LOAD_SCENARIO', payload: scenario.input });
    lastInputRef.current = scenario.input;

    const result = riskService.assess(scenario.input);
    dispatch({ type: 'SET_OUTPUT', payload: result });

    dispatch({
      type: 'PUSH_TREND',
      payload: {
        time: generateTimeLabel(),
        riskScore:  result.riskScore,
        waterRisk:  result.features.waterRisk,
        vectorRisk: result.features.vectorRisk,
        sanitation: result.features.sanitation,
        exposure:   result.features.exposure,
        category:   result.category,
      },
    });
  }, []);

  // ── Simulation Actions ────────────────────

  const setSimOverride = useCallback((partial: SimulationOverrides) => {
    dispatch({ type: 'SET_OVERRIDE', payload: partial });
  }, []);

  const resetSimulation = useCallback(() => {
    dispatch({ type: 'RESET_SIM' });
  }, []);

  const toggleSimMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIM_MODE' });
  }, []);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    dispatch({ type: 'SET_TAB', payload: tab });
  }, []);

  // ── Derived Values ────────────────────────

  const display = useMemo((): DisplayState | null => {
    if (!state.output) return null;
    const { category, riskScore } = state.output;
    return {
      riskColor:     getRiskColor(riskScore),
      categoryColor: getCategoryColor(category),
      categoryBg:    getCategoryBg(category),
      categoryGlow:  getCategoryGlow(category),
      categoryLabel: getCategoryLabel(category),
    };
  }, [state.output]);

  const chartData = useMemo((): ChartPoint[] => {
    return adaptChartData(state.trendHistory) as ChartPoint[];
  }, [state.trendHistory]);

  const featureDisplay = useMemo((): FeatureDisplay[] => {
    if (!state.output) return [];
    return (Object.keys(state.output.features) as (keyof FeatureSet)[]).map((key) => ({
      key,
      label: FACTOR_LABELS[key],
      value: state.output!.features[key],
      color: FACTOR_COLORS[key],
    }));
  }, [state.output]);

  // ── Simulation Output ─────────────────────

const simOutput = useMemo(() => {
  if (!state.output || Object.keys(state.overrides).length === 0) return null;

  return simulateRisk(
    { ...state.output.features }, // ensure immutability
    state.overrides
  );
}, [state.output, state.overrides]);
  // ── Context Value ─────────────────────────

  const value: RiskContextValue = {
    input:       state.input,
    output:      state.output,
    baseOutput:  state.output,
    simOutput,
    trendHistory: state.trendHistory,
    overrides:   state.overrides,
    isSimMode:   state.isSimMode,
    activeTab:   state.activeTab,
    display,
    chartData,
    featureDisplay,
    updateInput,
    setSimOverride,
    resetSimulation,
    toggleSimMode,
    setActiveTab,
    loadScenario,
  };

  return <RiskContext.Provider value={value}>{children}</RiskContext.Provider>;
};