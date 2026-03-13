import React, { memo, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Check, ChevronDown, Globe, ShieldCheck, Wallet, Zap } from 'lucide-react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import { cn } from '../lib/utils';
import { useHeaderMarketData } from '../hooks/useHeaderMarketData';
import { useAoxcStore } from '../store/useAoxcStore';
import type { MarketTicker, SupportedSymbol } from '../services/market';

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
    <div
      className={cn(
        'flex items-center h-11 border rounded-xl transition-all duration-300 hover:bg-white/[0.06] shrink-0',
        isPrimary ? 'bg-cyan-500/10 border-cyan-400/30' : 'bg-white/[0.03] border-white/10',
        isError && 'border-rose-500/30 grayscale opacity-70'
      )}
    >
    <div className={cn(
      'flex items-center h-11 border rounded-xl transition-all duration-300 hover:bg-white/[0.06] shrink-0',
      isPrimary ? 'bg-cyan-500/8 border-cyan-400/30' : 'bg-white/[0.03] border-white/10',
      isError && 'border-rose-500/30 grayscale opacity-70'
    )}>
      <div className="px-3 border-r border-white/10 flex flex-col justify-center">
        <span className="text-[9px] font-black text-white/30 uppercase leading-none">{ticker.symbol}</span>
      </div>
      <div className="px-3 flex flex-col justify-center min-w-[98px]">
        <span className="text-[11px] font-semibold text-white/90 leading-none tabular-nums">{formatters.price(ticker.price)}</span>
        <span className={cn('text-[9px] font-bold leading-none tabular-nums mt-1', ticker.change24h > 0 ? 'text-emerald-400' : 'text-rose-400')}>
          {formatters.change(ticker.change24h)}
        </span>
      </div>
    </div>
  );
});

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', full: 'English' },
    { code: 'tr', full: 'Türkçe' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/[0.08] transition-all bg-black/30"
      >
        <Globe size={12} className="text-cyan-400" />
        <span className="text-[10px] font-black text-white/70 tracking-widest">{i18n.language.toUpperCase()}</span>
        <ChevronDown size={10} className={cn('text-white/30 transition-transform duration-300', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-32 bg-[#10131a] border border-white/10 rounded-xl z-[101] p-1"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all',
                    i18n.language === lang.code ? 'bg-cyan-500/20 text-cyan-300' : 'text-white/50 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {lang.full}
                  {i18n.language === lang.code && <Check size={10} className="text-cyan-300" />}
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
  const { data } = useHeaderMarketData(45_000);
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
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const shortAddress = useMemo(() => {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  return (
    <header className="min-h-16 md:h-20 shrink-0 flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-[#121825] via-[#0e1421] to-[#111926] px-3 sm:px-4 lg:px-6 relative z-50">
      <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[220px]">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/logos/aoxc-logo-512.svg" />
          <source media="(min-width: 640px)" srcSet="/logos/aoxc-logo-192.svg" />
          <img src="/logos/aoxc-logo-mobile.svg" alt="AOXCORE" className="h-9 w-auto rounded-md" />
        </picture>
        <div className="hidden sm:flex flex-col">
          <span className="text-[11px] font-black tracking-[0.2em] text-cyan-300">AOXCORE CONTROL</span>
          <span className="text-[9px] text-white/45 uppercase">Mainnet Ops Console</span>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <AnimatePresence mode="popLayout">
          {MARKET_ORDER.map((symbol) =>
            data[symbol] ? (
              <motion.div key={symbol} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <TokenWidget ticker={data[symbol]} isPrimary={symbol === 'AOXC'} />
              </motion.div>
            ) : null
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
    <header className="min-h-16 md:h-20 shrink-0 flex items-center border-b border-white/5 bg-[#020202] relative z-50 select-none overflow-hidden">
      
      {/* 1. BRANDING & OS KERNEL STATUS */}
      <div className="hidden sm:flex sm:w-56 lg:w-80 px-4 lg:px-8 flex-col border-r border-white/5 h-full justify-center bg-gradient-to-r from-cyan-500/[0.02] to-transparent">
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
      <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 overflow-x-auto no-scrollbar h-full bg-black/20">
        <AnimatePresence mode="popLayout">
          {MARKET_ORDER.map((symbol) => data[symbol] && (
            <motion.div key={symbol} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <TokenWidget ticker={data[symbol]} isPrimary={symbol === 'AOXC'} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="hidden lg:flex items-center gap-5 border-l border-white/10 pl-5">
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-white/40 uppercase">Gas</span>
          <span className="text-[11px] font-semibold text-white/90 flex items-center gap-1">
            <Zap size={12} className="text-amber-400" />
            {networkLoad || '0 gwei'}
          </span>
          <span className="text-[11px] font-semibold text-white/90 flex items-center gap-1"><Zap size={12} className="text-amber-400" />{networkLoad || '0 gwei'}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-white/40 uppercase">Uplink</span>
          <span className={cn('text-[11px] font-bold', isOnline ? 'text-emerald-400' : 'text-rose-400')}>{isOnline ? `${latency}ms` : 'Offline'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block"><LanguageSwitcher /></div>
        {walletAddress ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
            <ShieldCheck size={14} className="text-cyan-300" />
            <span className="text-[10px] font-mono text-white/90">{shortAddress}</span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-cyan-500 text-black px-3 sm:px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all hover:bg-cyan-400 disabled:opacity-50"
          >
            <Wallet size={13} />
            {isConnecting ? 'Connecting' : 'Wallet'}
          </button>
        )}

        <div className="lg:hidden flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1.5 bg-black/25">
          <Activity size={11} className={cn(isOnline ? 'text-emerald-400' : 'text-rose-400')} />
          <span className={cn('text-[10px] font-bold', isOnline ? 'text-emerald-400' : 'text-rose-400')}>
            {isOnline ? `${latency}ms` : 'Off'}
          </span>
        </div>
      {/* 3. TELEMETRY & SYSTEM AUTH */}
      <div className="hidden md:flex items-center gap-5 lg:gap-8 px-4 lg:px-8 ml-auto border-l border-white/5 h-full bg-gradient-to-l from-white/[0.03] to-transparent">
        
        <div className="flex gap-4 lg:gap-8">
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
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-white/40 uppercase">Uplink</span>
          <span className={cn('text-[11px] font-bold', isOnline ? 'text-emerald-400' : 'text-rose-400')}>
            {isOnline ? `${latency}ms` : 'Offline'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block">
        {/* ACTIONS */}
        <div className="flex items-center gap-3 lg:gap-4 border-l border-white/5 pl-4 lg:pl-8 h-full">
          <LanguageSwitcher />
        </div>

        {walletAddress ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
            <ShieldCheck size={14} className="text-cyan-300" />
            <span className="text-[10px] font-mono text-white/90">{shortAddress}</span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-cyan-500 text-black px-3 sm:px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all hover:bg-cyan-400 disabled:opacity-50"
          >
            <Wallet size={13} />
            {isConnecting ? 'Connecting' : 'Wallet'}
          </button>
        )}

        <div className="lg:hidden flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1.5 bg-black/25">
          <Activity size={11} className={cn(isOnline ? 'text-emerald-400' : 'text-rose-400')} />
          <span className={cn('text-[10px] font-bold', isOnline ? 'text-emerald-400' : 'text-rose-400')}>
            {isOnline ? `${latency}ms` : 'Off'}
          </span>
        </div>

      <div className="flex sm:hidden items-center gap-2 px-3 ml-auto">
        <span className={cn("text-[10px] font-black uppercase", isOnline ? "text-emerald-400" : "text-rose-500")}>
          {isOnline ? `${latency}ms` : 'Offline'}
        </span>
      </div>

      {/* FOOTER DECORATION */}
      <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none">
        <Pulse isOnline={isOnline} latency={latency} />
      </div>
    </header>
  );
};
