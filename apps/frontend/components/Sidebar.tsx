'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import { 
  LayoutDashboard, 
  Globe, 
  Wallet, 
  ArrowLeftRight,
  ShieldCheck, 
  Gavel, 
  Search, 
  Lock, 
  Code, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const t = useTranslations('nav');

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'bridge', label: t('bridge'), icon: ArrowLeftRight },
    { id: 'validators', label: t('validators'), icon: ShieldCheck },
    { id: 'governance', label: t('governance'), icon: Gavel },
    { id: 'explorer', label: t('explorer'), icon: Search },
    { id: 'network', label: t('network'), icon: Globe },
    { id: 'security', label: t('security'), icon: Lock },
    { id: 'developers', label: t('developers'), icon: Code },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-20 bottom-0 w-64 border-r border-white/10 bg-[#05070A]/90 backdrop-blur-xl z-50 transition-transform duration-300 md:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="md:hidden p-4 flex justify-end">
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (window.innerWidth < 768) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                activeTab === item.id 
                  ? "bg-aox-blue/20 text-aox-blue border border-aox-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-aox-blue" : "text-slate-500")} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
