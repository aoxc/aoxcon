import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { MainLayout } from './layouts/MainLayout';

import { AoxcanInterface } from './components/AoxcanInterface';
import { BootSequence } from './components/BootSequence';
import { ContractNotary } from './components/ContractNotary';
import { LedgerView } from './components/LedgerView';
import { ModularControl } from './components/ModularControl';
import { NeuralAnalytics } from './components/NeuralAnalytics';
import { NotificationCenter } from './components/NotificationCenter';
import { PendingSignatures } from './components/PendingSignatures';
import { RegistryMap } from './components/RegistryMap';
import { SentinelChat } from './components/SentinelChat';
import { SkeletonView } from './components/SkeletonView';
import { Toaster } from './components/Toaster';
import { UpgradePanel } from './components/UpgradePanel';
import { WarRoom } from './components/WarRoom';

import { useAoxcClock } from './hooks/useAoxcClock';
import { useAoxcStore } from './store/useAoxcStore';

/**
 * @title AOXC Neural OS v2.6 - Main Kernel
 * @notice Central orchestration layer for UI routing, network telemetry, and system health supervision.
 * @dev This implementation avoids synthetic connectivity reporting. Network degradation is surfaced
 *      explicitly instead of being masked by simulated healthy values.
 */

const API_CONFIG = {
  ENDPOINT: 'https://aoxcore.com/api/status.php',
  HEARTBEAT_INTERVAL_MS: 5_000,
  REQUEST_TIMEOUT_MS: 4_000,
} as const;

type SystemMode = 'LIVE' | 'DEGRADED';

/**
 * @notice Returns true when the thrown error represents an intentional abort.
 */
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * @notice Creates a timeout controller for outbound health checks.
 * @dev The timeout is enforced independently from component unmount cleanup.
 */
function createTimedAbortController(timeoutMs: number): {
  controller: AbortController;
  cancelTimeout: () => void;
} {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    controller,
    cancelTimeout: () => window.clearTimeout(timeoutId),
  };
}

export default function App(): React.JSX.Element {
  useAoxcClock();

  const {
    activeView,
    isMobileMenuOpen,
    isRightPanelOpen,
    toggleMobileMenu,
    addLog,
    syncNetwork,
  } = useAoxcStore();

  const [bootComplete, setBootComplete] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [latency, setLatency] = useState<number>(Number.NaN);
  const [systemMode, setSystemMode] = useState<SystemMode>('DEGRADED');

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * @notice Executes a full network health audit for the current frontend session.
   * @dev A successful result requires both store-level network synchronization and
   *      a valid upstream health response from the AOXC status endpoint.
   */
  const performSystemAudit = useCallback(async (): Promise<void> => {
    abortControllerRef.current?.abort();

    const { controller, cancelTimeout } = createTimedAbortController(
      API_CONFIG.REQUEST_TIMEOUT_MS
    );
    abortControllerRef.current = controller;

    const startTime = performance.now();

    try {
      await syncNetwork();

      const response = await fetch(API_CONFIG.ENDPOINT, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, text/plain;q=0.9, */*;q=0.8',
          'X-AOXC-AUDIT': 'TRUE',
          'X-AOXC-Identity': '@AOXCDAO',
          'X-AOXC-Agent': 'Neural-OS-v2.6',
        },
      });

      if (!response.ok) {
        throw new Error(`STATUS_ENDPOINT_HTTP_${response.status}`);
      }

      const endTime = performance.now();

      setLatency(Math.max(0, Math.round(endTime - startTime)));
      setIsOnline(true);
      setSystemMode('LIVE');
    } catch (error: unknown) {
      if (isAbortError(error)) {
        return;
      }

      setIsOnline(false);
      setLatency(Number.NaN);
      setSystemMode('DEGRADED');

      addLog('SYSTEM_NOTICE: Upstream network audit degraded. Live telemetry unavailable.', 'warning');
    } finally {
      cancelTimeout();
    }
  }, [syncNetwork, addLog]);

  useEffect(() => {
    void performSystemAudit();

    const pulseTimer = window.setInterval(() => {
      void performSystemAudit();
    }, API_CONFIG.HEARTBEAT_INTERVAL_MS);

    return () => {
      window.clearInterval(pulseTimer);
      abortControllerRef.current?.abort();
    };
  }, [performSystemAudit]);

  /**
   * @notice Resolves the currently active primary interface.
   * @dev NotificationCenter is intentionally excluded from routed content because
   *      it is mounted globally as an overlay-capable system component.
   */
  const activeInterface = useMemo(() => {
    return (
      <Suspense fallback={<SkeletonView />}>
        {(() => {
          switch (activeView) {
            case 'pending':
              return <PendingSignatures />;
            case 'registry':
              return <RegistryMap />;
            case 'governance':
              return <WarRoom />;
            case 'analytics':
              return <NeuralAnalytics />;
            case 'aoxcan':
              return <AoxcanInterface />;
            case 'finance':
              return <LedgerView />;
            default:
              return <LedgerView />;
          }
        })()}
      </Suspense>
    );
  }, [activeView]);

  return (
    <MainLayout
      isOnline={isOnline}
      latency={latency}
      isMobileMenuOpen={isMobileMenuOpen}
      toggleMobileMenu={toggleMobileMenu}
      isRightPanelOpen={isRightPanelOpen}
      rightPanelContent={<ModularControl />}
    >
      <AnimatePresence mode="wait">
        {!bootComplete && (
          <BootSequence onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: bootComplete ? 1 : 0, y: bootComplete ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col h-full"
          data-system-mode={systemMode}
        >
          {activeInterface}
        </motion.div>
      </main>

      <Toaster />
      <ContractNotary />
      <UpgradePanel />
      <SentinelChat />
      <NotificationCenter />
    </MainLayout>
  );
}
