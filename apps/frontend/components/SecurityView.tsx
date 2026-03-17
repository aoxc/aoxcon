'use client';

import React from 'react';
import { Lock, AlertTriangle, ShieldAlert, FileText } from 'lucide-react';

export default function SecurityView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Security & Risk</h2>
        <p className="text-white/50">Monitor network health, risk scores, and audit trails.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aox-widget p-8 border-aox-gold/20">
          <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2 text-aox-gold">
            <ShieldAlert className="w-5 h-5" />
            Risk Score Dashboard
          </h3>
          <div className="text-5xl font-bold font-mono">88<span className="text-xl text-white/40">/100</span></div>
          <p className="text-xs text-white/40 mt-2">Current Network Risk Level: Moderate</p>
        </div>
        <div className="aox-widget p-8">
          <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-xl text-xs">
              <span className="text-red-400 font-bold">CRITICAL:</span> Node #482 latency spike detected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
