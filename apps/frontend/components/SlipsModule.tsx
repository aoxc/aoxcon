'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Zap, Layers, RefreshCcw } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

const liquidityData = [
  { time: '00:00', depth: 4000, volume: 2400 },
  { time: '04:00', depth: 4500, volume: 3200 },
  { time: '08:00', depth: 4200, volume: 2800 },
  { time: '12:00', depth: 5000, volume: 4500 },
  { time: '16:00', depth: 5500, volume: 3800 },
  { time: '20:00', depth: 5200, volume: 4100 },
  { time: '23:59', depth: 6000, volume: 5200 },
];

const pools = [
  { name: 'AOX / XLAYER', tvl: '$4.2M', apr: '24.5%', status: 'Optimal' },
  { name: 'AOX / SUI', tvl: '$2.8M', apr: '32.1%', status: 'High Yield' },
  { name: 'USDC / AOX', tvl: '$1.5M', apr: '12.4%', status: 'Stable' },
];

export default function SlipsModule() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">SLIPS</h2>
        <p className="text-white/50 max-w-2xl text-sm break-words">Sovereign Liquidity Injection & Provisioning System. Managing cross-chain depth and automated market making on AOXCHAIN.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="aox-widget relative overflow-hidden">
            <div className="aox-card-inner !p-8">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Droplets className="w-32 h-32 text-aox-blue" />
              </div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-display-md !text-xl">Liquidity Depth Analysis</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-aox-blue" />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Depth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-aox-green" />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Volume</span>
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full relative z-10">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={liquidityData}>
                      <defs>
                        <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0070F3" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0070F3" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Area type="monotone" dataKey="depth" stroke="#0070F3" fillOpacity={1} fill="url(#colorDepth)" />
                      <Area type="monotone" dataKey="volume" stroke="#00FF41" fillOpacity={1} fill="url(#colorVolume)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pools.map((pool, i) => (
              <motion.div
                key={pool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aox-widget group cursor-pointer"
              >
                <div className="aox-card-inner !p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-bold group-hover:text-aox-blue transition-colors uppercase tracking-tight">{pool.name}</h4>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                      pool.status === 'Optimal' ? "bg-aox-green/10 text-aox-green" : "bg-aox-gold/10 text-aox-gold"
                    )}>
                      {pool.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">TVL</p>
                      <div className="text-xl font-bold">{pool.tvl}</div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">APR</p>
                      <div className="text-xl font-bold text-aox-green">{pool.apr}</div>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5">
                    Manage Pool
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="aox-widget border-aox-green/20">
            <div className="aox-card-inner !p-8">
              <h3 className="text-display-md !text-lg mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-aox-green" />
                Auto-Provisioning
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">Dynamic Rebalancing</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">AI-driven weight adjustment</p>
                  </div>
                  <div className="w-10 h-6 bg-aox-green/20 rounded-full relative cursor-pointer border border-aox-green/30">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-aox-green rounded-full shadow-[0_0_10px_#00FF41]" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">Slippage Guard</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Max 0.1% protection</p>
                  </div>
                  <div className="w-10 h-6 bg-aox-green/20 rounded-full relative cursor-pointer border border-aox-green/30">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-aox-green rounded-full shadow-[0_0_10px_#00FF41]" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-aox-gold/5 border border-aox-gold/20">
                  <div className="flex items-center gap-2 mb-2 text-aox-gold">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency Alert</span>
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-widest">
                    Liquidity depth on Sui is 14% below target. SLIPS is preparing an injection from X Layer treasury.
                  </p>
                  <button className="mt-4 w-full py-2 bg-aox-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-aox-gold/80 transition-all">
                    Authorize Injection
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="aox-widget">
            <div className="aox-card-inner !p-8">
              <h3 className="text-display-md !text-lg mb-6">System Health</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                    <span>Oracle Sync</span>
                    <span className="text-aox-green">99.9%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-aox-green w-[99.9%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                    <span>Bridge Latency</span>
                    <span className="text-aox-green">1.2s</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-aox-green w-[85%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                    <span>Quorum Consensus</span>
                    <span className="text-aox-green">Active</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-aox-green w-full" />
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 flex items-center justify-center gap-2 py-2 text-[10px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                <RefreshCcw className="w-4 h-4" /> Refresh Diagnostics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
