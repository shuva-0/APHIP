// ─────────────────────────────────────────────
// APHIP — Risk Gauge
// Animated radial SVG gauge
// ─────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { gaugeVariants } from '@/animations/motionVariants';
import { SectionHeader } from '@/components/ui';
import { fmtScore, describeArc } from '@/utils';
import { GAUGE_CONFIG } from '@/config';

const { cx, cy, r, startAngle, endAngle, strokeWidth } = GAUGE_CONFIG;

// Total arc sweep in degrees
const SWEEP = endAngle - startAngle; // 260°

// Tick marks
const TICKS = [0, 0.2, 0.35, 0.55, 0.75, 1.0];
const TICK_LABELS = ['0', '20', '35', '55', '75', '100'];

function toAngle(score: number): number {
  return startAngle + score * SWEEP;
}

const RiskGauge: React.FC = () => {
  const { output, display } = useRisk();

  if (!output || !display) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full w-full">
        <SectionHeader title="Risk Assessment" />
        <div className="font-mono text-[10px] text-[#334155] tracking-widest uppercase">
          Awaiting Input
        </div>
      </div>
    );
  }

  const score         = output.riskScore;
  const scoreInt      = fmtScore(score);
  const riskColor     = display.riskColor;
  const categoryLabel = display.categoryLabel;
  const arcSweep      = score * SWEEP;
  const needleAngle   = toAngle(score);

  // Arc lengths
  const circumference = 2 * Math.PI * r;
  const arcLen        = (SWEEP / 360) * circumference;

  // Background arc path
  const bgArc  = describeArc(cx, cy, r, startAngle, endAngle);
  const fgArc  = describeArc(cx, cy, r, startAngle, startAngle + arcSweep);

  // Needle
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const needleLen = r - 12;
  const nxTip = cx + needleLen * Math.cos(toRad(needleAngle));
  const nyTip = cy + needleLen * Math.sin(toRad(needleAngle));
  const nxBase1 = cx + 8 * Math.cos(toRad(needleAngle + 90));
  const nyBase1 = cy + 8 * Math.sin(toRad(needleAngle + 90));
  const nxBase2 = cx + 8 * Math.cos(toRad(needleAngle - 90));
  const nyBase2 = cy + 8 * Math.sin(toRad(needleAngle - 90));

  return (
    <motion.div
      variants={gaugeVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center gap-3 w-full"
    >
      <SectionHeader title="Risk Assessment" subtitle="Composite environmental score" />

      <div className="relative" style={{ width: cx * 2, height: cy * 2 }}>
        <svg
          width={cx * 2}
          height={cy * 2}
          viewBox={`0 0 ${cx * 2} ${cy * 2}`}
          className="overflow-visible"
        >
          <defs>
            <filter id="glow-gauge">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="needle-shadow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={riskColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outer ring */}
          <circle
            cx={cx} cy={cy} r={r + strokeWidth / 2 + 4}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={1}
          />

          {/* Background arc */}
          <path
            d={bgArc}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored foreground arc */}
          <motion.path
            d={fgArc}
            fill="none"
            stroke={riskColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glow-gauge)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Tick marks */}
          {TICKS.map((t, i) => {
            const angle = toAngle(t);
            const rad   = toRad(angle);
            const ro    = r + strokeWidth / 2 + 8;
            const ri    = r + strokeWidth / 2 + 14;
            const x1 = cx + ro * Math.cos(rad);
            const y1 = cy + ro * Math.sin(rad);
            const x2 = cx + ri * Math.cos(rad);
            const y2 = cy + ri * Math.sin(rad);
            const lx = cx + (ri + 10) * Math.cos(rad);
            const ly = cy + (ri + 10) * Math.sin(rad);
            return (
              <g key={t}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeLinecap="round" />
                <text
                  x={lx} y={ly}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#334155"
                  fontSize={8}
                  fontFamily="IBM Plex Mono"
                >
                  {TICK_LABELS[i]}
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <motion.g
            initial={{ rotate: startAngle, originX: `${cx}px`, originY: `${cy}px` }}
            animate={{ rotate: needleAngle, originX: `${cx}px`, originY: `${cy}px` }}
            transition={{ type: 'spring', stiffness: 180, damping: 20, duration: 1 }}
          >
            <polygon
              points={`${nxTip},${nyTip} ${nxBase1},${nyBase1} ${nxBase2},${nyBase2}`}
              fill={riskColor}
              filter="url(#needle-shadow)"
              opacity={0.9}
            />
          </motion.g>

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={10} fill="#0b1228" stroke={riskColor} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={5} fill={riskColor} />

          {/* Score text */}
          <text
            x={cx} y={cy + 36}
            textAnchor="middle"
            fill={riskColor}
            fontSize={42}
            fontFamily="Space Grotesk, sans-serif"
            fontWeight={900}
          >
            {scoreInt}
          </text>

          <text
            x={cx} y={cy + 54}
            textAnchor="middle"
            fill="#64748b"
            fontSize={9}
            fontFamily="IBM Plex Mono"
            letterSpacing={2}
          >
            / 100
          </text>
        </svg>
      </div>

      {/* Category badge */}
      <motion.div
        key={output.category}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-1"
      >
        <div
          className="px-4 py-1.5 rounded-full font-mono text-[10px] tracking-[2px] uppercase font-bold"
          style={{
            color:      riskColor,
            background: `${riskColor}15`,
            border:     `1px solid ${riskColor}35`,
            boxShadow:  `0 0 14px ${riskColor}25`,
          }}
        >
          {categoryLabel}
        </div>
        <span className="font-body text-[10.5px] text-[#334155]">
          {output.flags.length > 0
            ? `${output.flags.length} flag${output.flags.length > 1 ? 's' : ''} detected`
            : 'All inputs validated'}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default RiskGauge;