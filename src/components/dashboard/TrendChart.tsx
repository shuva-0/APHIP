// ─────────────────────────────────────────────
// APHIP — Trend Chart (Recharts)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { useRisk } from '@/hooks/useRisk';
import { chartVariants } from '@/animations/motionVariants';
import { SectionHeader } from '@/components/ui';
import { CHART_CONFIG } from '@/config';

// ── Custom Tooltip ────────────────────────────

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] p-3 shadow-xl flex flex-col gap-1.5"
      style={{
        background: 'rgba(11,18,42,0.95)',
        border: '1px solid rgba(56,189,248,0.2)',
        backdropFilter: 'blur(16px)',
        minWidth: 140,
      }}
    >
      <span className="font-mono text-[8.5px] tracking-[1.5px] uppercase text-[#475569] border-b border-[rgba(255,255,255,0.06)] pb-1.5 mb-0.5">
        {label}
      </span>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="font-mono text-[9px] text-[#64748b]">{entry.name}</span>
          </div>
          <span className="font-mono text-[10px] font-medium" style={{ color: entry.color }}>
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Chart ─────────────────────────────────────

type ChartView = 'overview' | 'factors';

const TrendChart: React.FC = () => {
  const { chartData, output } = useRisk();
  const [view, setView] = useState<ChartView>('overview');

  const hasData = chartData.length > 1;

  // Gradient stop color based on risk
  const gradientColor = output
    ? output.features.waterRisk > 0.5
      ? '#ef4444'
      : output.riskScore > 0.35
      ? '#f59e0b'
      : '#10b981'
    : '#38bdf8';

  return (
    <motion.div
      variants={chartVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-[14px] p-5 flex flex-col gap-4 h-full"
    >
      <div className="flex items-start justify-between">
        <SectionHeader title="Temporal Risk Analysis" />
        {/* View toggle */}
        <div className="seg-group flex-shrink-0">
          {(['overview', 'factors'] as ChartView[]).map((v) => (
            <button
              key={v}
              className={`seg-btn ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}
            >
              {v === 'overview' ? 'Overview' : 'Factors'}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center flex-1 min-h-[180px]">
          <span className="font-mono text-[10px] text-[#334155] tracking-widest uppercase">
            Collecting data...
          </span>
        </div>
      ) : (
        <div className="flex-1 min-h-[200px]">
          {view === 'overview' ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradientColor} stopOpacity={0.35} />
                    <stop offset="100%" stopColor="transparent" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(56,189,248,0.07)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="t"
                  tick={{ fill: '#334155', fontFamily: 'IBM Plex Mono', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#334155', fontFamily: 'IBM Plex Mono', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={75}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeOpacity={0.35}
                  label={{ value: 'CRITICAL', fill: '#ef4444', fontSize: 8, fontFamily: 'IBM Plex Mono' }}
                />
                <ReferenceLine y={55} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.3} />
                <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.25} />
                <Area
                  type="monotone"
                  dataKey="riskPct"
                  name="Risk Score"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fill="url(#riskGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#38bdf8', stroke: '#0a1228', strokeWidth: 2 }}
                  animationDuration={CHART_CONFIG.animDuration}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="rgba(56,189,248,0.07)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#334155', fontFamily: 'IBM Plex Mono', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#334155', fontFamily: 'IBM Plex Mono', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'IBM Plex Mono',
                    fontSize: 9,
                    color: '#475569',
                  }}
                  iconType="circle"
                  iconSize={6}
                />
                <Line type="monotone" dataKey="waterPct"    name="Water Risk"  stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={600} />
                <Line type="monotone" dataKey="vectorPct"   name="Vector Risk" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={680} />
                <Line type="monotone" dataKey="sanitPct"    name="Sanitation"  stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={760} />
                <Line type="monotone" dataKey="exposurePct" name="Exposure"    stroke="#fb923c" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={840} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Bottom stats row */}
      {hasData && (
        <div className="flex items-center gap-4 pt-2 border-t border-[rgba(56,189,248,0.07)]">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#334155]">Points</span>
            <span className="font-mono text-[10px] text-[#64748b]">{chartData.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#334155]">Peak</span>
            <span className="font-mono text-[10px] text-[#f87171]">
              {Math.max(...chartData.map((d) => d.riskPct)).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#334155]">Avg</span>
            <span className="font-mono text-[10px] text-[#94a3b8]">
              {(chartData.reduce((s, d) => s + d.riskPct, 0) / chartData.length).toFixed(1)}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {(() => {
              if (chartData.length < 2) return null;
              const last  = chartData[chartData.length - 1].riskPct;
              const prev  = chartData[chartData.length - 2].riskPct;
              const delta = last - prev;
              const up    = delta > 0.5;
              const dn    = delta < -0.5;
              return (
                <span
                  className="font-mono text-[9px] font-medium"
                  style={{ color: up ? '#f87171' : dn ? '#34d399' : '#64748b' }}
                >
                  {up ? '▲' : dn ? '▼' : '—'} {Math.abs(delta).toFixed(1)}
                </span>
              );
            })()}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TrendChart;