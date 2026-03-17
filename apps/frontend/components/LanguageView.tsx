'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Check, Languages, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { id: 'en', name: 'English', native: 'English', flag: '🇺🇸', region: 'Global', coverage: '100%', active: true },
  { id: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', region: 'Turkey', coverage: '95%', active: true },
  { id: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', region: 'DACH', coverage: '92%', active: false },
  { id: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', region: 'France', coverage: '88%', active: false },
  { id: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', region: 'Spain / LatAm', coverage: '90%', active: false },
  { id: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', region: 'China', coverage: '85%', active: false },
];

export default function LanguageView() {
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">LINGUA</h2>
        <p className="text-white/50 max-w-2xl text-sm break-words">Global localization and neural translation services for the AOXCON ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedLang(lang.id)}
            className={cn(
              "aox-widget group cursor-pointer transition-all",
              selectedLang === lang.id ? "border-aox-blue/50 bg-aox-blue/5" : ""
            )}
          >
            <div className="aox-card-inner !p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {lang.flag}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight">{lang.name}</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{lang.native}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-10 h-6 rounded-full relative transition-colors border",
                  selectedLang === lang.id 
                    ? "bg-aox-green/20 border-aox-green/30" 
                    : "bg-white/5 border-white/10"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full transition-all shadow-lg",
                    selectedLang === lang.id 
                      ? "right-1 bg-aox-green shadow-[0_0_10px_#00FF41]" 
                      : "left-1 bg-white/20"
                  )} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <span>Coverage</span>
                  <span className="text-white">{lang.coverage}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-aox-blue" 
                    style={{ width: lang.coverage }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <span>Neural Sync</span>
                  <span className={cn("text-aox-green", !lang.active && "text-white/20")}>
                    {lang.active ? "Optimized" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="aox-widget">
        <div className="aox-card-inner !p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-display-md !text-xl">Neural Translation Engine</h3>
              <p className="text-sm text-white/50 max-w-md">Real-time cross-chain message translation using AOXCHAIN&apos;s native AI layer. Ensuring seamless global communication.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10">
                View API Docs
              </button>
              <button className="px-8 py-3 bg-aox-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-aox-blue/80 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)]">
                Enable Global Sync
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
