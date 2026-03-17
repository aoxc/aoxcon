'use client';

import React from 'react';
import { Settings, User, Bell, ShieldCheck, Palette } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Settings & Profile</h2>
        <p className="text-white/50">Manage your account, preferences, and security.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: User, label: 'Profile & Identity' },
          { icon: Bell, label: 'Notifications' },
          { icon: ShieldCheck, label: 'Security' },
          { icon: Palette, label: 'Appearance' },
        ].map((item, i) => (
          <div key={i} className="aox-widget p-6 flex flex-col items-center gap-4 hover:border-aox-blue/50 transition-all cursor-pointer">
            <item.icon className="w-8 h-8 text-white/50" />
            <h3 className="font-display text-sm font-bold uppercase tracking-widest">{item.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
