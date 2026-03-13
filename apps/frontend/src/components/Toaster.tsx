import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // motion/react yerine standart framer-motion
import { useAoxcStore } from '../store/useAoxcStore';
import { AlertCircle, CheckCircle2, Info, XCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Neural Toaster System
 * @version 4.0.0-AUDIT
 * @notice Neural OS Global Event Dispatcher.
 * @dev Implements non-blocking overlay for protocol telemetry feedback.
 */

// Sistem genelindeki bildirim tiplerini tanımlıyoruz
type TelemetryType = 'info' | 'warning' | 'error' | 'success' | 'ai';

export const Toaster: React.FC = () => {
  const { notifications, setNotifications } = useAoxcStore();

  /**
   * @audit AUTO_PURGE_PROTOCOL
   * Ensures the UI stack does not overflow during high-frequency network events.
   */
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        // En eski sinyali (FIFO - First In First Out) kuyruktan temizle
        setNotifications((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, setNotifications]);

  const ICON_MAP: Record<TelemetryType, React.ReactNode> = {
    info: <Info size={16} className="text-cyan-500" />,
    warning: <AlertCircle size={16} className="text-amber-500" />,
    error: <XCircle size={16} className="text-rose-500" />,
    success: <CheckCircle2 size={16} className="text-emerald-500" />,
    ai: <ShieldAlert size={16} className="text-purple-400" />
  };

  return (
    // fixed ve yüksek z-index ile her şeyin üzerinde, ancak pointer-events-none ile altındaki butonlara engel olmaz
    <div className="fixed top-24 right-8 z-[9999] flex flex-col gap-3 pointer-events-none max-w-[380px] w-full font-mono">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ x: 50, opacity: 0, filter: 'blur(10px)' }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ x: 100, opacity: 0, scale: 0.9 }}
            className={cn(
              "relative p-4 rounded-xl border bg-[#050505]/95 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-start gap-4 pointer-events-auto group overflow-hidden",
              n.type === 'info' ? "border-cyan-500/30" :
              n.type === 'warning' ? "border-amber-500/30" :
              n.type === 'error' ? "border-rose-500/30" :
              "border-emerald-500/30"
            )}
          >
            {/* PROGRESS_TELEMETRY: Time-to-live visualizer */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 h-[1px] opacity-60 shadow-[0_0_10px_currentcolor]",
                n.type === 'info' ? "bg-cyan-500" :
                n.type === 'warning' ? "bg-amber-500" :
                n.type === 'error' ? "bg-rose-500" :
                "bg-emerald-500"
              )}
            />

            {/* SYMBOLIC_SIGNAL */}
            <div className={cn(
              "p-2.5 rounded-lg shrink-0 border border-white/5",
              n.type === 'info' ? "bg-cyan-500/10" :
              n.type === 'warning' ? "bg-amber-500/10" :
              n.type === 'error' ? "bg-rose-500/10" :
              "bg-emerald-500/10"
            )}>
              {ICON_MAP[n.type as TelemetryType] || ICON_MAP.info}
            </div>
            
            {/* CONTENT_TELEMETRY */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.03] pb-1.5 mb-2">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em]",
                  n.type === 'info' ? "text-cyan-400" :
                  n.type === 'warning' ? "text-amber-400" :
                  n.type === 'error' ? "text-rose-400" :
                  "text-emerald-400"
                )}>
                  {n.type}_SIGNAL
                </span>
                <span className="text-[7px] text-white/20 font-bold uppercase tracking-tighter">
                  Sec_Link_Active
                </span>
              </div>
              <p className="text-[10px] text-white/70 leading-relaxed font-medium">
                {n.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
