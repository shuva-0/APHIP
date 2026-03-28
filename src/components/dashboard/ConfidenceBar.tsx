// ─────────────────────────────────────────────
// APHIP — Confidence Bar
// ─────────────────────────────────────────────

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { cardVariants, listVariants, listItemVariants } from '@/animations/motionVariants';
import { SectionHeader } from '@/components/ui';
import { fmtScore } from '@/utils';

const ConfidenceBar: React.FC = () => {
  const { output, display } = useRisk();

  if (!output || !display) {
    return (
      <motion.div variants={cardVariants} className="glass rounded-[14px] p-5 h-full">
        <SectionHeader title="Model Confidence" />
        <div className="flex items-center justify-center h-24 text-[#334155] font-mono text-[10px]">
          AWAITING INPUT
        </div>
      </motion.div>
    );
  }

  const confidence    = output.confidence;
  const confPct       = Math.round(confidence * 100);
  const ruleScore     = Math.round(output.riskRule * 100);
  const mlScore       = Math.round(output.riskMl * 100);
  const finalScore    = fmtScore(output.rawScore);
  const adjustedScore = fmtScore(output.riskScore);

  const confColor =
    confidence >= 0.85 ? '#10b981'
    : confidence >= 0.7 ? '#f59e0b'
    : '#ef4444';

  const bars: Array<{ label: string; pct: number; color: string; desc: string }> = [
    { label: 'Rule Model',  pct: ruleScore,     color: '#38bdf8',            desc: '60% weight'     },
    { label: 'ML Model',    pct: mlScore,        color: '#8b5cf6',            desc: '40% weight'     },
    { label: 'Blended Raw', pct: finalScore,     color: '#f59e0b',            desc: 'Pre-adjustment' },
    { label: 'Adjusted',    pct: adjustedScore,  color: display.riskColor,   desc: '× confidence'   },
  ];

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-[14px] p-5 flex flex-col gap-4 h-full"
    >
      <SectionHeader title="Model Confidence & Decomposition" />

      {/* Confidence meter */}
      <div
        className="flex items-center gap-4 p-3 rounded-[10px]"
        style={{ background: `${confColor}0d`, border: `1px solid ${confColor}25` }}
      >
        {/* Circular confidence */}
        <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
          <svg width={52} height={52} viewBox="0 0 52 52">
            <defs>
              <filter id="conf-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx={26} cy={26} r={21} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
            <motion.circle
              cx={26}
              cy={26}
              r={21}
              fill="none"
              stroke={confColor}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 21}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 21 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 21 * (1 - confidence) }}
              transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
              transform="rotate(-90 26 26)"
              filter="url(#conf-glow)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-[13px]" style={{ color: confColor }}>
              {confPct}%
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-[9px] tracking-[1.5px] uppercase"
              style={{ color: confColor }}
            >
              {confidence >= 0.85
                ? 'HIGH CONFIDENCE'
                : confidence >= 0.7
                ? 'MEDIUM CONFIDENCE'
                : 'LOW CONFIDENCE'}
            </span>
          </div>
          <div className="font-body text-[11px] text-[#475569]">
            {output.flags.length === 0
              ? 'All inputs are internally consistent.'
              : `${output.flags.length} inconsistenc${output.flags.length > 1 ? 'ies' : 'y'} detected — confidence reduced.`}
          </div>
        </div>
      </div>

      {/* Score decomposition bars */}
      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-2.5"
      >
        {bars.map(({ label, pct, color, desc }) => (
          <motion.div key={label} variants={listItemVariants} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] tracking-wide text-[#475569]">{label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8px] text-[#334155]">{desc}</span>
                <span className="font-mono text-[10px] font-medium" style={{ color }}>
                  {pct}
                </span>
              </div>
            </div>
            <div className="relative h-[5px] rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${color}99, ${color})`,
                  boxShadow: `0 0 6px ${color}60`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Flags */}
      <AnimatePresence>
        {output.flags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1.5 overflow-hidden"
          >
            <span className="font-mono text-[8.5px] tracking-[1.5px] uppercase text-[#ef4444] opacity-80">
              Validation Flags
            </span>
            {output.flags.map((flag, i) => (
              <motion.div
                key={`${flag.code}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2 rounded-[6px] p-2"
                style={{
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.15)',
                }}
              >
                <span className="text-[#ef4444] text-[10px] mt-[1px] flex-shrink-0">⚠</span>
                <span className="font-body text-[11px] text-[#94a3b8] leading-snug">
                  {flag.message}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConfidenceBar;