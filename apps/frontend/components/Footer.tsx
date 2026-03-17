'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl py-3 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-aox-blue to-aox-green rounded-lg flex items-center justify-center">
            <Zap className="text-white w-3 h-3" />
          </div>
          <span className="font-display text-sm font-bold tracking-tighter">AOXCON</span>
        </div>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          © 2026 AOXCON. Sovereign Intelligence Orchestration.
        </p>
      </div>
    </footer>
  );
}
