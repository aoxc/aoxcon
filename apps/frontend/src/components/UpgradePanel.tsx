import React, { useState } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'framer-motion'; // motion/react yerine framer-motion (standart)
import { 
  X, RefreshCw, 
  ShieldCheck, Cpu, Zap 
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Neural OS Upgrade Controller
 * @notice Interface for executing UUPS-compliant module upgrades (EIP-1822).
 * @version 4.1.0-AUDIT
 */

export const UpgradePanel: React.FC = () => {
  const { upgradeAvailable, dismissUpgrade, addLog, blockNumber } = useAoxcStore();
  const [isUpgrading, setIsUpgrading] = useState(false);

  /**
   * @notice Orchestrates the upgrade flow through the Sentinel AI gate.
   * @dev This simulates the atomic swap of the implementation contract pointer.
   */
  const handleUpgrade = async () => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    addLog('CRITICAL_EVENT: Initiating AoxcFactory V2 implementation swap...', 'warning');
    
    // AI Audit & Blockchain Confirmation Simulation
    setTimeout(() => {
      addLog('SENTINEL_AI: Verification of V2 bytecode successful. Integrity Hash: 0x56a6...0800', 'info');
      addLog(`AOXC_CORE: Atomic upgrade committed to block #${blockNumber + 1}`, 'success');
      
      setIsUpgrading(false);
      dismissUpgrade(); // Paneli kapat
    }, 2800);
  };

  return (
    <AnimatePresence>
      {upgradeAvailable && (
        <motion.div
          initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
          className="w-full relative group"
        >
          {/* Main Card Container */}
          <div className="bg-[#080808]/80 border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl">
            
            {/* Top Scanning Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
               <motion.div 
                 initial={{ x: "-100%" }} 
                 animate={{ x: "100%" }} 
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="w-1/3 h-full bg-cyan-500/50 shadow-[0_0_10px_#06b6d4]" 
               />
            </div>

            <div className="flex items-start gap-4 relative z-10">
              {/* Module Icon HUD */}
              <div className="relative shrink-0">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700",
                  isUpgrading 
                    ? "bg-cyan-500/20 border-cyan-500 animate-pulse" 
                    : "bg-white/[0.03] border-white/10 group-hover:border-cyan-500/40"
                )}>
                  <Cpu className={cn("text-cyan-500", isUpgrading && "animate-spin")} size={22} />
                </div>
                {!isUpgrading && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full border-2 border-[#080808] animate-bounce" />
                )}
              </div>

              {/* Content Engine */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em]">Sys_Update_Detected</span>
                  <button onClick={dismissUpgrade} className="text-white/10 hover:text-rose-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
                
                <h4 className="text-white font-bold text-sm tracking-tight">
                  AoxcFactory V2.0.0
                </h4>
                
                <p className="text-[10px] text-white/40 leading-relaxed font-mono">
                  Autonomous deployment of the <span className="text-cyan-500/60 font-bold">Cellular Registry</span>. 
                  Improves reputation matrix latency.
                </p>
              </div>
            </div>

            {/* Technical Metadata Box */}
            <div className="mt-4 bg-black/40 p-3 rounded-lg border border-white/5 space-y-2">
               <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/20">
                  <span>Logic_Address</span>
                  <span className="text-white/60">0x71C...3A2</span>
               </div>
               <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/20">
                  <span>Proxy_Protocol</span>
                  <span className="text-cyan-400/80">UUPS (EIP-1822)</span>
               </div>
            </div>

            {/* Action Matrix */}
            <div className="mt-5 flex items-center gap-2">
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className={cn(
                  "flex-1 relative flex items-center justify-center gap-2 py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all overflow-hidden",
                  isUpgrading 
                    ? "bg-white/5 text-white/20 cursor-wait" 
                    : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95 shadow-[0_5px_15px_rgba(6,182,212,0.2)]"
                )}
              >
                {isUpgrading ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Committing...
                  </>
                ) : (
                  <>
                    <Zap size={12} />
                    Commit Implementation
                  </>
                )}
              </button>
              
              <button 
                onClick={() => addLog("UPGRADE_TRACE: Implementation inspection initiated.", "info")}
                className="px-4 py-3 bg-white/[0.02] border border-white/5 text-white/30 rounded-lg text-[9px] font-bold uppercase hover:bg-white/5 transition-all"
              >
                Trace
              </button>
            </div>
          </div>

          {/* Validation Aura */}
          <div className="mt-3 flex justify-center items-center gap-2 opacity-40">
             <ShieldCheck size={10} className="text-emerald-500" />
             <span className="text-[7px] font-mono text-white/50 uppercase tracking-[0.15em] italic">
               Hardware Wallet Auth Required
             </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
