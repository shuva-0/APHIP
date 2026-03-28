// ─────────────────────────────────────────────
// APHIP — Root App
// ─────────────────────────────────────────────

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { RiskProvider } from '@/context/RiskContext';
import AppRouter from '@/router';
import '@/styles/globals.css';

const App: React.FC = () => (
  <RiskProvider>
    <AnimatePresence mode="wait">
      <AppRouter />
    </AnimatePresence>
  </RiskProvider>
);

export default App;