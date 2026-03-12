import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './i18n';

import App from './App';

/**
 * @title AOXC Neural OS - Frontend Bootstrap Kernel
 * @notice Initializes the React root, installs global runtime audit hooks,
 *         and enforces a top-level error boundary for unrecoverable UI faults.
 * @dev This module intentionally keeps bootstrap logic compact and deterministic.
 *      Global listeners are registered exactly once during application startup.
 */

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * @notice Normalizes unknown thrown values into a proper Error instance.
 * @dev Browser runtimes may surface non-Error rejection payloads. This helper
 *      prevents unsafe assumptions in logging and fallback rendering paths.
 */
function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error('Unknown runtime failure');
  }
}

/**
 * @notice Emits structured diagnostic information for runtime failures.
 * @dev Logging remains console-based at bootstrap level to avoid coupling the
 *      error path to application services that may themselves be degraded.
 */
function logCriticalRuntimeError(
  scope: 'REACT_ERROR_BOUNDARY' | 'UNHANDLED_REJECTION' | 'GLOBAL_ERROR',
  error: unknown,
  metadata?: Record<string, unknown>
): void {
  const normalizedError = normalizeError(error);

  console.error('AOXCORE_CRITICAL_LOG', {
    scope,
    message: normalizedError.message,
    stack: normalizedError.stack ?? null,
    metadata: metadata ?? null,
    timestamp: new Date().toISOString(),
  });
}

/**
 * @notice Top-level React error boundary for unrecoverable render-tree faults.
 * @dev This boundary is intentionally stateful and minimal. It provides a
 *      deterministic recovery surface while preserving forensic visibility.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logCriticalRuntimeError('REACT_ERROR_BOUNDARY', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReport = (): void => {
    window.location.assign('mailto:aoxcdao@gmail.com');
  };

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const renderedError =
      this.state.error?.stack?.trim() ||
      this.state.error?.message?.trim() ||
      'Unknown runtime failure';

    return (
      <div className="fixed inset-0 z-[10000] bg-[#030303] text-white font-mono flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-3xl rounded-[2rem] border border-rose-500/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01)),rgba(20,5,5,0.9)] shadow-[0_0_100px_rgba(244,63,94,0.08)] backdrop-blur-2xl overflow-hidden">
          <div className="border-b border-white/5 px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.18)]">
                <span className="text-xl font-black leading-none">!</span>
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  SYSTEM_KERNEL_PANIC
                </h1>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-rose-400/60">
                  Critical Execution Halt
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="rounded-2xl border border-white/5 bg-black/30 px-4 py-4 sm:px-5">
              <p className="text-xs leading-relaxed text-white/72">
                An unrecoverable runtime error interrupted the AOXC Neural OS
                execution flow. Diagnostic details were written to the browser
                console for forensic inspection.
              </p>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Failure Trace
              </div>

              <pre className="max-h-[260px] overflow-auto rounded-2xl border border-white/5 bg-black/60 p-4 text-[10px] leading-relaxed text-rose-300/80 scrollbar-hide">
                <code>{renderedError}</code>
              </pre>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white transition-all duration-200 hover:bg-rose-500 active:scale-[0.98] shadow-[0_10px_30px_rgba(225,29,72,0.24)]"
              >
                REBOOT_KERNEL
              </button>

              <button
                type="button"
                onClick={this.handleReport}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/60 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/85 active:scale-[0.98]"
              >
                REPORT_TO_DAO
              </button>
            </div>
          </div>

          <div className="border-t border-white/5 px-6 py-4 sm:px-8">
            <div className="text-[9px] font-black uppercase tracking-[0.45em] text-white/12">
              AOXC // Neural Shield Active
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @notice Installs process-level browser runtime diagnostics.
 * @dev These listeners do not attempt recovery. They only provide visibility
 *      into faults outside the React render boundary.
 */
function installGlobalRuntimeAudits(): void {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    logCriticalRuntimeError('UNHANDLED_REJECTION', event.reason);
  });

  window.addEventListener('error', (event: ErrorEvent) => {
    logCriticalRuntimeError('GLOBAL_ERROR', event.error ?? event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

installGlobalRuntimeAudits();

const container = document.getElementById('root');

if (!(container instanceof HTMLElement)) {
  throw new Error("AOXCORE_BOOT_FAILURE: Root container (id='root') was not found in DOM.");
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
