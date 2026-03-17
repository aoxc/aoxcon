'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BridgeView() {
  const [amount, setAmount] = useState('');
  const [fromNetwork, setFromNetwork] = useState('AOXChain');

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Transfer & Köprü</h2>
        <p className="text-white/50">AOXC varlıklarınızı AOXChain ve XLayer arasında güvenle taşıyın.</p>
      </header>

      <div className="aox-widget p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Kaynak Ağ</label>
          <select 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm"
            value={fromNetwork}
            onChange={(e) => setFromNetwork(e.target.value)}
          >
            <option>AOXChain</option>
            <option>XLayer</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Miktar (AOXC)</label>
          <input 
            type="number" 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="p-4 bg-aox-blue/10 border border-aox-blue/20 rounded-xl flex gap-3 text-xs text-aox-blue">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>İşlem öncesi ağ seçimini kontrol edin. AOXC ağlar arası otomatik birleşmez.</p>
        </div>

        <button className="w-full py-4 bg-aox-blue text-white font-bold rounded-xl hover:bg-aox-blue/90 transition-all flex items-center justify-center gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          Köprü İşlemini Başlat
        </button>
      </div>
    </div>
  );
}
