import React, { memo, useMemo, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Wallet, Globe, ChevronDown, Check, ShieldCheck, Activity } from 'lucide-react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import { Pulse } from './Pulse';
import { cn } from '../lib/utils';
import { useHeaderMarketData } from '../hooks/useHeaderMarketData';
import { useAoxcStore } from '../store/useAoxcStore';
import type { MarketTicker, SupportedSymbol } from '../services/market';

/**
 * @title AOXC Neural OS - Professional Header
 * @version 3.6.0-AUDIT
 * @notice Fixed Layout Shift & Reference Stability.
 */

interface HeaderProps {
  isOnline: boolean;
  latency: number;
}

const MARKET_ORDER: readonly SupportedSymbol[] = ['AOXC', 'OKB', 'SUI', 'ADA'] as const;

const formatters = {
  price: (price: number) => {
    if (!Number.isFinite(price) || price === 0) return '---';
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    });
  },
  change: (change: number) => {
    if (!Number.isFinite(change)) return '0.00%';
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  }
};

const TokenWidget = memo(({ ticker, isPrimary }: { ticker: MarketTicker; isPrimary?: boolean }) => {
  const isError = ticker.status === 'ERROR' || ticker.status === 'NO_DATA';
  
  return (
    <div className={cn(
      "flex items-center h-10 border rounded-lg transition-all duration-500 hover:bg-white/[0.04] shrink-0",
      isPrimary ? "bg-cyan-500/5 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]" : "bg-white/[0.02] border-white/5",
      isError && "border-rose-500/20 grayscale opacity-60"
    )}>
      <div className="px-3 border-r border-white/5 flex flex-col justify-center">
        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Asset</span>
        <span className="text-[11px] font-black text-white leading-none tracking-widest">{ticker.symbol}</span>
      </div>
      
      <div className="px-4 flex flex-col justify-center min-w-[95px]">
        <span className="text-[11px] font-mono font-bold text-white/90 leading-none mb-1 tabular-nums italic">
          {formatters.price(ticker.price)}
        </span>
        <span className={cn(
          "text-[8px] font-black leading-none tabular-nums",
          ticker.change24h > 0 ? "text-emerald-500" : "text-rose-500"
        )}>
          {formatters.change(ticker.change24h)}
        </span>
      </div>
    </div>
  );
});

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'tr', label: 'TR', full: 'Türkçe' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/[0.08] transition-all bg-black/40 group"
      >
        <Globe size={12} className="text-cyan-500 group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-black text-white/60 tracking-widest">{i18n.language.toUpperCase()}</span>
        <ChevronDown size={10} className={cn("text-white/20 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-32 bg-[#080808] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[101] p-1 overflow-hidden backdrop-blur-3xl"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all",
                    i18n.language === lang.code ? "bg-cyan-500/10 text-cyan-400" : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {lang.full}
                  {i18n.language === lang.code && <Check size={10} className="text-cyan-500" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ isOnline, latency }) => {
  const { data } = useHeaderMarketData(30_000);
  const { networkLoad } = useAoxcStore();
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return;
    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts?.[0]) setWalletAddress(accounts[0]);
    } catch (err) {
      console.warn("[HEADER] Auth Failure");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const shortAddress = useMemo(() => {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  return (
    <header className="h-20 shrink-0 flex items-center border-b border-white/5 bg-[#020202] relative z-50 select-none overflow-hidden">
      
      {/* 1. BRANDING & OS KERNEL STATUS */}
      <div className="w-80 px-8 flex flex-col border-r border-white/5 h-full justify-center bg-gradient-to-r from-cyan-500/[0.02] to-transparent">
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-cyan-500 animate-pulse" />
          <h1 className="font-black tracking-[0.6em] text-xs text-white uppercase">
            AOXC<span className="text-cyan-500">OS</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-1.5 opacity-40">
          <span className="text-[7px] font-mono font-black tracking-[0.3em] uppercase italic text-white">
            SYS_AUDIT_MODE: ENFORCED // KERNEL v3.2.1
          </span>
        </div>
      </div>

      {/* 2. REAL-TIME MARKET STRIP */}
      <div className="flex-1 flex items-center gap-3 px-6 overflow-x-auto no-scrollbar h-full bg-black/20">
        <AnimatePresence mode="popLayout">
          {MARKET_ORDER.map((symbol) => (
            data[symbol] && (
              <motion.div
                key={symbol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <TokenWidget ticker={data[symbol]} isPrimary={symbol === 'AOXC'} />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* 3. TELEMETRY & SYSTEM AUTH */}
      <div className="flex items-center gap-8 px-8 ml-auto border-l border-white/5 h-full bg-gradient-to-l from-white/[0.03] to-transparent">
        
        <div className="flex gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Gas_Priority</span>
            <div className="flex items-center gap-2">
              <Zap size={10} className="text-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono font-black text-white/90 tabular-nums">
                {networkLoad || '0.020000001 gwei'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end border-l border-white/5 pl-8">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Uplink_Status</span>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-700", 
                isOnline ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-rose-600 shadow-[0_0_10px_#e11d48]"
              )} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest tabular-nums", 
                isOnline ? "text-emerald-500" : "text-rose-600"
              )}>
                {isOnline ? `${latency}ms` : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 border-l border-white/5 pl-8 h-full">
          <LanguageSwitcher />

          {walletAddress ? (
            <div className="flex items-center gap-3 px-4 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl group hover:border-cyan-500/40 transition-all cursor-pointer">
              <ShieldCheck size={14} className="text-cyan-500 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-white/80 group-hover:text-cyan-400 uppercase tracking-tighter transition-colors">
                {shortAddress}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="relative flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all hover:bg-cyan-500 hover:text-white active:scale-95 disabled:opacity-50"
            >
              <Wallet size={14} />
              {isConnecting ? 'Handshaking...' : 'Init_Wallet'}
            </button>
          )}
        </div>
      </div>

      {/* FOOTER DECORATION */}
      <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none">
        <Pulse isOnline={isOnline} latency={latency} />
      </div>
    </header>
  );
};
