// ─────────────────────────────────────────────
// APHIP — Risk Service
// Thin service wrapper around riskEngine
// ─────────────────────────────────────────────

import type { UserInput, RiskOutput, SimulationOverrides } from '@/types';
import { runRiskPipeline, simulateRisk } from '@/models/riskEngine';
import { log } from '@/utils';

export const riskService = {
  /**
   * Run the full risk assessment pipeline for given user input.
   */
  assess(input: UserInput): RiskOutput {
    log.info('riskService.assess called');
    return runRiskPipeline(input);
  },

  /**
   * Run a what-if simulation by overriding specific feature values.
   */
  simulate(
    base: RiskOutput,
    overrides: SimulationOverrides
  ): ReturnType<typeof simulateRisk> {
    log.info('riskService.simulate called', overrides);
    return simulateRisk(base.features, overrides);
  },
};