// ─────────────────────────────────────────────
// APHIP — Factor Breakdown
// ─────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { cardVariants, listVariants, listItemVariants } from '@/animations/motionVariants';
import { SectionHeader } from '@/components/ui';

const FactorBreakdown: React.FC = () => {
  const { output, display } = useRisk();

  if (!output) return null;

  const factors   = output.contributingFactors;
  const maxImpact = Math.max(...factors.map((f) => f.impact), 0.01);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-[14px] p-5 flex flex-col gap-4 h-full"
    >
      <SectionHeader title="Factor Breakdown" subtitle="Weighted impact on final score" />

      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-1"
      >
        {factors.map((factor, i) => (
          <motion.div
            key={factor.name}
            variants={listItemVariants}
            className="group relative rounded-[8px] p-2.5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid transparent',
            }}
            whileHover={{
              background: 'rgba(255,255,255,0.035)',
              borderColor: `${factor.color}20`,
              transition: { duration: 0.15 },
            }}
          >
            {/* Rank badge + name + value */}
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[8px] font-bold"
                style={{
                  background: `${factor.color}18`,
                  border: `1px solid ${factor.color}35`,
                  color: factor.color,
                }}
              >
                {i + 1}
              </div>
              <span className="font-mono text-[10px] tracking-wide text-[#94a3b8] flex-1">
                {factor.name}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[8.5px] text-[#334155]">
                  ×{(factor.weight * 100).toFixed(0)}%
                </span>
                <span
                  className="font-mono text-[11px] font-semibold w-8 text-right"
                  style={{ color: factor.color }}
                >
                  {Math.round(factor.value * 100)}
                </span>
              </div>
            </div>

            {/* Value bar + impact bar */}
            <div className="ml-7 flex flex-col gap-1">
              <div className="relative h-[5px] rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${factor.color}80, ${factor.color})`,
                    boxShadow: `0 0 6px ${factor.color}50`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value * 100}%` }}
                  transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1], delay: i * 0.06 }}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[7.5px] text-[#334155] tracking-widest uppercase w-10 flex-shrink-0">
                  Impact
                </span>
                <div className="flex-1 relative h-[3px] rounded-full overflow-hidden bg-[rgba(255,255,255,0.03)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full opacity-60"
                    style={{ background: factor.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(factor.impact / maxImpact) * 100}%` }}
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: i * 0.06 + 0.15 }}
                  />
                </div>
                <span className="font-mono text-[8px] text-[#475569] w-8 text-right">
                  {(factor.impact * 100).toFixed(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Divider + total */}
      <div className="border-t border-[rgba(56,189,248,0.08)] pt-3 mt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#334155]">
            Adjusted Total
          </span>
          <motion.span
            key={output.riskScore}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-[18px]"
            style={{
              color: display?.riskColor ?? '#38bdf8',
              textShadow: `0 0 16px ${display?.riskColor ?? '#38bdf8'}40`,
            }}
          >
            {Math.round(output.riskScore * 100)}
          </motion.span>
        </div>

        {/* Mini stacked bar */}
        <div className="flex h-2 rounded-full overflow-hidden mt-2 gap-0.5">
          {factors.map((f) => (
            <motion.div
              key={f.name}
              className="h-full rounded-full"
              style={{ background: f.color }}
              initial={{ flex: 0 }}
              animate={{ flex: f.impact }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              title={`${f.name}: ${(f.impact * 100).toFixed(1)}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {factors.map((f) => (
            <div key={f.name} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
              <span className="font-mono text-[7.5px] text-[#334155]">
                {f.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FactorBreakdown;