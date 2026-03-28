// ─────────────────────────────────────────────
// APHIP — Simulation Panel (What-If Analysis)
// ─────────────────────────────────────────────

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { cardVariants, listVariants, listItemVariants } from '@/animations/motionVariants';
import { Slider, SectionHeader, Button, Badge } from '@/components/ui';
import { FACTOR_COLORS, FACTOR_LABELS } from '@/constants';
import { fmtScore, getRiskColor } from '@/utils';
import type { SimulationOverrides, FeatureSet } from '@/types';

const FACTOR_KEYS: (keyof SimulationOverrides)[] = [
  'waterRisk',
  'vectorRisk',
  'sanitation',
  'exposure',
  'healthSignal',
];

const FACTOR_DESC: Record<string, string> = {
  waterRisk:    'Contamination level of water source',
  vectorRisk:   'Mosquito density + stagnation pressure',
  sanitation:   'Garbage accumulation + drainage quality',
  exposure:     'Population density + water usage pattern',
  healthSignal: 'Reported illness + environmental trend',
};

const SimulationPanel: React.FC = () => {
  const {
    output,
    baseOutput,
    simOutput,
    overrides,
    isSimMode,
    setSimOverride,
    resetSimulation,
    toggleSimMode,
  } = useRisk();

  const baseFeatures = baseOutput?.features;

  const sliderValues = useMemo(() => {
    return {
      waterRisk:    overrides.waterRisk    ?? baseFeatures?.waterRisk    ?? 0,
      vectorRisk:   overrides.vectorRisk   ?? baseFeatures?.vectorRisk   ?? 0,
      sanitation:   overrides.sanitation   ?? baseFeatures?.sanitation   ?? 0,
      exposure:     overrides.exposure     ?? baseFeatures?.exposure     ?? 0,
      healthSignal: overrides.healthSignal ?? baseFeatures?.healthSignal ?? 0,
    } as Required<SimulationOverrides>;
  }, [overrides, baseFeatures]);

const handleSlider = (key: keyof SimulationOverrides) => (val: number) => {
  setSimOverride({ [key]: Math.max(0, Math.min(1, val)) });
};

  const activeOut = isSimMode && simOutput ? simOutput : output;
  const delta =
    isSimMode && simOutput && baseOutput
      ? fmtScore(simOutput.riskScore) - fmtScore(baseOutput.riskScore)
      : null;

  const hasOverrides = Object.keys(overrides).length > 0;

  // Determine badge variant from category
  function badgeVariant(cat: string): 'red' | 'amber' | 'green' {
    if (cat === 'CRITICAL' || cat === 'HIGH') return 'red';
    if (cat === 'MODERATE') return 'amber';
    return 'green';
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-[14px] flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-5 pb-3 flex items-start justify-between gap-3">
        <SectionHeader
          title="What-If Simulation"
          subtitle="Override feature values to explore scenarios"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasOverrides && (
            <Button variant="ghost" size="sm" onClick={resetSimulation}>
              Reset
            </Button>
          )}
          <Button
            variant={isSimMode ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleSimMode}
          >
            {isSimMode ? '● Live' : '○ Sim Off'}
          </Button>
        </div>
      </div>

      {/* Sim result header */}
      <AnimatePresence>
        {isSimMode && activeOut && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-3 rounded-[10px] p-3 flex items-center gap-4"
            style={{
              background: `${getRiskColor(activeOut.riskScore)}0d`,
              border: `1px solid ${getRiskColor(activeOut.riskScore)}25`,
            }}
          >
            <div>
              <div className="font-mono text-[8.5px] uppercase tracking-[1.5px] text-[#475569]">
                Sim Score
              </div>
              <div
                className="font-display font-black text-[26px] leading-none"
                style={{
                  color: getRiskColor(activeOut.riskScore),
                  textShadow: `0 0 16px ${getRiskColor(activeOut.riskScore)}50`,
                }}
              >
                {fmtScore(activeOut.riskScore)}
              </div>
            </div>

            {delta !== null && (
              <div className="flex flex-col items-start">
                <div className="font-mono text-[8.5px] uppercase tracking-[1.5px] text-[#475569]">
                  Delta
                </div>
                <div
                  className="font-display font-bold text-[18px] leading-none"
                  style={{
                    color:
                      delta > 0 ? '#f87171' : delta < 0 ? '#34d399' : '#64748b',
                  }}
                >
                  {delta > 0 ? '+' : ''}
                  {delta}
                </div>
              </div>
            )}

            <div className="ml-auto">
              <Badge variant={badgeVariant(activeOut.category)}>
                {activeOut.category}
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="divider" />

      {/* Sliders */}
      <div className="scroll-panel flex-1 px-5 py-4">
        <motion.div
          variants={listVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col"
        >
          {FACTOR_KEYS.map((key) => {
            const color   = FACTOR_COLORS[key as keyof FeatureSet] ?? '#38bdf8';
            const label   = FACTOR_LABELS[key as keyof FeatureSet] ?? key;
            const val     = sliderValues[key] ?? 0;
            const baseVal = baseFeatures
              ? (baseFeatures as Record<string, number>)[key as string] ?? 0
              : 0;
            const changed = Math.abs(val - baseVal) > 0.01;

            return (
              <motion.div
                key={key}
                variants={listItemVariants}
                className="py-3.5 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="font-mono text-[10px] tracking-wide text-[#94a3b8]">
                      {label}
                    </span>
                    {changed && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[7.5px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        OVERRIDDEN
                      </motion.span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    {changed && (
                      <span className="font-mono text-[8.5px] text-[#334155]">
                        base {Math.round(baseVal * 100)}
                      </span>
                    )}
                    <span
                      className="font-mono text-[12px] font-semibold w-9 text-right"
                      style={{ color }}
                    >
                      {Math.round(val * 100)}
                    </span>
                  </div>
                </div>

                <Slider
                  value={val}
                  onChange={handleSlider(key)}
                  color={color}
                  showValue={false}
                />

                <p className="font-body text-[10.5px] text-[#334155] mt-1.5 leading-relaxed">
                  {FACTOR_DESC[key as string]}
                </p>

                {/* Delta bar vs baseline */}
                {changed && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-[7.5px] text-[#334155] uppercase tracking-widest">
                      Δ change
                    </span>
                    <div className="flex-1 relative h-[3px] rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
                      <motion.div
                        className="absolute inset-y-0 rounded-full"
                        style={{
                          background: val > baseVal ? '#f87171' : '#34d399',
                          left: val > baseVal
                            ? `${baseVal * 100}%`
                            : `${val * 100}%`,
                          width: `${Math.abs(val - baseVal) * 100}%`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.abs(val - baseVal) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span
                      className="font-mono text-[8.5px]"
                      style={{ color: val > baseVal ? '#f87171' : '#34d399' }}
                    >
                      {val > baseVal ? '+' : ''}
                      {Math.round((val - baseVal) * 100)}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Instructions */}
        {!hasOverrides && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-[8px] p-3 flex items-start gap-2"
            style={{
              background: 'rgba(56,189,248,0.04)',
              border: '1px solid rgba(56,189,248,0.1)',
            }}
          >
            <span className="text-[#38bdf8] text-[12px] flex-shrink-0">💡</span>
            <span className="font-body text-[11px] text-[#475569] leading-relaxed">
              Move any slider to instantly simulate how changes affect the risk score. Toggle
              simulation mode to compare against the baseline.
            </span>
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    </motion.div>
  );
};

export default SimulationPanel;