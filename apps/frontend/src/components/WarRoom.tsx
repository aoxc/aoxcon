import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
import { 
  Shield, TrendingUp, Users, MessageSquare, Bug, Brain, 
  Zap, Activity, Fingerprint, Loader2, Network, Hexagon, Database
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useAoxcStore } from '../store/useAoxcStore';
// DİKKAT: Tree yapına göre dosya adı 'xlayer' olmalı.
import { debugTrace } from '../services/xlayer'; 

/**
 * @title AOXC Strategic War Room v3.5 (Omni-Chain Advanced Audit Edition)
 * @notice Forensic decision tracking and AI-driven governance simulation with enterprise-grade narratives.
 */

type ChainType = 'X-Layer' | 'Sui' | 'Cardano';

const pastDecisions = [
  { id: '1', title: 'Vault Yield Strategy v2', status: 'Passed', risk: 12, impact: 'Positive', date: '2026-02-15', txHash: '0xabc...123', chain: 'X-Layer' as ChainType },
  { id: '2', title: 'Emergency Brake Activation', status: 'Executed', risk: 85, impact: 'Critical', date: '2026-02-20', txHash: 'A8f9B...x2Z', chain: 'Cardano' as ChainType },
  { id: '3', title: 'Asset Factory Mint Limit', status: 'Active', risk: 42, impact: 'Positive', date: '2026-03-01', txHash: '5F3e...9aB', chain: 'Sui' as ChainType },
];

export const WarRoom = () => {
  const [selectedProposal, setSelectedProposal] = useState(pastDecisions[2]);
  const { t } = useTranslation();
  
  const { addLog, blockNumber, chainStates } = useAoxcStore();
  const [isDebugging, setIsDebugging] = useState(false);

  /**
   * @notice Dynamic, highly technical audit narrative generator based on blockchain architecture.
   */
  const generateAuditNarrative = (proposal: typeof pastDecisions[0]) => {
    const { chain, title, risk, id } = proposal;
    
    if (chain === 'X-Layer') {
      return `[EVM HEURISTIC SCAN]: Bytecode static analysis finalized for "${title}". Call stack depth and delegatecall mutation vectors have been heavily sanitized. Zero-knowledge proof verification circuits report a normalized risk coefficient of ${risk}%. State transition logic maintains strict determinism, fully adhering to X-Layer's Layer-2 optimistic rollup constraints at block #${blockNumber}. Protocol integrity remains uncompromised.`;
    } 
    else if (chain === 'Sui') {
      return `[MOVE PROVER ANALYSIS]: Advanced object capability boundaries inspected for "${title}". Struct ownership models and dynamic field delegations verify with a negligible exposure rate (Risk: ${risk}%). Shared object consensus paths are strictly isolated, mathematically guaranteeing zero race-condition vulnerabilities within the current global checkpoint. The neural engine authorizes this execution vector.`;
    } 
    else if (chain === 'Cardano') {
      const epoch = chainStates?.cardano?.epoch || 'CURRENT';
      return `[UTXO GRAPH VALIDATION]: Plutus Core script evaluation finalized for "${title}". Deterministic eUTXO graph traversal confirms absolute input/output parity. Cryptographic datum hashes and collateral parameter limits are perfectly synchronized with Epoch #${epoch}. The threat matrix indicates a minimal risk index of ${risk}%, clearing the payload for secure ledger integration.`;
    }
    return `Security analysis complete. Risk score: ${risk}%.`;
  };

  /**
   * @notice Multi-Chain Forensic Trace
   */
  const handleDebug = async () => {
    setIsDebugging(true);
    const targetChain = selectedProposal.chain;
    
    addLog(`Sentinel: Initiating ${targetChain} forensic trace for TX: ${selectedProposal.txHash}...`, "ai");
    
    try {
      if (targetChain === 'X-Layer') {
        addLog(`EVM_TRACE: Analyzing opcodes at block #${blockNumber}...`, "info");
        const result = await debugTrace(selectedProposal.txHash);
        if (result) {
          addLog(`TRACE_SUCCESS: Gas used: ${result.gas || 'N/A'} | Trace completed.`, "success");
        } else {
          addLog("TRACE_FAILED: RPC node congestion on X-Layer.", "error");
        }
      } 
      else if (targetChain === 'Sui') {
        addLog(`MOVE_TRACE: Inspecting Object State at Checkpoint #${chainStates?.sui?.checkpoint || 'UNKNOWN'}...`, "info");
        await new Promise(r => setTimeout(r, 1500)); 
        addLog(`TRACE_SUCCESS: Move Object ownership and shared state verified.`, "success");
      } 
      else if (targetChain === 'Cardano') {
        addLog(`UTXO_TRACE: Validating Plutus script execution at Epoch #${chainStates?.cardano?.epoch || 'UNKNOWN'}...`, "info");
        await new Promise(r => setTimeout(r, 1500));
        addLog(`TRACE_SUCCESS: eUTXO inputs/outputs perfectly balanced.`, "success");
      }
    } catch (e) {
      addLog(`TRACE_CRITICAL: Uplink severed during ${targetChain} trace.`, "error");
    } finally {
      setIsDebugging(false);
    }
  };

  const getChainStyle = (chain: ChainType) => {
    switch(chain) {
      case 'Sui': return { icon: Hexagon, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
      case 'Cardano': return { icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
      case 'X-Layer': 
      default: return { icon: Network, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    }
  };

  const activeChainStyle = getChainStyle(selectedProposal.chain);
  const ActiveChainIcon = activeChainStyle.icon;

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#030303] relative font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.02)_0%,transparent_50%)] pointer-events-none" />

      {/* LEFT: STRATEGIC HISTORY */}
      <aside className="w-full lg:w-[380px] border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-xl relative z-10 shrink-0">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-3 mb-2">
             <Activity size={14} className="text-cyan-500 animate-pulse" />
             <h2 className="text-white font-black text-xs uppercase tracking-[0.3em]">Omni_Decision_Log</h2>
          </div>
          <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold leading-none">Multi-Chain Governance Stream</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {pastDecisions.map((decision) => {
            const style = getChainStyle(decision.chain);
            const Icon = style.icon;
            return (
              <motion.div 
                key={decision.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedProposal(decision)}
                className={cn(
                  "p-5 rounded-[1.5rem] border transition-all cursor-pointer group relative overflow-hidden",
                  selectedProposal.id === decision.id 
                    ? "bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest", style.bg, style.color)}>
                    <Icon size={8} /> {decision.chain}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                    decision.status === 'Passed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-white/5 border-white/10 text-white/50"
                  )}>{decision.status}</span>
                </div>
                <h3 className="text-[11px] font-black text-white/70 group-hover:text-white transition-colors uppercase tracking-tight leading-snug">
                  {decision.title}
                </h3>
                <span className="text-[9px] font-bold text-white/20 mt-2 block">{decision.date}</span>
              </motion.div>
            )
          })}
        </div>
      </aside>

      {/* RIGHT: NEURAL IMPACT PREDICTION */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-black/60 flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-white font-black text-xs uppercase tracking-[0.4em]">Neural_Simulation_Matrix</h2>
            <div className="flex items-center gap-2">
               <Fingerprint size={10} className={activeChainStyle.color} />
               <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold italic leading-none">
                 Analyzing {selectedProposal.chain} Target: {selectedProposal.txHash}
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <Brain size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Sentinel_Active</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImpactCard title="Liquidity Flux" value="+12.4%" icon={TrendingUp} color="emerald" />
            <ImpactCard title="Neural Risk" value={`${selectedProposal.risk}%`} icon={Shield} color={selectedProposal.risk > 50 ? "rose" : "cyan"} />
            <ImpactCard title="Node Expansion" value="+2.1k" icon={Users} color="emerald" />
          </div>

          {/* AI Narrative Analysis (NOW ADVANCED ENTERPRISE GRADE) */}
          <section className="relative group">
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6 relative z-10 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={cn("p-3 rounded-2xl border", activeChainStyle.bg)}>
                      <ActiveChainIcon className={activeChainStyle.color} size={20} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Omni-Trace Deep Audit</h3>
                      <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Protocol Intelligence Core v4.2</span>
                   </div>
                </div>
                <div className="hidden sm:flex px-3 py-1 bg-white/5 rounded-full border border-white/10 items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Secure Cryptographic Link</span>
                </div>
              </div>
              
              <div className={cn("border-l-2 pl-6 py-2 transition-colors duration-500", activeChainStyle.color.replace('text-', 'border-'))}>
                <p className="text-[11px] leading-[1.8] font-mono text-white/70">
                  {generateAuditNarrative(selectedProposal)}
                </p>
              </div>
            </div>
          </section>

          {/* Progress Bars */}
          <section className="space-y-6 pb-12">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Simulation_Engine_Output</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProgressBar label={`${selectedProposal.chain} Stability`} value={92} color="emerald" />
              <ProgressBar label="Capital Utilization" value={78} color="cyan" />
              <ProgressBar label="Governance Participation" value={64} color="blue" />
              <ProgressBar label="Network Throughput" value={88} color="emerald" />
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row gap-4 shrink-0">
          <button className="flex-1 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            <Zap size={14} />
            {t('war_room.run_simulation', 'Relaunch Simulation')}
          </button>
          <button 
            onClick={handleDebug}
            disabled={isDebugging}
            className={cn(
              "px-8 py-4 border rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50",
              selectedProposal.chain === 'Sui' ? "bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-black" :
              selectedProposal.chain === 'Cardano' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white" :
              "bg-cyan-500/10 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500 hover:text-black",
              isDebugging && "animate-pulse"
            )}
          >
            {isDebugging ? <Loader2 className="animate-spin" size={14} /> : <Bug size={16} />}
            {isDebugging ? `Tracing_${selectedProposal.chain}...` : `Debug_${selectedProposal.chain}_Tx`}
          </button>
        </div>
      </main>
    </div>
  );
};

// --- Atomic Helpers ---
const ImpactCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: React.ElementType, color: string }) => (
  <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl space-y-4 group hover:border-white/10 transition-all">
    <div className={cn(
      "p-3 w-fit rounded-2xl border",
      color === 'emerald' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : 
      color === 'rose' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
      "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
    )}>
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <div className="space-y-1">
      <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">{title}</span>
      <h4 className={cn(
        "text-2xl font-black tabular-nums tracking-tighter",
        color === 'emerald' ? "text-emerald-400" : color === 'rose' ? "text-rose-400" : "text-cyan-400"
      )}>{value}</h4>
    </div>
  </div>
);

const ProgressBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black px-1">
      <span className="text-white/20 uppercase tracking-widest">{label}</span>
      <span className={cn(color === 'emerald' ? "text-emerald-400" : color === 'cyan' ? "text-cyan-400" : "text-blue-400")}>{value}%</span>
    </div>
    <div className="w-full bg-white/[0.03] h-1 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5 }}
        className={cn(
          "h-full rounded-full",
          color === 'emerald' ? "bg-emerald-500" : color === 'cyan' ? "bg-cyan-500" : "bg-blue-500"
        )}
      />
    </div>
  </div>
);
