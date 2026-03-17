'use client';

import React from 'react';
import { Search, FileText, Hash, Clock } from 'lucide-react';

export default function ExplorerView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Explorer</h2>
        <p className="text-white/50">Search for blocks, transactions, and addresses on AOXChain.</p>
      </header>

      <div className="aox-widget p-8">
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search by Hash, Address, or Block Number..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 font-mono text-sm outline-none focus:border-aox-blue/50"
          />
          <button className="bg-aox-blue px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      <div className="aox-widget p-8">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Latest Blocks
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-aox-gold/10 rounded-lg">
                  <Hash className="w-4 h-4 text-aox-gold" />
                </div>
                <div>
                  <div className="font-bold">Block #9,482,10{i}</div>
                  <div className="text-[10px] text-white/40 font-mono">12 seconds ago</div>
                </div>
              </div>
              <div className="font-mono text-xs text-white/60">142 Transactions</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
