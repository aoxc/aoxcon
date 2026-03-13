import React, { memo } from 'react';
import { NeuralTerminal } from './NeuralTerminal';
import { Github, Globe, MessageSquare, Twitter, Cpu, Terminal as TerminalIcon } from 'lucide-react';

/**
 * @title AOXC Neural OS - System Footer Layer
 * @version 3.2.1-PRO
 * @notice Bottom system layer providing institutional endpoints and forensic terminal access.
 */

const SYSTEM_BUILD = 'AOXC_UNIT_v2.6_STABLE';

interface LinkItem {
  label: string;
  url: string;
  icon: React.ReactNode;
}

const PROJECT_LINKS: readonly LinkItem[] = [
  { label: 'aoxcore.com', url: 'https://www.aoxcore.com', icon: <Globe size={12} /> },
  { label: '@AOXCORE', url: 'https://twitter.com/AOXCORE', icon: <Twitter size={12} /> },
  { label: '@AOXCDAO', url: 'https://twitter.com/AOXCDAO', icon: <Twitter size={12} /> },
  { label: 'github.com/aoxc', url: 'https://github.com/aoxc', icon: <Github size={12} /> },
  { label: 'Discord', url: 'https://discord.gg/aoxcore', icon: <MessageSquare size={12} /> },
] as const;

/**
 * @notice Secure Link Component
 * @dev Implements strict rel="noopener noreferrer" for cyber-sec compliance.
 */
const ExternalLink = memo(({ label, url, icon }: LinkItem) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 text-[9px] text-white/30 hover:text-cyan-500 transition-all duration-300 font-mono tracking-tighter uppercase group"
  >
    <span className="group-hover:scale-110 transition-transform">{icon}</span>
    <span className="border-b border-transparent group-hover:border-cyan-500/30 pb-0.5">{label}</span>
  </a>
));

export const Footer: React.FC = () => {
  return (
    <footer className="relative shrink-0 z-30 border-t border-white/5 bg-[#050505]/80 backdrop-blur-2xl">
      
      {/* 1. NEURAL TERMINAL: Integrated forensic stream */}
      {/* Bu alanın yüksekliği App.tsx'teki yerleşimi bozmamak için sınırlanmıştır */}
      <div className="relative border-b border-white/5 h-[160px] overflow-hidden group">
        <div className="absolute top-2 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <TerminalIcon size={10} className="text-cyan-500/50" />
          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
            Forensic_Console_Output
          </span>
        </div>
        <NeuralTerminal />
      </div>

      {/* 2. INSTITUTIONAL STRIP: Social & Identity */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4">
        
        {/* Navigation Grid */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
          {PROJECT_LINKS.map((link) => (
            <ExternalLink key={link.url} {...link} />
          ))}
        </div>

        {/* System Telemetry Label */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-cyan-500/40" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
              AOXC Neural OS
            </span>
          </div>
          
          <div className="px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/10">
            <span className="text-[8px] font-mono font-bold text-cyan-500/60 tracking-widest">
              {SYSTEM_BUILD}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DECORATIVE ELEMENTS: Cyber-Sec Aesthetics */}
      
      {/* Top Edge Neon Highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

      {/* Subtle Background Watermark */}
      <div className="absolute bottom-1 right-2 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[7px] font-mono tracking-[1em] uppercase text-white">
          AOXC_CORE_INFRASTRUCTURE
        </span>
      </div>

    </footer>
  );
};
