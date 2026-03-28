// ─────────────────────────────────────────────
// APHIP — Input Panel
// All 15 UserInput fields with segment controls
// ─────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { cardVariants } from '@/animations/motionVariants';
import { Toggle, SectionHeader } from '@/components/ui';
import { scenarioList } from '@/data/scenarios';
import type { UserInput } from '@/types';

// ── Segment control ───────────────────────────

interface SegProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  color?: string;
}

function Seg<T extends string>({ value, options, onChange, color = '#38bdf8' }: SegProps<T>) {
  return (
    <div className="seg-group flex-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`seg-btn ${value === opt.value ? 'active' : ''}`}
          style={
            value === opt.value
              ? { color, background: `${color}15`, boxShadow: `0 0 8px ${color}18` }
              : undefined
          }
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Row ───────────────────────────────────────

interface RowProps {
  label: string;
  children: React.ReactNode;
}

function Row({ label, children }: RowProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="font-mono text-[9.5px] text-[#475569] w-[88px] flex-shrink-0 tracking-wide">
        {label}
      </span>
      {children}
    </div>
  );
}

// ── Group header ──────────────────────────────

function GroupHead({
  title,
  color = '#38bdf8',
  icon,
}: {
  title: string;
  color?: string;
  icon?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 mt-3 mb-1 pb-1.5"
      style={{ borderBottom: `1px solid ${color}18` }}
    >
      {icon && <span className="text-[11px]">{icon}</span>}
      <span
        className="font-mono text-[8.5px] tracking-[2px] uppercase"
        style={{ color }}
      >
        {title}
      </span>
    </div>
  );
}

// ── InputPanel ────────────────────────────────

const InputPanel: React.FC = () => {
  const { input, updateInput, loadScenario } = useRisk();

  function set<K extends keyof UserInput>(k: K) {
    return (v: UserInput[K]) => updateInput({ [k]: v });
  }

  const scenarioCategoryColors: Record<string, string> = {
    MINIMAL:  '#10b981',
    LOW:      '#34d399',
    MODERATE: '#f59e0b',
    HIGH:     '#f97316',
    CRITICAL: '#ef4444',
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-[14px] flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <SectionHeader title="Environmental Input" subtitle="Structured field observation" />
      </div>

      {/* Scenario presets */}
      <div className="px-5 pb-3">
        <span className="font-mono text-[8.5px] tracking-[2px] uppercase text-[#334155] block mb-2">
          Scenario Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {scenarioList.map((s) => {
            const c = scenarioCategoryColors[s.category] ?? '#38bdf8';
            return (
              <button
                key={s.id}
                onClick={() => loadScenario(s.id)}
                className="font-mono text-[8.5px] tracking-wide px-2.5 py-1 rounded-full transition-all duration-200"
                style={{
                  background: `${c}10`,
                  border: `1px solid ${c}25`,
                  color: c,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = `${c}1e`;
                  el.style.boxShadow = `0 0 12px ${c}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = `${c}10`;
                  el.style.boxShadow = 'none';
                }}
              >
                {s.name.split('—')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* Scrollable form */}
      <div className="scroll-panel flex-1 px-5 py-3 flex flex-col">

        {/* ── Water Quality ── */}
        <GroupHead title="Water Quality" color="#38bdf8" icon="💧" />

        <Row label="Clarity">
          <Seg
            value={input.clarity}
            onChange={set('clarity')}
            color="#38bdf8"
            options={[
              { value: 'clear', label: 'Clear' },
              { value: 'mild',  label: 'Mild'  },
              { value: 'muddy', label: 'Muddy' },
            ]}
          />
        </Row>

        <Row label="Color">
          <Seg
            value={input.color}
            onChange={set('color')}
            color="#38bdf8"
            options={[
              { value: 'none',   label: 'None'   },
              { value: 'yellow', label: 'Yellow' },
              { value: 'green',  label: 'Green'  },
              { value: 'brown',  label: 'Brown'  },
            ]}
          />
        </Row>

        <Row label="Odor">
          <Seg
            value={input.odor}
            onChange={set('odor')}
            color="#38bdf8"
            options={[
              { value: 'none',   label: 'None'   },
              { value: 'mild',   label: 'Mild'   },
              { value: 'strong', label: 'Strong' },
            ]}
          />
        </Row>

        {/* ── Environment & Vectors ── */}
        <GroupHead title="Environment & Vectors" color="#f97316" icon="🦟" />

        <Row label="Stagnation">
          <Toggle
            checked={input.stagnation}
            onChange={(v) => updateInput({ stagnation: v })}
            label={input.stagnation ? 'Present' : 'Absent'}
          />
        </Row>

        <Row label="Mosquitoes">
          <Seg
            value={input.mosquito}
            onChange={set('mosquito')}
            color="#f97316"
            options={[
              { value: 'none', label: 'None' },
              { value: 'few',  label: 'Few'  },
              { value: 'many', label: 'Many' },
            ]}
          />
        </Row>

        <Row label="Garbage">
          <Seg
            value={input.garbage}
            onChange={set('garbage')}
            color="#f97316"
            options={[
              { value: 'low',    label: 'Low'  },
              { value: 'medium', label: 'Med'  },
              { value: 'high',   label: 'High' },
            ]}
          />
        </Row>

        <Row label="Drainage">
          <Seg
            value={input.drainage}
            onChange={set('drainage')}
            color="#f97316"
            options={[
              { value: 'good',     label: 'Good'     },
              { value: 'blocked',  label: 'Blocked'  },
              { value: 'overflow', label: 'Overflow' },
            ]}
          />
        </Row>

        {/* ── Weather ── */}
        <GroupHead title="Weather Conditions" color="#8b5cf6" icon="🌧" />

        <Row label="Rainfall">
          <Seg
            value={input.rainfall}
            onChange={set('rainfall')}
            color="#8b5cf6"
            options={[
              { value: 'none',  label: 'None'  },
              { value: 'light', label: 'Light' },
              { value: 'heavy', label: 'Heavy' },
            ]}
          />
        </Row>

        <Row label="Duration">
          <Seg
            value={input.duration}
            onChange={set('duration')}
            color="#8b5cf6"
            options={[
              { value: '<1',  label: '<1d'  },
              { value: '1-3', label: '1-3d' },
              { value: '>3',  label: '>3d'  },
            ]}
          />
        </Row>

        <Row label="Trend">
          <Seg
            value={input.trend}
            onChange={set('trend')}
            color="#8b5cf6"
            options={[
              { value: 'improving', label: 'Better' },
              { value: 'same',      label: 'Same'   },
              { value: 'worsening', label: 'Worse'  },
            ]}
          />
        </Row>

        {/* ── Population Exposure ── */}
        <GroupHead title="Population Exposure" color="#fb923c" icon="👥" />

        <Row label="Usage">
          <Seg
            value={input.usage}
            onChange={set('usage')}
            color="#fb923c"
            options={[
              { value: 'drinking', label: 'Drinking' },
              { value: 'washing',  label: 'Washing'  },
              { value: 'none',     label: 'None'     },
            ]}
          />
        </Row>

        <Row label="Population">
          <Seg
            value={input.population}
            onChange={set('population')}
            color="#fb923c"
            options={[
              { value: 'low',    label: 'Low' },
              { value: 'medium', label: 'Med' },
              { value: 'high',   label: 'High' },
            ]}
          />
        </Row>

        <Row label="Vulnerable">
          <Toggle
            checked={input.vulnerable}
            onChange={(v) => updateInput({ vulnerable: v })}
            label={input.vulnerable ? 'At-risk groups present' : 'General population'}
          />
        </Row>

        {/* ── Health Signals ── */}
        <GroupHead title="Health Signals" color="#f43f5e" icon="🏥" />

        <Row label="Illness">
          <Seg
            value={input.illness}
            onChange={set('illness')}
            color="#f43f5e"
            options={[
              { value: 'none', label: 'None' },
              { value: 'few',  label: 'Few'  },
              { value: 'many', label: 'Many' },
            ]}
          />
        </Row>

        {input.illness !== 'none' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Row label="Type">
              <Seg
                value={input.illnessType}
                onChange={set('illnessType')}
                color="#f43f5e"
                options={[
                  { value: 'fever',    label: 'Fever'    },
                  { value: 'diarrhea', label: 'Diarrhea' },
                  { value: 'unknown',  label: 'Unknown'  },
                ]}
              />
            </Row>
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    </motion.div>
  );
};

export default InputPanel;