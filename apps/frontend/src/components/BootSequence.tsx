import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, Database, Terminal, Link2 } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Neural Boot Loader - Hybrid Final
 * @notice System initialization sequence for Multi-Chain (X Layer, Sui, Cardano).
 */

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const stepIndex = useRef(0);
  const isFinished = useRef(false);

  // Hibrit ağ yapısına uygun optimize edilmiş loglar
  const bootLines = [
    "AUTHENTICATING AOXCORE HYBRID KERNEL...",
    "ESTABLISHING X LAYER [EVM] GATEWAY...",
    "INITIALIZING SUI [MOVE-VM] PARALLEL ENGINE...",
    "SYNCING CARDANO [eUTXO] LEDGER STATE...",
    "MAPPING CROSS-CHAIN LIQUIDITY PATHS...",
    "LOADING AOXCAN NEURAL MODULES...",
    "CALIBRATING SENTINEL GUARD PROTOCOLS...",
    "STABILIZING TRIPLE-ASET VAULT INTERFACES...",
    "HYBRID SYSTEM ACTIVE. WELCOME OPERATOR."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const processStep = () => {
      // Eğer tüm adımlar bittiyse bitir
      if (stepIndex.current >= bootLines.length) {
        if (!isFinished.current) {
          isFinished.current = true;
          // UI döngüsünü korumak ve donmayı önlemek için requestAnimationFrame
          timer = setTimeout(() => {
            requestAnimationFrame(() => {
              onComplete();
            });
          }, 1000);
        }
        return;
      }

      const nextLine = bootLines[stepIndex.current];
      
      // State güncellemelerini tek seferde yap
      setSteps(prev => [...prev, nextLine].slice(-7)); // Son 7 satırı tut, hafızayı yorma
      setProgress(((stepIndex.current + 1) / bootLines.length) * 100);
      
      stepIndex.current += 1;

      // Dinamik gecikme: Ağ adımlarında daha ciddi bir his için bekleme süresini artır
      const isNetworkStep = nextLine.includes('[');
      const delay = isNetworkStep ? 750 : 180 + Math.random() * 150;
      
      timer = setTimeout(processStep, delay);
    };

    // İlk adımı başlat
    timer = setTimeout(processStep, 500);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center font-mono text-cyan-500 overflow-hidden"
    >
      {/* Background Ambience / Scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-50 opacity-20" />
      
      <div className="w-full max-w-lg p-10 relative z-10">
        
        {/* Triple-Orbit Central Core */}
        <div className="flex items-center justify-center mb-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Pulsing Glow Rings */}
            <div className="absolute inset-[-30px] border border-cyan-500/10 rounded-full animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-[-15px] border border-cyan-500/20 rounded-full animate-pulse" />
            
            <div className="w-28 h-28 border-2 border-cyan-500/30 rounded-full flex items-center justify-center bg-cyan-950/20 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.2)]">
              <ShieldCheck size={48} className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
            </div>
            
            {/* Multi-Chain Orbitals */}
            <OrbitIcon icon={Zap} duration={7} radius={70} rotation={0} color="text-amber-500" label="XLYR" />
            <OrbitIcon icon={Link2} duration={10} radius={70} rotation={120} color="text-blue-400" label="SUI" />
            <OrbitIcon icon={Cpu} duration={13} radius={70} rotation={240} color="text-cyan-400" label="ADA" />
          </motion.div>
        </div>

        {/* Diagnostic Terminal View */}
        <div className="bg-black/80 rounded-2xl border border-white/5 backdrop-blur-xl p-6 mb-8 shadow-2xl overflow-hidden relative border-t-cyan-500/20 min-h-[220px]">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {steps.map((step, i) => (
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-[9px] text-cyan-900 font-bold shrink-0">
                    {new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 1 })}
                  </span>
                  <span className={cn(
                    "text-[10px] tracking-[0.2em] font-medium uppercase",
                    i === steps.length - 1 ? "text-white" : "text-cyan-500/30"
                  )}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Scanning Line Effect inside terminal */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent h-10 w-full animate-[scan_3s_linear_infinite] pointer-events-none" />
        </div>

        {/* Final Progress Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.4em] text-cyan-500/40 font-bold">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="animate-pulse" />
              <span>Hybrid_Consensus_Link</span>
            </div>
            <span className="text-cyan-400">{Math.round(progress)}%</span>
          </div>

          <div className="h-1 bg-cyan-950/40 rounded-full p-[1px] border border-white/5 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-[8px] text-cyan-900 font-black tracking-widest uppercase">AOXCORE-OS // MULTI-VM_REV_3.1</span>
            <div className="flex gap-3">
              <span className="text-[8px] text-amber-600/60 font-bold tracking-tighter">EVM.ACTIVE</span>
              <span className="text-[8px] text-blue-600/60 font-bold tracking-tighter">MOVE.READY</span>
              <span className="text-[8px] text-cyan-600/60 font-bold tracking-tighter">UTXO.SYNC</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* Orbit Icon Sub-Component */
const OrbitIcon: React.FC<{ icon: any; duration: number; radius: number; rotation: number; color: string; label: string }> = ({ 
  icon: Icon, duration, radius, rotation, color, label 
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    className="absolute inset-0 pointer-events-none"
    style={{ rotate: rotation }}
  >
    <div 
      className={cn(
        "absolute bg-black border border-white/10 p-2 rounded-lg shadow-2xl flex flex-col items-center gap-1",
        color
      )}
      style={{ 
        top: `-${radius}px`, 
        left: '50%', 
        transform: 'translateX(-50%)' 
      }}
    >
      <Icon size={14} />
      <span className="text-[6px] font-black text-white/40">{label}</span>
    </div>
  </motion.div>
);
