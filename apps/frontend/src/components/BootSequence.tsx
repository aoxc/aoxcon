import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, Terminal, Link2, Binary } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * @title AOXC Neural Boot Loader - Sovereign Edition
 * @notice Enhanced memory management and deterministic boot sequence.
 */

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const stepIndex = useRef(0);
  const isFinished = useRef(false);

  // AUDIT: Centralized boot definitions for structural integrity
  const bootLines = useMemo(() => [
    "AUTHENTICATING AOXCORE HYBRID KERNEL...",
    "ESTABLISHING X LAYER [EVM] GATEWAY...",
    "INITIALIZING SUI [MOVE-VM] PARALLEL ENGINE...",
    "SYNCING CARDANO [eUTXO] LEDGER STATE...",
    "MAPPING CROSS-CHAIN LIQUIDITY PATHS...",
    "LOADING AOXCAN NEURAL MODULES...",
    "CALIBRATING SENTINEL GUARD PROTOCOLS...",
    "STABILIZING TRIPLE-ASET VAULT INTERFACES...",
    "HYBRID SYSTEM ACTIVE. WELCOME OPERATOR."
  ], []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const processStep = () => {
      if (stepIndex.current >= bootLines.length) {
        if (!isFinished.current) {
          isFinished.current = true;
          // UI Buffer to allow state stabilization
          timer = setTimeout(() => {
            onComplete();
          }, 1200);
        }
        return;
      }

      const nextLine = bootLines[stepIndex.current];
      
      // OPTIMIZATION: Functional state update for batch processing
      setSteps(prev => [...prev, nextLine].slice(-6)); 
      setProgress(((stepIndex.current + 1) / bootLines.length) * 100);
      
      stepIndex.current += 1;

      // DYNAMIC DELAY: Network steps simulate high-integrity handshake
      const isNetworkStep = nextLine.includes('[');
      const delay = isNetworkStep ? 900 : 150 + Math.random() * 200;
      
      timer = setTimeout(processStep, delay);
    };

    timer = setTimeout(processStep, 600);

    return () => clearTimeout(timer);
  }, [onComplete, bootLines]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center font-mono text-cyan-500 overflow-hidden"
    >
      {/* Neural Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,transparent_70%)] opacity-50" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-lg p-10 relative z-10">
        
        {/* Triple-Orbit Central Core */}
        <div className="flex items-center justify-center mb-20 relative">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Pulsing Aura */}
            <div className="absolute inset-[-40px] border border-cyan-500/5 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-[-20px] border border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
            
            <div className="w-32 h-32 border border-cyan-500/30 rounded-full flex items-center justify-center bg-black backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.15)] relative z-20">
              <ShieldCheck size={54} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            </div>
            
            {/* Multi-Chain Orbitals */}
            <OrbitIcon icon={Zap} duration={8} radius={85} rotation={0} color="text-amber-500" label="XLYR" />
            <OrbitIcon icon={Link2} duration={12} radius={85} rotation={120} color="text-blue-400" label="SUI" />
            <OrbitIcon icon={Binary} duration={16} radius={85} rotation={240} color="text-cyan-400" label="ADA" />
          </motion.div>
        </div>

        {/* Diagnostic Terminal View */}
        <div className="bg-black/60 rounded-xl border border-white/5 backdrop-blur-2xl p-6 mb-8 shadow-3xl overflow-hidden relative border-t-cyan-500/30 min-h-[220px]">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {steps.map((step, i) => (
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: -5, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  className="flex items-start gap-4"
                >
                  <span className="text-[8px] text-cyan-900 font-bold pt-1">
                    [{new Date().getMilliseconds().toString().padStart(3, '0')}]
                  </span>
                  <span className={cn(
                    "text-[10px] tracking-[0.2em] font-medium uppercase leading-relaxed",
                    i === steps.length - 1 ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-cyan-500/20"
                  )}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* CRT Scanning Line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.05] to-transparent h-20 w-full animate-[scan_4s_linear_infinite] pointer-events-none" />
        </div>

        {/* Final Progress Indicator */}
        <div className="space-y-5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-cyan-500/50 font-black">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="animate-pulse" />
              <span>Sovereign_Link_Active</span>
            </div>
            <span className="text-white">{Math.round(progress)}%</span>
          </div>

          <div className="h-1 bg-white/5 rounded-full overflow-hidden p-[1px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-700 via-cyan-400 to-white shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut", duration: 0.4 }}
            />
          </div>

          <div className="flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
            <span className="text-[8px] text-cyan-800 font-black tracking-[0.3em] uppercase">AOXCORE-OS // REV_3.1</span>
            <div className="flex gap-4">
              {['EVM', 'MOVE', 'UTXO'].map(vm => (
                <span key={vm} className="text-[8px] text-cyan-500 font-bold border-b border-cyan-500/20">{vm}.OK</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
        "absolute bg-[#050505] border border-white/10 p-2.5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-1.5",
        color
      )}
      style={{ 
        top: `-${radius}px`, 
        left: '50%', 
        transform: 'translateX(-50%)' 
      }}
    >
      <Icon size={16} strokeWidth={2.5} />
      <span className="text-[7px] font-black text-white/30 tracking-widest">{label}</span>
    </div>
  </motion.div>
);
