// ─────────────────────────────────────────────
// APHIP — Dashboard Page
// Full 3-row grid: Gauge+Confidence / Chart+Factors / Sim+Actions
// ─────────────────────────────────────────────

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { pageVariants, cardVariants, fadeUp } from '@/animations/motionVariants';

import RiskGauge       from '@/components/dashboard/RiskGauge';
import ConfidenceBar   from '@/components/dashboard/ConfidenceBar';
import TrendChart      from '@/components/dashboard/TrendChart';
import FactorBreakdown from '@/components/dashboard/FactorBreakdown';
import InputPanel      from '@/components/panels/InputPanel';
import SimulationPanel from '@/components/panels/SimulationPanel';
import ActionPanel     from '@/components/panels/ActionPanel';
import { MetricTile }  from '@/components/ui';
import { fmtScore, fmtConfidence, getCategoryColor } from '@/utils';

// ── Mini KPI bar ─────────────────────────────

const KpiBar: React.FC = () => {
  const { output, display } = useRisk();
  if (!output) return null;

  const kpis = [
    { label: 'Water Risk',   value: `${Math.round(output.features.waterRisk    * 100)}`, color: '#38bdf8', sub: 'index' },
    { label: 'Vector Risk',  value: `${Math.round(output.features.vectorRisk   * 100)}`, color: '#f97316', sub: 'index' },
    { label: 'Sanitation',   value: `${Math.round(output.features.sanitation   * 100)}`, color: '#8b5cf6', sub: 'index' },
    { label: 'Exposure',     value: `${Math.round(output.features.exposure     * 100)}`, color: '#fb923c', sub: 'index' },
    { label: 'Health Signal',value: `${Math.round(output.features.healthSignal * 100)}`, color: '#f43f5e', sub: 'index' },
    { label: 'Confidence',   value: fmtConfidence(output.confidence),                   color: display?.categoryColor ?? '#38bdf8', sub: 'certainty' },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-6 gap-2"
    >
      {kpis.map((k) => (
        <MetricTile
          key={k.label}
          label={k.label}
          value={k.value}
          sub={k.sub}
          color={k.color}
        />
      ))}
    </motion.div>
  );
};

// ── Tab Content ──────────────────────────────

const DashboardTab: React.FC = () => (
  <div className="flex flex-col gap-4">
    {/* Row 1: KPI Bar */}
    <KpiBar />

    {/* Row 2: Gauge + Confidence */}
    <div className="grid grid-cols-12 gap-4">
      {/* Gauge */}
      <motion.div
        variants={cardVariants}
        className="col-span-12 md:col-span-4 glass rounded-[14px] p-6 flex items-center justify-center"
        style={{ minHeight: 360 }}
      >
        <RiskGauge />
      </motion.div>

      {/* Confidence + Factor side by side on right */}
      <div className="col-span-12 md:col-span-8 grid grid-rows-1 gap-4">
        <div className="grid grid-cols-2 gap-4" style={{ minHeight: 360 }}>
          <ConfidenceBar />
          <FactorBreakdown />
        </div>
      </div>
    </div>

    {/* Row 3: Trend chart (full width) */}
    <motion.div variants={cardVariants} style={{ minHeight: 300 }}>
      <TrendChart />
    </motion.div>
  </div>
);

const SimulationTab: React.FC = () => (
  <div className="grid grid-cols-12 gap-4">
    <div className="col-span-12 lg:col-span-5" style={{ minHeight: 600 }}>
      <InputPanel />
    </div>
    <div className="col-span-12 lg:col-span-7" style={{ minHeight: 600 }}>
      <SimulationPanel />
    </div>
  </div>
);

const ActionsTab: React.FC = () => (
  <div className="grid grid-cols-12 gap-4">
    <div className="col-span-12 lg:col-span-5" style={{ minHeight: 600 }}>
      <InputPanel />
    </div>
    <div className="col-span-12 lg:col-span-7" style={{ minHeight: 600 }}>
      <ActionPanel />
    </div>
  </div>
);

const HistoryTab: React.FC = () => {
  const { trendHistory } = useRisk();

  return (
    <div className="flex flex-col gap-4">
      <TrendChart />
      <motion.div
        variants={cardVariants}
        className="glass rounded-[14px] p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <span className="font-mono text-[9.5px] tracking-[2.5px] uppercase text-[#64748b]">
            Observation Log
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(56,189,248,0.15)] to-transparent" />
          <span className="font-mono text-[9px] text-[#334155]">{trendHistory.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(56,189,248,0.07)]">
                {['Time', 'Risk', 'Category', 'Water', 'Vector', 'Sanitation', 'Exposure'].map((h) => (
                  <th key={h} className="text-left pb-2 font-mono text-[8.5px] tracking-[1.5px] uppercase text-[#334155] pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...trendHistory].reverse().map((row, i) => {
                const color = getCategoryColor(row.category);
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150"
                  >
                    <td className="py-2.5 pr-4 font-mono text-[10px] text-[#475569]">{row.time}</td>
                    <td className="py-2.5 pr-4">
                      <span className="font-display font-bold text-[14px]" style={{ color }}>
                        {fmtScore(row.riskScore)}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="font-mono text-[8.5px] px-2 py-0.5 rounded-full"
                        style={{
                          color,
                          background: `${color}12`,
                          border: `1px solid ${color}28`,
                        }}
                      >
                        {row.category}
                      </span>
                    </td>
                    {[row.waterRisk, row.vectorRisk, row.sanitation, row.exposure].map((v, j) => (
                      <td key={j} className="py-2.5 pr-4 font-mono text-[10px] text-[#64748b]">
                        {Math.round(v * 100)}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {trendHistory.length === 0 && (
            <div className="text-center py-8 font-mono text-[10px] text-[#334155] tracking-widest uppercase">
              No history yet
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Dashboard Page ───────────────────────────

const Dashboard: React.FC = () => {
  const { activeTab } = useRisk();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-5 flex flex-col gap-4 max-w-[1600px] mx-auto"
    >
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <DashboardTab />
          </motion.div>
        )}
        {activeTab === 'simulation' && (
          <motion.div key="simulation" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <SimulationTab />
          </motion.div>
        )}
        {activeTab === 'actions' && (
          <motion.div key="actions" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ActionsTab />
          </motion.div>
        )}
        {activeTab === 'history' && (
          <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <HistoryTab />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;