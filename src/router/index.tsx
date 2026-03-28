// ─────────────────────────────────────────────
// APHIP — Router
// ─────────────────────────────────────────────

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import Dashboard  from '@/pages/Dashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </ErrorBoundary>
  </BrowserRouter>
);

export default AppRouter;