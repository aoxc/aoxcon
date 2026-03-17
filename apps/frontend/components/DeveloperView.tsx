'use client';

import React from 'react';
import { Code, Terminal, BookOpen, GitBranch } from 'lucide-react';

export default function DeveloperView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Developer Center</h2>
        <p className="text-white/50">API documentation, SDKs, and network environments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aox-widget p-8">
          <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            API & RPC Documentation
          </h3>
          <p className="text-sm text-white/40 mb-6">Access live RPC endpoints and integration guides.</p>
          <button className="px-6 py-3 bg-white text-black font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/90">
            View Docs
          </button>
        </div>
        <div className="aox-widget p-8 border-aox-blue/20">
          <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2 text-aox-blue">
            <Terminal className="w-5 h-5" />
            Network Environments
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between p-2 bg-black/40 rounded"><span>Mainnet:</span> <span>rpc.aoxchain.com</span></div>
            <div className="flex justify-between p-2 bg-black/40 rounded"><span>Testnet:</span> <span>rpc-test.aoxchain.com</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
