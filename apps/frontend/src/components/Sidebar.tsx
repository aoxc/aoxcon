import React, { memo, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LayoutDashboard, Brain, Wallet, BarChart3, 
  FileText, Network, Users, Code2, 
  ShieldCheck, ChevronLeft, ChevronRight, Fingerprint, Rocket, Shield
} from 'lucide-react';

import { cn } from '../lib/utils';
import { useAoxcStore } from '../store/useAoxcStore';

/**
 * @title AOXC Neural Navigation Kernel v4.0
 * @version 4.0.0-PRO
 * @notice Central navigation logic for AOXC Neural OS.
 * @dev Routes are cross-linked with App.tsx router switches.
 */

type NavigableView = 
  | 'dashboard' | 'aoxcan' | 'finance' | 'analytics' 
  | 'pending' | 'registry' | 'governance' | 'network' | 'readiness' | 'skeleton';

interface SidebarItemProps {
  id: NavigableView;
  label: string;
  icon: any;
  color: 'cyan' | 'rose' | 'emerald' | 'purple';
  group: 'CORE' | 'ASSETS' | 'INFRA';
  count?: number;
}

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    isSidebarCollapsed, 
    toggleSidebar,
    pendingTransactions,
    permissionLevel,
    setPermissionLevel
  } = useAoxcStore();

  const [isHovered, setIsHovered] = useState(false);

  /**
   * @notice Canonical Route Registry
   * @dev Maps directly to the Suspense router in App.tsx
   */
  const navConfig = useMemo<SidebarItemProps[]>(() => [
    { id: 'dashboard',  label: 'Main Ledger',      icon: LayoutDashboard, color: 'cyan',    group: 'CORE' },
    { id: 'aoxcan',     label: 'AOXCAN CORE',     icon: Brain,           color: 'cyan',    group: 'CORE' },
    { id: 'governance', label: 'War Room',        icon: Users,           color: 'rose',    group: 'CORE' },
    
    { id: 'finance',    label: 'Cash Ledger',     icon: Wallet,          color: 'emerald', group: 'ASSETS' },
    { id: 'analytics',  label: 'Neural Analytics', icon: BarChart3,       color: 'emerald', group: 'ASSETS' },
    { id: 'pending',    label: 'Pending Sig',     icon: FileText,        color: 'cyan',    group: 'ASSETS', count: pendingTransactions.length },
    
    { id: 'registry',   label: 'Registry Map',    icon: Network,         color: 'purple',  group: 'INFRA' },
    { id: 'network',    label: 'Network Hub',     icon: Rocket,          color: 'cyan',    group: 'INFRA' },
    { id: 'readiness',  label: 'Mainnet Ready',   icon: Shield,          color: 'emerald', group: 'INFRA' },
    { id: 'skeleton',   label: 'Source Scan',     icon: Code2,           color: 'purple',  group: 'INFRA' }
  ], [pendingTransactions.length]);

  const isCollapsed = isSidebarCollapsed && !isHovered;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full bg-[#020202] border-r border-white/5 flex flex-col relative z-50 shadow-[20px_0_80px_rgba(0,0,0,0.8)]"
    >
      {/* PROFESSIONAL TOGGLE: Industrial Grade Blade Switch */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-[12px] top-12 w-6 h-12 bg-[#080808] border border-white/10 rounded-md flex items-center justify-center text-cyan-500 hover:text-white hover:border-cyan-500/50 transition-all z-[60] shadow-[5px_0_15px_rgba(0,0,0,0.5)] group"
      >
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isSidebarCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* TOP_IDENTITY: AOXCOS Brand & Pulse */}
      <div className="p-6 shrink-0">
        <div className={cn("flex items-center gap-4", isCollapsed ? "justify-center" : "justify-start")}>
          <div className="relative">
            <Fingerprint size={24} className="text-cyan-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-20" />
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">AOXCOS</span>
              <span className="text-[7px] font-mono text-white/20 uppercase">Kernel_v3.2.1_PRO</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* SCROLLABLE_NAV: Segmented by Operation Sector */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-8">
        {(['CORE', 'ASSETS', 'INFRA'] as const).map(sector => (
          <div key={sector} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-4 text-[8px] font-black text-white/10 uppercase tracking-[0.5em] mb-4">
                {sector}_SECTOR
              </h3>
            )}
            <nav className="space-y-1">
              {navConfig.filter(item => item.group === sector).map(item => (
                <NavItem 
                  key={item.id} 
                  {...item} 
                  isActive={activeView === item.id} 
                  isCollapsed={isCollapsed}
                  onClick={() => setActiveView(item.id)}
                />
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* RBAC_FOOTER: Permission Matrix */}
      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className={cn(
          "bg-white/[0.02] border border-white/5 rounded-xl transition-all",
          isCollapsed ? "p-1.5" : "p-3 space-y-3"
        )}>
          {!isCollapsed && (
            <div className="flex justify-between items-center px-1">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-widest italic">Auth_Matrix</span>
              <ShieldCheck size={10} className="text-cyan-500/40" />
            </div>
          )}
          <div className={cn("flex gap-1", isCollapsed ? "flex-col" : "flex-row")}>
            {(['G', 'O', 'A'] as const).map((lvl, i) => (
              <button
                key={lvl}
                onClick={() => setPermissionLevel(i)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[9px] font-black transition-all border",
                  permissionLevel === i 
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                    : "bg-white/5 border-transparent text-white/20 hover:text-white/40"
                )}
              >
                {lvl}{!isCollapsed && (lvl === 'G' ? 'ST' : lvl === 'O' ? 'PR' : 'ADM')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

/* --- NAVIGATION ATOM --- */
const NavItem = memo(({ id, label, icon: Icon, color, isActive, isCollapsed, onClick, count }: any) => {
  const colorClasses = {
    cyan: "text-cyan-500",
    rose: "text-rose-500",
    emerald: "text-emerald-500",
    purple: "text-purple-500"
  };

  const bgClasses = {
    cyan: "bg-cyan-500/10",
    rose: "bg-rose-500/10",
    emerald: "bg-emerald-500/10",
    purple: "bg-purple-500/10"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center py-3.5 px-4 rounded-xl transition-all relative group",
        isActive ? cn(bgClasses[color as keyof typeof bgClasses], "shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]") : "hover:bg-white/[0.03]",
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="active_indicator"
            className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[4px_0_12px_rgba(6,182,212,0.6)]"
          />
        )}
      </AnimatePresence>

      <Icon 
        size={18} 
        className={cn(
          "shrink-0 transition-transform duration-500 group-hover:scale-110",
          isActive ? colorClasses[color as keyof typeof colorClasses] : "text-white/20 group-hover:text-white/60"
        )} 
      />

      {!isCollapsed && (
        <span className={cn(
          "ml-4 text-[10px] font-bold uppercase tracking-[0.2em] truncate transition-colors",
          isActive ? "text-white" : "text-white/30 group-hover:text-white/70"
        )}>
          {label}
        </span>
      )}

      {count !== undefined && count > 0 && (
        <div className={cn(
          "absolute flex items-center justify-center",
          isCollapsed ? "top-1 right-1 w-2 h-2 rounded-full bg-rose-600 animate-pulse" : "right-4 px-1.5 py-0.5 rounded bg-rose-600/20 border border-rose-500/30 text-[8px] font-black text-rose-500"
        )}>
          {!isCollapsed && count}
        </div>
      )}
    </button>
  );
});
