'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Wallet, 
  Globe, 
  Settings, 
  ChevronDown, 
  Database, 
  Wifi, 
  WifiOff,
  Bell,
  User,
  Menu,
  Zap,
  Activity,
  X,
  CreditCard,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDemo } from './DemoContext';

interface HeaderProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
  onMenuToggle?: () => void;
  onRightMenuToggle?: () => void;
}

export default function Header({ onTabChange, activeTab, onMenuToggle, onRightMenuToggle }: HeaderProps) {
  const { state, setNetwork, connectWallet, disconnectWallet } = useDemo();
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Wallet State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const networkOptions = [
    { label: 'Mainnet', value: 'mainnet' },
    { label: 'Testnet', value: 'testnet' },
    { label: 'Demo Mode', value: 'demo' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
  };

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      connectWallet();
      setIsConnecting(false);
      setIsWalletModalOpen(false);
      toast.success('Wallet Connected', {
        description: 'Successfully connected to Demo Account',
      });
    }, 1500);
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 h-20 border-b border-white/10 bg-black/40 backdrop-blur-xl z-40 px-4 md:px-8 grid grid-cols-3 items-center">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="p-2 text-white/40 hover:text-white bg-white/5 rounded-lg border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 bg-gradient-to-br from-aox-blue to-aox-green rounded-lg flex items-center justify-center shadow-lg shadow-aox-blue/20">
              <Zap className="text-white w-4 h-4" />
            </div>
            <h1 className="font-display text-lg font-bold tracking-tighter hidden sm:block">
              AOX<span className="text-aox-green">C</span>
            </h1>
          </div>
        </div>

        {/* Center: Search Bar - Desktop */}
        <div className="hidden lg:flex justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-aox-blue transition-colors" />
            <input 
              type="text"
              placeholder="Search assets, blocks, txs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-aox-blue/50 focus:ring-1 focus:ring-aox-blue/20 transition-all"
            />
          </form>
        </div>

        {/* Right: Actions + Language */}
        <div className="flex items-center justify-end gap-3">
          {/* Language Selector */}
          <button className="p-2 text-white/40 hover:text-white bg-white/5 rounded-lg border border-white/10">
            <Globe className="w-5 h-5" />
          </button>

          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 text-white/40 hover:text-white bg-white/5 rounded-lg border border-white/10"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* Network Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-mono"
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                state.network === 'mainnet' ? "bg-aox-green" : state.network === 'testnet' ? "bg-yellow-500" : "bg-purple-500"
              )} />
              <span className="capitalize hidden sm:inline">{state.network}</span>
              <ChevronDown className="w-3 h-3 text-white/30" />
            </button>
            <AnimatePresence>
              {isNetworkDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full mt-2 right-0 w-32 bg-[#0D1117] border border-white/10 rounded-lg p-1 shadow-2xl z-50"
                >
                  {networkOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setNetwork(opt.value as any);
                        setIsNetworkDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded text-xs transition-all",
                        state.network === opt.value ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wallet Button */}
          {state.address ? (
            <button 
              onClick={disconnectWallet}
              className="px-3 py-1.5 rounded-lg bg-aox-blue/10 border border-aox-blue/20 text-aox-blue text-xs font-mono font-bold"
            >
              {state.address.slice(0, 6)}...
            </button>
          ) : (
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold"
            >
              Connect
            </button>
          )}
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 bg-[#0D1117] border-b border-white/10 p-4 z-30 lg:hidden"
          >
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                autoFocus
                placeholder="Search assets, blocks, txs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-aox-blue/50"
              />
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-white/30" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Modal (Simplified for now) */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Connect Wallet</h3>
            <button 
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              {isConnecting ? 'Connecting...' : 'Connect Demo Wallet'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
