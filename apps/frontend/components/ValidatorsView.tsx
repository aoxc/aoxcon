'use client';

import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export default function ValidatorsView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Validators & Staking</h2>
        <p className="text-white/50">Secure the network and earn rewards by staking your AOXC.</p>
      </header>

      <div className="aox-widget p-8">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Active Validators
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-aox-green/10 rounded-lg">
                  <Zap className="w-4 h-4 text-aox-green" />
                </div>
                <div>
                  <div className="font-bold">AOX Validator #{i}</div>
                  <div className="text-[10px] text-white/40 font-mono">Uptime: 99.99%</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-white/40">Commission</div>
                  <div className="font-mono font-bold">5%</div>
                </div>
                <button className="bg-aox-green text-black px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-aox-green/80 transition-colors">
                  Delegate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
