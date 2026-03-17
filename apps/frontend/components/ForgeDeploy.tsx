'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileCode, Shield, Rocket, Search, Code2, Globe, CheckCircle2, AlertTriangle, Terminal, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const templates = [
  { name: 'Standard ERC-20', chain: 'EVM', complexity: 'Low' },
  { name: 'Sui Move Object', chain: 'Move', complexity: 'Medium' },
  { name: 'Plutus V2 Validator', chain: 'Cardano', complexity: 'High' },
  { name: 'Cross-Chain Bridge', chain: 'Multichain', complexity: 'Extreme' },
];

export default function ForgeDeploy() {
  const [code, setCode] = useState(`// AOXCHAIN Forge v1.0
// Multichain Contract Template

contract AOXIntelligence {
    mapping(address => uint256) public synapsePower;
    
    function boost(address agent) public {
        synapsePower[agent] += 1;
    }
}`);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | 'secure' | 'warning'>(null);

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('secure');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">FORGE & DEPLOY</h2>
        <p className="text-white/50 max-w-2xl text-sm break-words">The ultimate developer playground. Write, scan, and deploy multichain contracts in seconds on AOXCHAIN.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="aox-widget">
            <div className="aox-card-inner !p-6">
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6">Templates</h3>
              <div className="space-y-2">
                {templates.map((t) => (
                  <button 
                    key={t.name}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold group-hover:text-aox-blue transition-colors">{t.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-white/40">{t.chain}</span>
                      <span className={cn(
                        "text-[10px] font-bold",
                        t.complexity === 'Low' ? "text-aox-green" : "text-aox-gold"
                      )}>{t.complexity}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="aox-widget">
            <div className="aox-card-inner !p-6 space-y-4">
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Networks</h3>
              <div className="space-y-3">
                {['X Layer (EVM)', 'Sui Mainnet', 'Cardano Preprod'].map((net) => (
                  <label key={net} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-white/20 group-hover:border-aox-blue transition-colors flex items-center justify-center">
                      <div className="w-2 h-2 bg-aox-blue rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">{net}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="aox-widget overflow-hidden border-white/10 flex flex-col h-[600px]">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-aox-gold/50" />
                  <div className="w-3 h-3 rounded-full bg-aox-green/50" />
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ForgeEditor.sol</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-all disabled:opacity-50"
                >
                  {isScanning ? <Terminal className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                  SECURITY SCAN
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-aox-blue text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-aox-blue/80 transition-all">
                  <Rocket className="w-3 h-3" />
                  DEPLOY NOW
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full p-8 bg-black/40 font-mono text-sm text-white/80 outline-none resize-none selection:bg-aox-blue/30"
                spellCheck={false}
              />
              
              <AnimatePresence>
                {scanResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-8 right-8 aox-widget border-aox-green/50 bg-aox-green/5 max-w-sm shadow-2xl shadow-aox-green/10"
                  >
                    <div className="aox-card-inner !p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-aox-green/20 text-aox-green">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-aox-green uppercase tracking-tight">Audit Complete</h4>
                          <p className="text-[10px] text-white/60 mt-1 leading-relaxed">
                            No critical vulnerabilities found. Contract adheres to aoxchain-evm security standards.
                          </p>
                          <div className="mt-4 flex gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            <span>Gas: ~42,000</span>
                            <span>Complexity: O(1)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aox-widget group cursor-pointer">
              <div className="aox-card-inner !p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-aox-gold/10 text-aox-gold">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight">SDK Integration</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Connect your Forge to external dev tools.</p>
                </div>
                <button className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="aox-widget group cursor-pointer">
              <div className="aox-card-inner !p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-aox-blue/10 text-aox-blue">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight">Block Explorer</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Track your deployments in real-time.</p>
                </div>
                <button className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

