// ─────────────────────────────────────────────
// APHIP — Main Layout (Topbar + Sidebar + Content)
// ─────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRisk } from '@/hooks/useRisk';
import { topbarVariants, sidebarVariants } from '@/animations/motionVariants';
import { APP_VERSION, APP_BUILD } from '@/constants';

// ── Icon components (inline SVG, no deps) ────────

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);
const IconInput = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IconSim = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 13L8 3l5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 9.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconActions = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconHistory = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2.5 8a5.5 5.5 0 1 0 1-3.2M2.5 8V4.5M2.5 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type TabId = 'dashboard' | 'simulation' | 'actions' | 'history';

interface NavItem {
  id: TabId;
  icon: React.ReactNode;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',  icon: <IconDashboard />, label: 'Dashboard'  },
  { id: 'simulation', icon: <IconSim />,       label: 'Simulation' },
  { id: 'actions',    icon: <IconActions />,   label: 'Actions'    },
  { id: 'history',    icon: <IconHistory />,   label: 'History'    },
];

interface MainLayoutProps { children: React.ReactNode; }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { display, output, setActiveTab, activeTab } = useRisk();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const tick = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const catColor = display?.categoryColor ?? '#38bdf8';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-void)' }}>

      {/* ── TOPBAR ── */}
      <motion.header
        variants={topbarVariants}
        initial="initial"
        animate="animate"
        className="fixed top-0 left-0 right-0 z-[200] flex items-center gap-3 px-4"
        style={{
          height: 'var(--topbar-h)',
          background: 'rgba(4,8,15,0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-dim)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 pl-[52px]">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center font-mono font-bold text-[12px] text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              boxShadow: '0 0 16px rgba(56,189,248,0.4)',
            }}
          >
            ⚕
          </div>
          <div className="flex flex-col -gap-0.5">
            <span className="font-display font-extrabold text-[14px] text-[#f1f5f9] leading-none tracking-tight">
              APHIP
            </span>
            <span className="font-mono text-[8px] tracking-[1.5px] text-[#334155] uppercase">
              Public Health Intel
            </span>
          </div>
        </div>

        <div className="w-px h-5 bg-[var(--border-mid)] mx-1" />

        {/* SDG badge */}
        <div
          className="font-mono text-[8.5px] tracking-[1.5px] uppercase px-2 py-1 rounded-full flex items-center gap-1"
          style={{
            background: 'rgba(56,189,248,0.07)',
            border: '1px solid rgba(56,189,248,0.18)',
            color: '#38bdf8',
          }}
        >
          SDG-3 ⚡
        </div>

        {/* Nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] font-mono text-[9.5px] tracking-wide uppercase transition-all duration-200"
              style={{
                color: activeTab === item.id ? '#38bdf8' : '#475569',
                background: activeTab === item.id ? 'rgba(56,189,248,0.1)' : 'transparent',
                border: activeTab === item.id ? '1px solid rgba(56,189,248,0.22)' : '1px solid transparent',
              }}
            >
              <span style={{ opacity: activeTab === item.id ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Risk score pill */}
          {output && (
            <motion.div
              key={display?.categoryLabel}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: `${catColor}10`,
                border: `1px solid ${catColor}28`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: catColor, boxShadow: `0 0 6px ${catColor}` }}
              />
              <span className="font-mono text-[10px]" style={{ color: catColor }}>
                {Math.round(output.riskScore * 100)} / {output.category}
              </span>
            </motion.div>
          )}

          {/* Live badge */}
          <div className="badge-mono badge-live">
            <span className="live-dot" />
            LIVE
          </div>

          {/* Clock */}
          <span className="font-mono text-[10px] text-[#334155] hidden md:block">
            {timeStr}
          </span>

          {/* Version */}
          <span className="font-mono text-[8.5px] text-[#1e293b] hidden lg:block tracking-widest">
            v{APP_VERSION}
          </span>
        </div>
      </motion.header>

      {/* ── SIDEBAR ── */}
      <motion.aside
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        className="fixed left-0 z-[150] flex flex-col items-center py-4 gap-1.5"
        style={{
          top: 'var(--topbar-h)',
          bottom: 0,
          width: 'var(--sidebar-w)',
          background: 'rgba(4,8,15,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border-dim)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative w-9 h-9 rounded-[8px] flex items-center justify-center transition-all duration-200 group"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              style={{
                color: active ? '#38bdf8' : '#334155',
                background: active ? 'rgba(56,189,248,0.12)' : 'transparent',
                border: active ? '1px solid rgba(56,189,248,0.25)' : '1px solid transparent',
                boxShadow: active ? '0 0 12px rgba(56,189,248,0.15)' : 'none',
              }}
            >
              {item.icon}
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full"
                  style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}
                />
              )}
              {/* Tooltip */}
              <div
                className="absolute left-[calc(100%+10px)] px-2 py-1 rounded-[6px] font-mono text-[9px] tracking-wide uppercase whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  background: 'rgba(11,18,40,0.95)',
                  border: '1px solid var(--border-mid)',
                  color: '#94a3b8',
                }}
              >
                {item.label}
              </div>
            </motion.button>
          );
        })}

        <div className="flex-1" />

        {/* Build label */}
        <span
          className="font-mono text-[7px] text-[#1e293b] tracking-[1.5px] mb-2"
          style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}
        >
          {APP_BUILD}
        </span>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          marginLeft: 'var(--sidebar-w)',
          paddingTop: 'var(--topbar-h)',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;