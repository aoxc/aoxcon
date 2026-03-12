import React from 'react';
import { NeuralTerminal } from './NeuralTerminal';
import { Github, Globe, MessageSquare, AtSign } from 'lucide-react';

/**
 * @title AOXC Neural OS - System Footer
 * @notice Bottom system layer containing the neural terminal and institutional references.
 * @dev This component intentionally avoids dynamic runtime dependencies.
 *      It serves as a stable interface for logs, system identity, and
 *      canonical project navigation endpoints.
 */

const SYSTEM_BUILD = 'AOXC_UNIT_v2.6';

interface LinkItem {
  label: string;
  url: string;
  icon: React.ReactNode;
}

/**
 * @notice Canonical project navigation endpoints.
 * @dev Centralizing external links prevents duplication across UI layers
 *      and reduces the risk of inconsistent project references.
 */
const PROJECT_LINKS: readonly LinkItem[] = [
  {
    label: 'aoxcore.com',
    url: 'https://www.aoxcore.com',
    icon: <Globe size={14} />,
  },
  {
    label: '@AOXCORE',
    url: 'https://twitter.com/AOXCORE',
    icon: <AtSign size={14} />,
  },
  {
    label: '@AOXCDAO',
    url: 'https://twitter.com/AOXCDAO',
    icon: <AtSign size={14} />,
  },
  {
    label: '@AOXCON',
    url: 'https://twitter.com/AOXCON',
    icon: <AtSign size={14} />,
  },
  {
    label: '@AOXCAN',
    url: 'https://twitter.com/AOXCAN',
    icon: <AtSign size={14} />,
  },
  {
    label: 'github.com/aoxc',
    url: 'https://github.com/aoxc',
    icon: <Github size={14} />,
  },
  {
    label: 'Discord · aoxcore',
    url: 'https://discord.gg/aoxcore',
    icon: <MessageSquare size={14} />,
  },
] as const;

/**
 * @notice Secure external link renderer.
 * @dev All external links use noopener and noreferrer to prevent
 *      tab-napping and reference leakage.
 */
const ExternalLink: React.FC<LinkItem> = ({ label, url, icon }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-primary transition-colors font-mono tracking-wide"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
};

/**
 * @notice AOXC Neural OS Footer container.
 * @dev The layout intentionally separates:
 *      1) neural console output
 *      2) institutional navigation
 *      3) system identity markers
 */
export const Footer: React.FC = () => {
  return (
    <footer className="relative shrink-0 z-20 border-t border-white/5 bg-black/60 backdrop-blur-md">

      {/* Neural system terminal */}
      <div className="relative">
        <NeuralTerminal />
      </div>

      {/* Institutional navigation strip */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-white/5">

        {/* Project Links */}
        <div className="flex flex-wrap items-center gap-4">
          {PROJECT_LINKS.map((link) => (
            <ExternalLink key={link.url} {...link} />
          ))}
        </div>

        {/* System identity */}
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-widest text-white/20">

          <span>AOXC Neural OS</span>

          <span className="text-primary/60">{SYSTEM_BUILD}</span>

        </div>
      </div>

      {/* subtle top edge highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* faint system watermark */}
      <div className="absolute bottom-1 right-4 opacity-[0.06] pointer-events-none">
        <span className="text-[8px] font-mono tracking-[0.4em] uppercase">
          AOXC_CORE_SYSTEM
        </span>
      </div>

    </footer>
  );
};
