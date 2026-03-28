// ─────────────────────────────────────────────
// APHIP — Error Boundary
// ─────────────────────────────────────────────

import React, { Component, ErrorInfo } from 'react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[APHIP ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: '#04080f' }}>
          <div className="glass rounded-[14px] p-8 max-w-md text-center flex flex-col gap-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="font-display font-bold text-xl text-[#f1f5f9]">Component Error</h2>
            <p className="font-body text-sm text-[#64748b]">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              className="font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-[8px] transition-all"
              style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.28)', color: '#38bdf8' }}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;