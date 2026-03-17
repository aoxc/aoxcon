'use client';

import React from 'react';
import { Gavel, Users, Clock } from 'lucide-react';

export default function GovernanceView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Governance</h2>
        <p className="text-white/50">Participate in the future of AOXChain by voting on proposals.</p>
      </header>

      <div className="aox-widget p-8">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          Active Proposals
        </h3>
        <div className="space-y-6">
          {[
            { id: 'PROP-042', title: 'Increase Validator Set Size', status: 'Voting' },
            { id: 'PROP-043', title: 'Update Fee Parameters', status: 'Pending' },
          ].map((prop) => (
            <div key={prop.id} className="p-6 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-aox-blue font-mono text-xs mb-1">{prop.id}</div>
                <div className="text-xl font-bold">{prop.title}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                  <Clock className="w-4 h-4" />
                  2 days left
                </div>
                <button className="bg-white/10 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
                  Vote Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
