'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Cpu, 
  Database, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { fetchOnChainSnapshot } from '@/lib/onchain';
import { cn } from '@/lib/utils';
import { getMarketSymbol } from '@/lib/network';
import { useDemo } from './DemoContext';

interface RightSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const { state } = useDemo();
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [tokenPrice, setTokenPrice] = useState('0.000000');
  const [priceChange, setPriceChange] = useState('0.00%');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOnChainSnapshot();
      setSnapshot(data);

      let ticker: any;
      const tickerRes = await fetch(`/api/ticker?network=${state.network}`, { cache: 'no-store' });
      if (tickerRes.ok) {
        ticker = await tickerRes.json();
      } else {
        const symbol = getMarketSymbol(state.network);
        const remoteTickerRes = await fetch(
          `${state.networkProfile.apiBaseUrl}/api/v1/market/ticker?symbol=${symbol}`,
          { cache: 'no-store' },
        );
        if (remoteTickerRes.ok) {
          ticker = await remoteTickerRes.json();
        }
      }

      if (ticker) {
        const livePrice = Number(ticker.lastPrice || ticker.price || 0);
        const liveChange = Number(ticker.priceChangePercent || ticker.change24h || 0);
        setTokenPrice(livePrice.toFixed(6));
        setPriceChange(`${liveChange >= 0 ? '+' : ''}${liveChange.toFixed(2)}%`);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [state.network, state.networkProfile.apiBaseUrl]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 1 minute

    return () => {
      clearInterval(interval);
    };
  }, [loadData]);

  if (!snapshot && loading) {
    return (
      <aside className={cn(
        "flex flex-col w-80 h-screen fixed right-0 top-0 bg-aox-dark/95 backdrop-blur-xl border-l border-white/10 z-[70] p-6 items-center justify-center transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <RefreshCw className="w-8 h-8 text-aox-blue animate-spin opacity-50" />
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "flex flex-col w-80 h-screen fixed right-0 top-0 bg-black/20 backdrop-blur-3xl border-l border-white/10 z-[70] overflow-y-auto custom-scrollbar transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-display font-bold tracking-widest text-white/40 uppercase">On-Chain Monitor</h2>
          <button 
            onClick={loadData}
            disabled={loading}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
          >
            <RefreshCw className={cn("w-4 h-4 text-aox-blue transition-all", loading && "animate-spin")} />
          </button>
        </div>

        {/* AOXC Token Price Widget */}
        <div className="aox-widget overflow-hidden border-aox-blue/20 glow-blue">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-aox-blue animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-aox-blue">AOXC Price</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-aox-green/30 text-aox-green bg-aox-green/10">
                {state.networkProfile.label}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 pt-2">
              <div className="flex items-end justify-between">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={tokenPrice}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display tracking-tight leading-none"
                  >
                    ${tokenPrice}
                  </motion.p>
                </AnimatePresence>
                <span className="text-xs font-bold text-aox-green">{priceChange}</span>
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-tighter">Live / {state.networkProfile.label}</span>
            </div>
          </div>
        </div>

        {/* Status Widget */}
        <div className="aox-widget overflow-hidden border-aox-green/20 glow-green">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", snapshot?.controls.paused ? "bg-red-500" : "bg-aox-green")} />
                <span className="text-xs font-medium uppercase tracking-wider">System Status</span>
              </div>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", 
                snapshot?.controls.paused ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-aox-green/30 text-aox-green bg-aox-green/10"
              )}>
                {snapshot?.controls.paused ? 'PAUSED' : 'ACTIVE'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase tracking-tighter">Chain ID</span>
                <p className="text-sm font-mono">{snapshot?.chainId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase tracking-tighter">Block</span>
                <p className="text-sm font-mono">{snapshot?.latestBlock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Widget */}
        <div className="aox-widget border-aox-blue/20 glow-blue">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-aox-blue">
              <Database className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Supply Metrics</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-white/40 uppercase">Total Supply</span>
                  <span className="text-[10px] text-aox-blue">AOXC</span>
                </div>
                <p className="text-lg font-display tracking-tight leading-none">
                  {Number(snapshot?.token.totalSupplyFormatted).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-white/40 uppercase">Initial Supply</span>
                </div>
                <p className="text-sm font-mono text-white/70">
                  {Number(snapshot?.token.initialSupplyFormatted).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mint Policy Widget */}
        <div className="aox-widget border-aox-green/20 glow-green">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-aox-green">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Mint Policy</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[10px] text-white/40 uppercase">Yearly Limit</span>
                <span className="text-xs font-mono">{Number(snapshot?.mintPolicy.yearlyMintLimitFormatted).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[10px] text-white/40 uppercase">Minted (YTD)</span>
                <span className="text-xs font-mono text-aox-green">{Number(snapshot?.mintPolicy.mintedThisYearFormatted).toLocaleString()}</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-white/40 uppercase">Last Mint</span>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Clock className="w-3 h-3 opacity-50" />
                  <span>{snapshot?.mintPolicy.lastMintFormatted || 'Never'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Widget */}
        <div className="aox-widget border-orange-500/20 glow-gold">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-orange-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Security Controls</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase">Daily Transfer Limit</span>
                <p className="text-sm font-mono">{Number(snapshot?.controls.dailyTransferLimitFormatted).toLocaleString()} AOXC</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase">Max Transfer Amount</span>
                <p className="text-sm font-mono">{Number(snapshot?.controls.maxTransferAmountFormatted).toLocaleString()} AOXC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proxy Info Widget */}
        <div className="aox-widget border-purple-500/20 glow-blue">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Proxy Architecture</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase">Implementation</span>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-mono truncate text-white/60">{snapshot?.proxy.implementation}</p>
                  <Lock className="w-3 h-3 text-white/20" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase">Proxy Admin</span>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-mono truncate text-white/60">{snapshot?.proxy.admin}</p>
                  <Shield className="w-3 h-3 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-white/20">
            <Info className="w-3 h-3" />
            <p>Data synchronized with X Layer Mainnet</p>
          </div>
          {lastUpdate && (
            <p className="text-[10px] text-white/20 italic">
              Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
