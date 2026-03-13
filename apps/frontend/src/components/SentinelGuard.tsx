import React, { useMemo } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Fingerprint, Eye, Zap, 
  Layers, Database, Cpu 
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Multi-Chain Sentinel Guard
 * @version 5.0.0-CROSS-CHAIN
 * @notice Unified Monitoring for X-Layer (EVM), Sui (Move), and Cardano (eUTXO).
 */

export const SentinelGuard: React.FC = () => {
  const { logs, activeNetwork, blockNumber } = useAoxcStore();

  // Audit Insight: Filter and Map Multi-Chain Telemetry
  const securityLogs = useMemo(() => 
    logs.filter(l => l.type === 'ai' || l.type === 'error' || l.type === 'warning')
        .slice(0, 15),
    [logs]
  );

  /**
   * @dev Her zincir için özel görsel kimlik ataması
   */
  const chainConfig = {
    'X-LAYER': { color: 'text-orange-500', icon: Layers, label: 'EVM_VALIDATOR' },
    'SUI':     { color: 'text-cyan-400',   icon: Database, label: 'MOVE_AUDITOR' },
    'CARDANO': { color: 'text-blue-500',   icon: Cpu,      label: 'UTXO_SCANNER' }
  };

  const currentChain = (activeNetwork as keyof typeof chainConfig) || 'X-LAYER';

  return (
    <div className="flex flex-col h-full bg-[#020202]/90 backdrop-blur-3xl border-l border-white/5 font-mono text-[10px] relative overflow-hidden">
      
      {/* 1. HEADER: Multi-Chain Status Matrix */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-black border border-white/10", chainConfig[currentChain].color)}>
              {React.createElement(chainConfig[currentChain].icon, { size: 18 })}
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.4em] font-black text-xs text-white">Sentinel_Guard</span>
              <span className={cn("text-[7px] font-bold uppercase tracking-widest", chainConfig[currentChain].color)}>
                {chainConfig[currentChain].label} // ACTIVE
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] text-white/20 uppercase font-black">Cluster_Uplink</span>
            <span className="text-[9px] text-emerald-500 font-bold animate-pulse">{activeNetwork || 'SYNCHRONIZING'}</span>
          </div>
        </div>

        {/* CROSS-CHAIN ENTROPY METRICS */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 flex flex-col gap-1">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Neural_Load</span>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-black">2.4<span className="text-[9px] opacity-30">ms</span></span>
                <Zap size={10} className="text-amber-500" />
              </div>
           </div>
           <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 flex flex-col gap-1">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Protocol_Depth</span>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-black uppercase">MULTI_Z</span>
                <Fingerprint size={10} className="text-cyan-500" />
              </div>
           </div>
        </div>
      </div>
      
      {/* 2. UNIFIED SIGNAL STREAM */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={10} className="text-white/20" />
          <span className="uppercase font-black tracking-[0.3em] text-[8px] text-white/20">Unified_Threat_Stream</span>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {securityLogs.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center opacity-20 italic">
               <ShieldCheck size={32} className="mb-4" />
               <span className="text-[8px] uppercase tracking-widest">Waiting for Multi-Chain Signals...</span>
            </div>
          ) : (
            securityLogs.map((log) => (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-4 rounded-xl border bg-black/40 backdrop-blur-md relative overflow-hidden",
                  log.type === 'error' ? "border-rose-500/30" : "border-white/10"
                )}
              >
                {/* Chain Identifier Tag */}
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-white/[0.03] border-l border-b border-white/5 text-[6px] text-white/30 font-black uppercase">
                  {log.chain || activeNetwork}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded",
                    log.type === 'error' ? "bg-rose-500/20 text-rose-500" : "bg-cyan-500/10 text-cyan-400"
                  )}>
                    {log.type}_INTERCEPT
                  </span>
                  <span className="text-[7px] text-white/10 font-mono italic">
                    #{log.id.slice(-6)}
                  </span>
                </div>

                <p className="text-[10px] text-white/60 leading-relaxed italic">
                  "{log.message}"
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[7px] text-white/20 font-black uppercase tracking-widest">
                   <span>Integrity_Hash: Verified</span>
                   <span className="text-emerald-500/50 font-mono">OK</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* 3. KERNEL FOOTER */}
      <div className="p-5 border-t border-white/5 bg-black/60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em]">CrossChain_Kernel</span>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-orange-500" title="X-Layer" />
             <div className="w-1 h-1 rounded-full bg-cyan-400" title="Sui" />
             <div className="w-1 h-1 rounded-full bg-blue-500" title="Cardano" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldAlert size={14} className="text-rose-500/40" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-white/60 uppercase">AOXCAN_HYBRID_CORE</span>
            <span className="text-[6px] text-white/20 uppercase font-black">Monitoring_Block: #{blockNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
