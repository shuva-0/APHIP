// ─────────────────────────────────────────────
// APHIP — UI Component Library
// Card, Button, Slider, Toggle, Badge,
// MetricTile, SectionHeader, Skeleton
// ─────────────────────────────────────────────

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

// ── Card ─────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => (
  <div
    className={`glass rounded-[14px] p-5 ${className}`}
    style={style}
  >
    {children}
  </div>
);

// ── Button ────────────────────────────────────

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const BUTTON_VARIANTS: Record<string, string> = {
  primary:   'bg-[rgba(56,189,248,0.15)] border border-[rgba(56,189,248,0.3)] text-[#38bdf8] hover:bg-[rgba(56,189,248,0.22)] shadow-[0_0_12px_rgba(56,189,248,0.15)]',
  secondary: 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#94a3b8] hover:bg-[rgba(255,255,255,0.09)]',
  ghost:     'bg-transparent border border-transparent text-[#64748b] hover:text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)]',
  danger:    'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] text-[#f87171] hover:bg-[rgba(239,68,68,0.2)]',
};

const BUTTON_SIZES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-[10px] tracking-[1px]',
  md: 'px-4 py-2 text-[11px] tracking-[0.8px]',
  lg: 'px-5 py-2.5 text-[12px] tracking-[0.6px]',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  className = '',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      font-mono uppercase rounded-[8px] transition-all duration-200 cursor-pointer
      disabled:opacity-40 disabled:cursor-not-allowed
      ${BUTTON_VARIANTS[variant]}
      ${BUTTON_SIZES[size]}
      ${className}
    `}
  >
    {children}
  </button>
);

// ── Slider ────────────────────────────────────

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  color = '#38bdf8',
  showValue = true,
  label,
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="font-mono text-[9.5px] text-[#475569] tracking-wide">{label}</span>
          )}
          {showValue && (
            <span className="font-mono text-[10px] font-medium" style={{ color }}>
              {Math.round(value * 100)}
            </span>
          )}
        </div>
      )}
      <div className="relative h-[20px] flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-[5px] rounded-full bg-[rgba(255,255,255,0.05)]" />
        {/* Fill */}
        <div
          className="absolute left-0 h-[5px] rounded-full transition-all duration-150"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 6px ${color}50`,
          }}
        />
        {/* Native input (transparent, on top) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 2 }}
        />
        {/* Thumb visual */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full border-2 -translate-x-1/2 pointer-events-none transition-all duration-150"
          style={{
            left: `${pct}%`,
            background: color,
            borderColor: '#0b1228',
            boxShadow: `0 0 8px ${color}70`,
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
};

// ── Toggle ────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  color?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  color = '#38bdf8',
}) => (
  <div className="flex items-center gap-2.5 flex-1">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-9 h-5 rounded-full transition-all duration-300 cursor-pointer"
      style={{
        background: checked ? `${color}30` : 'rgba(255,255,255,0.06)',
        border: `1px solid ${checked ? color + '50' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: checked ? `0 0 10px ${color}25` : 'none',
      }}
    >
      <motion.div
        className="absolute top-[2px] w-[14px] h-[14px] rounded-full"
        animate={{ left: checked ? 'calc(100% - 16px)' : '2px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{ background: checked ? color : '#475569' }}
      />
    </button>
    {label && (
      <span className="font-mono text-[9.5px] text-[#475569] tracking-wide">{label}</span>
    )}
  </div>
);

// ── Badge ─────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'default';
  className?: string;
}

const BADGE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  green:   { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)'  },
  amber:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)'  },
  red:     { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
  blue:    { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)'  },
  purple:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  default: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)'  },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const s = BADGE_STYLES[variant] ?? BADGE_STYLES.default;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[9px] tracking-[1px] uppercase font-medium ${className}`}
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {children}
    </span>
  );
};

// ── MetricTile ────────────────────────────────

interface MetricTileProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  trend?: 'up' | 'down' | 'flat';
}

export const MetricTile: React.FC<MetricTileProps> = ({ label, value, sub, color = '#38bdf8', trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.15 }}
    className="glass rounded-[10px] p-3 flex flex-col gap-1"
    style={{ border: `1px solid ${color}18` }}
  >
    <span className="font-mono text-[8px] tracking-[1.5px] uppercase text-[#475569]">{label}</span>
    <div className="flex items-end gap-1.5">
      <span
        className="font-display font-black text-[22px] leading-none"
        style={{ color, textShadow: `0 0 12px ${color}40` }}
      >
        {value}
      </span>
      {trend && (
        <span
          className="font-mono text-[10px] pb-0.5"
          style={{ color: trend === 'up' ? '#f87171' : trend === 'down' ? '#34d399' : '#64748b' }}
        >
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
        </span>
      )}
    </div>
    {sub && <span className="font-mono text-[8px] text-[#334155] uppercase tracking-widest">{sub}</span>}
  </motion.div>
);

// ── SectionHeader ─────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  accent = '#38bdf8',
}) => (
  <div className="flex flex-col gap-0.5 mb-3">
    <div className="flex items-center gap-2">
      <div
        className="w-1 h-3.5 rounded-full flex-shrink-0"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}80` }}
      />
      <span className="font-mono text-[10px] tracking-[2px] uppercase text-[#94a3b8]">{title}</span>
    </div>
    {subtitle && (
      <span className="font-body text-[10.5px] text-[#334155] ml-3">{subtitle}</span>
    )}
  </div>
);

// ── Skeleton ──────────────────────────────────

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div
    className={`rounded-[8px] animate-pulse ${className}`}
    style={{ background: 'rgba(255,255,255,0.04)', ...style }}
  />
);