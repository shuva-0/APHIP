// ─────────────────────────────────────────────
// APHIP — useRisk Hook
// ─────────────────────────────────────────────

import { useContext } from 'react';
import { RiskContext } from '@/context/RiskContext';
import type { RiskContextValue } from '@/context/RiskContext';

export function useRisk(): RiskContextValue {
  const ctx = useContext(RiskContext);
  if (!ctx) {
    throw new Error('useRisk must be used within a <RiskProvider>');
  }
  return ctx;
}