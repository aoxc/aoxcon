'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Globe, ArrowRight } from 'lucide-react';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-aox-blue/20 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-aox-blue to-aox-green rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-aox-blue/20">
          <Zap className="text-white w-10 h-10" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">
          AOX<span className="text-aox-green">C</span>ON
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-lg mx-auto">
          Sovereign Intelligence Orchestration for the Multichain Future.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:bg-white/90 transition-all"
        >
          Enter Platform
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <div className="absolute bottom-10 flex gap-8 text-white/30 text-sm font-mono">
        <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Audited</div>
        <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Multichain</div>
      </div>
    </div>
  );
}
