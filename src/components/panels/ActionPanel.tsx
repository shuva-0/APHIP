// ─────────────────────────────────────────────
// APHIP — Action Panel (Ranked Interventions)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { cardVariants, listVariants, recVariants } from '@/animations/motionVariants';
import { SectionHeader } from '@/components/ui';
import type { Recommendation } from '@/types';

// ── Urgency / Impact config ───────────────────

type UrgencyKey = Recommendation['urgency'];
type ImpactKey  = Recommendation['impact'];

const urgencyConfig: Record<UrgencyKey, { label: string; className: string; bar: string }> = {
  IMMEDIATE:  { label: 'IMMEDIATE',  className: 'tag-immediate', bar: '#ef4444' },
  SHORT_TERM: { label: 'SHORT-TERM', className: 'tag-short',     bar: '#f59e0b' },
  LONG_TERM:  { label: 'LONG-TERM',  className: 'tag-long',      bar: '#10b981' },
};

const impactConfig: Record<ImpactKey, { label: string; className: string; dot: string }> = {
  HIGH:   { label: 'HIGH', className: 'tag-high',   dot: '#f87171' },
  MEDIUM: { label: 'MED',  className: 'tag-medium', dot: '#fbbf24' },
  LOW:    { label: 'LOW',  className: 'tag-low',    dot: '#818cf8' },
};

// ── RecCard ───────────────────────────────────

interface RecCardProps {
  rec: Recommendation;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

const RecCard: React.FC<RecCardProps> = ({ rec, index, expanded, onToggle }) => {
  const urgency = urgencyConfig[rec.urgency];
  const impact  = impactConfig[rec.impact];

  const rankColor =
    rec.rank <= 2 ? '#ef4444' : rec.rank <= 4 ? '#f59e0b' : '#38bdf8';

  return (
    <motion.div
      variants={recVariants}
      custom={index}
      className="rounded-[10px] overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      whileHover={{
        borderColor: 'rgba(56,189,248,0.18)',
        background: 'rgba(255,255,255,0.035)',
      }}
      onClick={onToggle}
    >
      {/* Priority colour bar */}
      <div className="h-[3px] w-full" style={{ background: urgency.bar, opacity: 0.7 }} />

      {/* Main row */}
      <div className="px-3.5 py-3 flex items-center gap-3">
        {/* Rank badge */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-display font-black text-[13px]"
          style={{
            background: `${rankColor}18`,
            border: `1px solid ${rankColor}35`,
            color: rankColor,
            boxShadow: `0 0 10px ${rankColor}20`,
          }}
        >
          {rec.rank}
        </div>

        {/* Icon + title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[14px] flex-shrink-0">{rec.icon}</span>
          <span className="font-body font-medium text-[12.5px] text-[#cbd5e1] truncate">
            {rec.action}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`badge-mono ${urgency.className} hidden sm:inline-flex`}>
            {urgency.label}
          </span>
          <span className={`badge-mono ${impact.className}`}>{impact.label}</span>
          <span
            className="font-mono text-[9px] text-[#334155] transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 flex flex-col gap-2.5 pt-0">
              <div className="h-px bg-[rgba(255,255,255,0.05)]" />
              <p className="font-body text-[12px] text-[#64748b] leading-relaxed">
                {rec.description}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[8px] text-[#334155] uppercase tracking-[1.5px]">
                  Factor:
                </span>
                <span
                  className="font-mono text-[8.5px] px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(56,189,248,0.08)',
                    border: '1px solid rgba(56,189,248,0.18)',
                    color: '#38bdf8',
                  }}
                >
                  {rec.factor}
                </span>
                <span className="font-mono text-[8px] text-[#334155] uppercase tracking-[1.5px] ml-2">
                  Urgency:
                </span>
                <span className={`badge-mono ${urgency.className}`}>{urgency.label}</span>
                <span className="font-mono text-[8px] text-[#334155] uppercase tracking-[1.5px] ml-2">
                  Impact:
                </span>
                <span className={`badge-mono ${impact.className}`}>{rec.impact}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── ActionPanel ───────────────────────────────

type FilterKey = 'ALL' | UrgencyKey;

const ActionPanel: React.FC = () => {
  const { output } = useRisk();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterKey>('ALL');

  const recs     = output?.recommendations ?? [];
  const filtered = filter === 'ALL' ? recs : recs.filter((r) => r.urgency === filter);

  const immCount = recs.filter((r) => r.urgency === 'IMMEDIATE').length;
  const stCount  = recs.filter((r) => r.urgency === 'SHORT_TERM').length;
  const ltCount  = recs.filter((r) => r.urgency === 'LONG_TERM').length;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-[14px] flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <SectionHeader title="Intervention Strategy" subtitle="Ranked by urgency and impact" />

        {/* Summary chips */}
        <div className="flex gap-2 flex-wrap mb-3">
          {immCount > 0 && (
            <div className="flex items-center gap-1.5 badge-mono tag-immediate px-2 py-1 rounded-full">
              <span className="font-bold">{immCount}</span>
              <span>Immediate</span>
            </div>
          )}
          {stCount > 0 && (
            <div className="flex items-center gap-1.5 badge-mono tag-short px-2 py-1 rounded-full">
              <span className="font-bold">{stCount}</span>
              <span>Short-Term</span>
            </div>
          )}
          {ltCount > 0 && (
            <div className="flex items-center gap-1.5 badge-mono tag-long px-2 py-1 rounded-full">
              <span className="font-bold">{ltCount}</span>
              <span>Long-Term</span>
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="seg-group">
          {(['ALL', 'IMMEDIATE', 'SHORT_TERM', 'LONG_TERM'] as const).map((f) => (
            <button
              key={f}
              className={`seg-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL'
                ? 'All'
                : f === 'SHORT_TERM'
                ? 'Short'
                : f === 'LONG_TERM'
                ? 'Long'
                : f}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Recommendations list */}
      <div className="scroll-panel flex-1 px-4 py-3">
        {recs.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[#334155] font-mono text-[10px] tracking-widest uppercase">
            No actions needed
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[#334155] font-mono text-[10px] tracking-widest uppercase">
            None in this category
          </div>
        ) : (
          <motion.div
            key={filter}
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-2"
          >
            {filtered.map((rec, i) => (
              <RecCard
                key={rec.rank}
                rec={rec}
                index={i}
                expanded={expandedId === rec.rank}
                onToggle={() =>
                  setExpandedId(expandedId === rec.rank ? null : rec.rank)
                }
              />
            ))}
          </motion.div>
        )}

        {/* SDG callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 rounded-[8px] p-3 flex items-center gap-2"
          style={{
            background: 'rgba(56,189,248,0.04)',
            border: '1px solid rgba(56,189,248,0.1)',
          }}
        >
          <span className="text-[14px]">🎯</span>
          <div>
            <span className="font-mono text-[7.5px] tracking-[2px] uppercase text-[#38bdf8] opacity-70 block">
              SDG 3 — Good Health &amp; Well-Being
            </span>
            <span className="font-body text-[10.5px] text-[#334155] leading-snug">
              All interventions are aligned with UN Sustainable Development Goal 3 targets.
            </span>
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </motion.div>
  );
};

export default ActionPanel;