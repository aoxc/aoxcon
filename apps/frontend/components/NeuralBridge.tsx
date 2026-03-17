'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, ArrowRightLeft, Zap, Shield, Globe, Activity, Layers, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

const bridgeStats = [
  { label: '24h Volume', value: '$12.4M', change: '+12.5%', color: 'text-aox-blue' },
  { label: 'Neural Quorum', value: '12/12', change: 'Stable', color: 'text-aox-green' },
  { label: 'Finality Time', value: '1.2s', change: '-0.4s', color: 'text-aox-gold' },
  { label: 'Confidence', value: '99.99%', change: 'Max', color: 'text-purple-400' },
];

const recentTransfers = [
  { id: '0x...a1b2', from: 'X Layer', to: 'Sui', amount: '25,000 AOXC', status: 'Finalized', time: '2m ago' },
  { id: '0x...c3d4', from: 'Sui', to: 'X Layer', amount: '120,000 USDC', status: 'Processing', time: '45s ago' },
  { id: '0x...e5f6', from: 'X Layer', to: 'Sui', amount: '5,000 AOXC', status: 'Finalized', time: '5m ago' },
];

export default function NeuralBridge() {
  const [activeParticles, setActiveParticles] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveParticles(prev => {
        const next = [...prev, Math.floor(Math.random() * 5)];
        if (next.length > 5) next.shift();
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">Neural Bridge</h2>
        <p className="text-white/50 max-w-2xl text-sm break-words">Cross-chain coordination layer syncing X Layer and Sui ecosystems with sub-second finality.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bridgeStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="aox-widget group"
          >
            <div className="aox-card-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-12 h-12" />
              </div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className={cn("text-[10px] font-bold uppercase tracking-widest", stat.color)}>
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 aox-widget relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
          <div className="aox-card-inner w-full flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,112,243,0.05),transparent_70%)]" />
            
            <div className="relative z-10 flex items-center justify-between w-full max-w-2xl">
              {/* X Layer Node */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-aox-blue/20 border border-aox-blue/50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-aox-blue/20 blur-xl animate-pulse" />
                  <Layers className="w-10 h-10 text-aox-blue relative z-10" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest">X Layer</p>
                  <p className="text-[10px] text-white/40 font-mono">EVM / ZK</p>
                </div>
              </div>

              {/* Bridge Hub */}
              <div className="flex-1 px-8 relative h-20 flex items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-aox-blue via-aox-green to-purple-500 opacity-30" />
                
                <AnimatePresence>
                  {activeParticles.map((p, i) => (
                    <motion.div
                      key={`${p}-${i}`}
                      initial={{ left: '0%', opacity: 0 }}
                      animate={{ left: '100%', opacity: [0, 1, 0] }}
                      transition={{ duration: 2, ease: "linear" }}
                      className="absolute w-2 h-2 rounded-full bg-aox-green shadow-[0_0_10px_#00FF41]"
                    />
                  ))}
                </AnimatePresence>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full bg-aox-surface border border-aox-green/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                    <Share2 className="w-6 h-6 text-aox-green animate-spin-slow" />
                  </div>
                </div>
              </div>

              {/* Sui Node */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse" />
                  <Server className="w-10 h-10 text-purple-500 relative z-10" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest">Sui</p>
                  <p className="text-[10px] text-white/40 font-mono">Move / DAG</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-12 relative z-10">
              <div className="text-center">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Active Relayers</p>
                <p className="text-xl font-bold">128</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Queue Depth</p>
                <p className="text-xl font-bold">0</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Avg Fee</p>
                <p className="text-xl font-bold text-aox-green">$0.002</p>
              </div>
            </div>
          </div>
        </div>

        <div className="aox-widget">
          <div className="aox-card-inner">
            <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
              <ArrowRightLeft className="w-5 h-5 text-aox-gold" />
              Recent Transfers
            </h3>
            <div className="space-y-6">
              {recentTransfers.map((tx, i) => (
                <div key={tx.id} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors">{tx.id}</span>
                    <span className="text-[10px] font-mono text-white/40">{tx.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{tx.from}</span>
                      <Zap className="w-3 h-3 text-white/20" />
                      <span className="text-xs font-bold">{tx.to}</span>
                    </div>
                    <span className="text-xs font-bold text-aox-green">{tx.amount}</span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: tx.status === 'Finalized' ? '100%' : '65%' }}
                      className={cn(
                        "h-full rounded-full",
                        tx.status === 'Finalized' ? "bg-aox-green" : "bg-aox-gold animate-pulse"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="aox-button w-full mt-8 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
              View All Transfers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
