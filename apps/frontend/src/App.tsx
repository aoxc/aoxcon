import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { AnimatePresence, motion } from 'framer-motion';

// --- Structural Shell ---
import { MainLayout } from './layouts/MainLayout';

// --- Neural OS Module Imports ---
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
import { Pulse } from './components/Pulse'; 
import { NeuralTerminal } from './components/NeuralTerminal';

// --- Hooks & Global State ---
import { useAoxcClock } from './hooks/useAoxcClock';
import { useAoxcStore } from './store/useAoxcStore';

/**
 * @title AOXC Neural OS Kernel
 * @version 3.6.0-AUDIT-PRO
 * @notice Central system controller. Enforces strict triple-column grid logic.
 */

const API_CONFIG = {
  // Production link or Local Proxy
  ENDPOINT: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000/api/health',
  HEARTBEAT_INTERVAL_MS: 8000,
  REQUEST_TIMEOUT_MS: 5000,
} as const;

export default function App(): React.JSX.Element {
  // Sync Synchronized Network Clock
  useAoxcClock();
  
  const {
    activeView,
    isMobileMenuOpen,
    isRightPanelOpen,
    toggleMobileMenu,
    addLog,
    syncNetwork,
    analyticsData 
  } = useAoxcStore();

  const [bootComplete, setBootComplete] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [latency, setLatency] = useState<number>(NaN);
  const [systemMode, setSystemMode] = useState<'LIVE' | 'DEGRADED'>('DEGRADED');

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * @notice System Integrity Audit
   * Validates multi-chain connectivity and local heartbeat.
   */
  const performSystemAudit = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT_MS);
    abortControllerRef.current = controller;

    const startTime = performance.now();

    try {
      // Step 1: Sync blockchain state (X-Layer / Sui / Cardano)
      await syncNetwork(); 
      
      // Step 2: Backend Handshake (Failsafe mode if unreachable)
      const response = await fetch(API_CONFIG.ENDPOINT, {
        signal: controller.signal,
        headers: { 'X-AOXC-AUDIT': 'TRUE' }
      });

      if (!response.ok) throw new Error("HEARTBEAT_FAILURE");

      setLatency(Math.round(performance.now() - startTime));
      setIsOnline(true);
      setSystemMode('LIVE');
    } catch (e) {
      // Enter Degraded state but keep UI responsive
      setIsOnline(false);
      setSystemMode('DEGRADED');
    } finally {
      clearTimeout(timeoutId);
    }
  }, [syncNetwork]);

  useEffect(() => {
    performSystemAudit();
    const interval = setInterval(performSystemAudit, API_CONFIG.HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [performSystemAudit]);

  /**
   * @notice Primary Module Router
   * Prevents layout shifts by memoizing the view container.
   */
  const workspaceView = useMemo(() => {
    if (!bootComplete) return <SkeletonView />;
    
    // Kernel Routing Table
    switch (activeView) {
      case 'dashboard':  return <ModularControl />;
      case 'pending':    return <PendingSignatures />;
      case 'registry':   return <RegistryMap />;
      case 'governance': return <WarRoom />;
      case 'analytics':  return <NeuralAnalytics />;
      case 'aoxcan':     return <AoxcanInterface />;
      case 'finance':    return <LedgerView />;
      default:           return <ModularControl />;
    }
  }, [activeView, bootComplete]);

  /**
   * @notice DIAGNOSTICS HUD (Right Sidebar Slot)
   * Consolidates all alert, upgrade, and telemetry streams into a single vertical pipe.
   */
  const diagnosticsHUD = useMemo(() => (
    <div className="flex flex-col h-full w-full bg-[#050505]/60 backdrop-blur-3xl overflow-hidden font-mono border-l border-white/5 shadow-2xl">
      
      {/* SECTION A: Critical Priorities & Hardware Alerts */}
      <div className="shrink-0 p-5 border-b border-white/10 bg-gradient-to-b from-rose-500/[0.04] to-transparent">
        <UpgradePanel />
      </div>

      {/* SECTION B: Neural Event Stream (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Neural_Stream</span>
            <span className="text-[8px] text-cyan-500 animate-pulse font-bold uppercase">Uplink: Synchronized</span>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </header>
        
        <Pulse />
        <NotificationCenter />
      </div>

      {/* SECTION C: Forensic Terminal (Fixed Base) */}
      <div className="shrink-0 bg-black/80 border-t border-white/10 h-[220px]">
        <NeuralTerminal />
      </div>
    </div>
  ), []);

  return (
    <>
      {/* KERNEL_BOOT_INIT: High-priority splash overlay */}
      <AnimatePresence mode="wait">
        {!bootComplete && (
          <BootSequence 
            key="kernel-boot-sequence" 
            onComplete={() => setBootComplete(true)} 
          />
        )}
      </AnimatePresence>

      {/* OPERATIONAL_LAYER: Only mounts after verified bootstrap */}
      {bootComplete && (
        <MainLayout
          isOnline={isOnline}
          latency={latency}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          isRightPanelOpen={isRightPanelOpen}
          rightPanelContent={diagnosticsHUD}
        >
          {/* CENTER_WORKSPACE: Primary execution surface */}
          <main className="flex-1 h-full relative overflow-hidden flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 min-h-0 relative"
              data-system-mode={systemMode}
            >
              <Suspense fallback={<SkeletonView />}>
                {workspaceView}
              </Suspense>
            </motion.div>
          </main>

          {/* SINGLETON_OVERLAYS: Independent of standard grid flow */}
          <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-center">
             <div className="pointer-events-auto contents">
                <Toaster />
                <ContractNotary />
                <SentinelChat />
             </div>
          </div>
        </MainLayout>
      )}
    </>
  );
}
