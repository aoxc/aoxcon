import React, { useCallback } from 'react';
import { useAoxcStore, Notification } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Activity,
  Zap,
  Lock,
  Trash2,
  Bell,
  Terminal,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Neural OS - Notification Kernel (Forensic Stream)
 * @version 4.2.0-STABLE
 * @notice Manages real-time telemetry alerts and security signals.
 * @security_protocol Enforces persistent storage for 'ERROR' level diagnostic flags.
 */

type SignalSeverity = 'info' | 'warning' | 'error' | 'success';

const SIGNAL_ICONS: Record<SignalSeverity, React.ReactNode> = {
  info: <Activity size={14} className="text-cyan-400" />,
  warning: <Zap size={14} className="text-amber-500" />,
  error: <ShieldAlert size={14} className="text-rose-500" />,
  success: <Lock size={14} className="text-emerald-500" />
};

export const NotificationCenter: React.FC = () => {
  const notifications = useAoxcStore((state) => state.notifications) ?? [];
  const setNotifications = useAoxcStore((state) => state.setNotifications);

  /**
   * @action SIG_TERMINATE
   * Removes specific signal from the stack based on unique identifier.
   */
  const terminateSignal = useCallback((id: string) => {
    setNotifications((prev: Notification[]) => prev.filter((n) => n.id !== id));
  }, [setNotifications]);

  /**
   * @action BUFFER_FLUSH
   * Purges non-critical telemetry. 
   * CRITICAL: Retains 'ERROR' signals for forensic post-mortem analysis.
   */
  const flushBuffer = useCallback(() => {
    setNotifications((prev: Notification[]) => 
      prev.filter((n) => n.type === 'error')
    );
  }, [setNotifications]);

  const timestampTelemetry = (ts?: number | string) => {
    try {
      const date = new Date(ts ?? Date.now());
      return date.toLocaleTimeString('en-GB', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    } catch {
      return '00:00:00';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020202] font-mono relative border-l border-white/5 shadow-[inset_10px_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* SECTION: OPERATIONAL HEADER */}
      <div className="shrink-0 p-5 border-b border-white/10 bg-black/40 backdrop-blur-2xl z-20 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3">
            <Terminal size={14} className={cn(notifications.length > 0 && "animate-pulse text-cyan-500")} />
            System_Telemetry
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-[8px] uppercase tracking-widest font-bold">
              Stream_Active // Handlers: {notifications.length}
            </span>
            {notifications.length > 0 && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
            )}
          </div>
        </div>

        {notifications.some(n => n.type !== 'error') && (
          <button
            onClick={flushBuffer}
            className="px-3 py-1 bg-white/[0.03] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/40 rounded-sm text-[8px] font-black text-white/40 hover:text-rose-500 transition-all uppercase tracking-[0.2em]"
          >
            Flush_Cache
          </button>
        )}
      </div>

      {/* SECTION: SIGNAL PIPELINE */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide relative z-10">
        <AnimatePresence mode="popLayout" initial={false}>
          {notifications.length === 0 ? (
            <motion.div
              key="system-nominal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full" />
                <Cpu size={32} className="text-cyan-500/40 relative" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-white uppercase tracking-[0.3em] font-black italic">
                  Status: Universal_Nominal
                </p>
                <p className="text-[8px] text-white/20 uppercase tracking-widest leading-loose">
                  Heuristic analysis complete.<br/>Zero anomalous vectors detected.
                </p>
              </div>
            </motion.div>
          ) : (
            notifications.map((n) => {
              const severity = (n.type ?? 'info') as SignalSeverity;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  className={cn(
                    "p-4 rounded-sm border bg-[#080808]/90 backdrop-blur-md flex items-start gap-4 group transition-all relative",
                    severity === 'error' ? "border-rose-500/30 bg-rose-500/[0.02]" :
                    severity === 'warning' ? "border-amber-500/20" : "border-white/5"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-sm bg-black border",
                    severity === 'error' ? "border-rose-500/40" : "border-white/10"
                  )}>
                    {SIGNAL_ICONS[severity]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                        severity === 'error' ? "bg-rose-500/20 text-rose-500" : 
                        severity === 'warning' ? "bg-amber-500/10 text-amber-500" : 
                        "bg-cyan-500/10 text-cyan-400"
                      )}>
                        {severity}_LOG
                      </span>
                      <span className="text-[8px] text-white/10 font-mono tracking-widest font-bold">
                        T+{timestampTelemetry(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed font-medium selection:bg-cyan-500/30">
                      {n.message}
                    </p>
                  </div>

                  <button
                    onClick={() => terminateSignal(n.id)}
                    className="shrink-0 p-1.5 text-white/5 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: KERNEL TELEMETRY FOOTER */}
      <div className="shrink-0 p-4 border-t border-white/5 flex justify-between items-center bg-black/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.02] to-transparent pointer-events-none" />
        <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/10">
          Uplink: AOXC_NEURAL_DISPATCHER
        </span>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-mono text-cyan-500/80 uppercase font-bold tracking-tighter">
              Node_Encrypted
            </span>
            <span className="text-[6px] text-white/20 uppercase font-black">v3.6.0-PRO</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]" />
        </div>
      </div>
    </div>
  );
};
