'use client';

import React from 'react';
import { Wallet, ArrowUpRight, History } from 'lucide-react';
import { useDemo } from './DemoContext';

export default function WalletView() {
  const { state } = useDemo();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Wallet & Assets</h2>
        <p className="text-white/50">Manage your AOXChain assets and view transaction history.</p>
      </header>

      <div className="aox-widget p-8 border-aox-blue/20 bg-aox-blue/5">
        <h3 className="font-display text-sm font-bold mb-6 flex items-center gap-2 text-aox-blue">
          <Wallet className="w-4 h-4" />
          AOXC (Toplam): {state.balance.toLocaleString()} AOXC
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
              <span className="text-aox-blue">AOXChain (Native)</span>
              <span>{state.balance.toLocaleString()}</span>
            </div>
            <div className="text-xs text-white/40">Available: {state.balance.toLocaleString()} / Staked: 0</div>
          </div>
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
              <span className="text-purple-400">XLayer (Bridged)</span>
              <span>0</span>
            </div>
            <div className="text-xs text-white/40">Available: 0 / In-Bridge: 0</div>
          </div>
        </div>
      </div>

      <div className="aox-widget p-8">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction History
        </h3>
        <div className="space-y-4">
          {state.address ? (
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-aox-blue/10 rounded-lg">
                  <ArrowUpRight className="w-4 h-4 text-aox-blue" />
                </div>
                <div>
                  <div className="font-bold">Wallet Connected</div>
                  <div className="text-[10px] text-white/40 font-mono">Just now</div>
                </div>
              </div>
              <div className="font-mono font-bold">+ {state.balance.toLocaleString()} AOXC</div>
            </div>
          ) : (
            <p className="text-sm text-white/40">Connect wallet to view history.</p>
          )}
        </div>
      </div>
    </div>
  );
}
