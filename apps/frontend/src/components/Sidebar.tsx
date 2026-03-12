import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  FileText,
  Fingerprint,
  GitBranch,
  LayoutDashboard,
  LucideIcon,
  Network,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';

import { cn } from '../lib/utils';
import { useAoxcStore } from '../store/useAoxcStore';

/**
 * @title AOXC Neural Navigation Sidebar v2.6
 * @notice Typed, layout-safe, and state-consistent navigation surface for AOXC Neural OS.
 * @dev This implementation explicitly separates:
 *      1) routed content navigation
 *      2) panel-trigger actions
 *      3) local responsive presentation state
 *
 *      The separation is intentional to prevent route/panel collisions and
 *      reduce header/layout interference.
 */

type SidebarColor = 'primary' | 'blue' | 'pink' | 'purple' | 'orange';

/**
 * @notice Canonical routed views supported by the current application shell.
 * @dev This type must remain aligned with the store and the main App router.
 */
type NavigableView =
  | 'dashboard'
  | 'aoxcan'
  | 'finance'
  | 'analytics'
  | 'pending'
  | 'registry'
  | 'governance';

/**
 * @notice Sidebar action model.
 * @dev Route actions update the primary content view. Panel actions open the
 *      contextual right-side control surface without mutating the main route.
 */
type SidebarAction =
  | { type: 'route'; view: NavigableView }
  | { type: 'panel'; panel: 'notifications' };

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: SidebarColor;
  action: SidebarAction;
  highlight?: boolean;
  count?: number;
}

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

/**
 * @notice Resolves active state for the rendered sidebar item.
 * @dev Panel entries are intentionally not treated as main-route active items.
 */
function isMenuItemActive(
  item: MenuItem,
  activeView: string
): boolean {
  return item.action.type === 'route' && item.action.view === activeView;
}

/**
 * @notice Detects mobile viewport state.
 * @dev matchMedia is used instead of resize width polling to reduce unnecessary
 *      re-renders and provide clearer media-boundary semantics.
 */
function useIsMobile(breakpointPx = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(`(max-width: ${breakpointPx - 1}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);

    const handleChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [breakpointPx]);

  return isMobile;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    pendingTransactions,
    permissionLevel,
    setPermissionLevel,
    notifications,
    isSidebarCollapsed,
    toggleSidebar,
    setIsRightPanelOpen,
  } = useAoxcStore();

  const { t } = useTranslation();
  const isMobile = useIsMobile();

  /**
   * @notice Error-grade notification count for operator attention markers.
   */
  const errorNotificationCount = useMemo<number>(() => {
    return notifications.filter((notification) => notification.type === 'error').length;
  }, [notifications]);

  /**
   * @notice Canonical sidebar menu model.
   * @dev Only supported routed views are allowed to mutate the primary route state.
   *      Unsupported experimental views were intentionally removed to preserve
   *      consistency with the current application router.
   */
  const menuItems = useMemo<readonly MenuItem[]>(
    () => [
      {
        id: 'dashboard',
        label: t('sidebar.ledger', 'Main Ledger'),
        icon: LayoutDashboard,
        color: 'primary',
        action: { type: 'route', view: 'dashboard' },
      },
      {
        id: 'aoxcan',
        label: 'AOXCAN CORE',
        icon: Brain,
        color: 'primary',
        highlight: true,
        action: { type: 'route', view: 'aoxcan' },
      },
      {
        id: 'finance',
        label: t('sidebar.finance', 'Finance'),
        icon: Wallet,
        color: 'blue',
        action: { type: 'route', view: 'finance' },
      },
      {
        id: 'analytics',
        label: t('sidebar.analytics', 'Neural Analytics'),
        icon: BarChart3,
        color: 'blue',
        action: { type: 'route', view: 'analytics' },
      },
      {
        id: 'pending',
        label: t('sidebar.pending', 'Pending'),
        icon: FileText,
        color: 'primary',
        count: pendingTransactions.length,
        action: { type: 'route', view: 'pending' },
      },
      {
        id: 'registry',
        label: t('sidebar.registry', 'Registry Map'),
        icon: Network,
        color: 'pink',
        action: { type: 'route', view: 'registry' },
      },
      {
        id: 'governance',
        label: t('sidebar.governance', 'War Room'),
        icon: Users,
        color: 'pink',
        action: { type: 'route', view: 'governance' },
      },
      {
        id: 'notifications',
        label: 'NOTIFICATIONS',
        icon: AlertCircle,
        color: 'orange',
        count: errorNotificationCount,
        action: { type: 'panel', panel: 'notifications' },
      },
      /**
       * @dev Sentinel and skeleton entries were intentionally removed from direct routing
       *      because they were not backed by the current App router contract. Reintroduce
       *      them only after end-to-end route support exists.
       */
    ],
    [errorNotificationCount, pendingTransactions.length, t]
  );

  /**
   * @notice Handles a sidebar interaction with strict action routing semantics.
   * @dev Panel triggers do not mutate the primary content route.
   */
  const handleMenuAction = useCallback(
    (item: MenuItem): void => {
      if (item.action.type === 'route') {
        setActiveView(item.action.view);
        setIsRightPanelOpen(false);
        return;
      }

      if (item.action.type === 'panel') {
        setIsRightPanelOpen(true);
      }
    },
    [setActiveView, setIsRightPanelOpen]
  );

  /**
   * @notice Sidebar width model.
   * @dev Mobile mode uses an overlay-safe fixed width instead of 100% to reduce
   *      layout pressure on the header and main content shell.
   */
  const sidebarWidth = isMobile ? 288 : isSidebarCollapsed ? 84 : 280;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className={cn(
        'h-full border-r border-white/5 flex flex-col bg-[#050505]/95 backdrop-blur-3xl relative',
        /**
         * @dev Kept below the header stacking level to reduce accidental overlap conflicts.
         *      If MainLayout intentionally requires overlay behavior, centralize the z-index
         *      contract there instead of escalating locally.
         */
        'z-40'
      )}
      aria-label="AOXC primary sidebar"
    >
      {/* COLLAPSE TOGGLE */}
      {!isMobile && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 w-6 h-10 bg-primary rounded-lg hidden md:flex items-center justify-center text-black hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] z-20"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={14} strokeWidth={3} />
          ) : (
            <ChevronLeft size={14} strokeWidth={3} />
          )}
        </button>
      )}

      <div className="p-5 flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-6">
        {/* HEADER IDENTITY */}
        <div
          className={cn(
            'flex items-center px-3 mb-4 transition-all',
            isSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'
          )}
        >
          {!isSidebarCollapsed || isMobile ? (
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] truncate">
                Command Hub
              </span>
              <span className="text-[8px] font-mono text-primary/50 mt-1 italic uppercase tracking-widest">
                v2.6_Stable
              </span>
            </div>
          ) : (
            <Fingerprint size={18} className="text-primary animate-pulse" />
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1.5" aria-label="Primary navigation">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={isMenuItemActive(item, activeView)}
              isCollapsed={isSidebarCollapsed && !isMobile}
              onClick={() => handleMenuAction(item)}
            />
          ))}
        </nav>
      </div>

      {/* RBAC FOOTER */}
      <div className="mt-auto p-5 space-y-4 border-t border-white/5 bg-black/40">
        <div
          className={cn(
            'bg-white/[0.02] rounded-2xl border border-white/5 transition-all',
            isSidebarCollapsed && !isMobile ? 'p-2' : 'p-4 space-y-3'
          )}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                Access_Level
              </span>
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            </div>
          )}

          <div
            className={cn(
              'flex gap-1.5',
              isSidebarCollapsed && !isMobile ? 'flex-col' : 'flex-row'
            )}
          >
            {(['G', 'O', 'A'] as const).map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setPermissionLevel(index)}
                className={cn(
                  'flex items-center justify-center rounded-xl transition-all duration-300 font-black flex-1 py-2.5 text-[10px]',
                  permissionLevel === index
                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-white/20 hover:bg-white/10'
                )}
                aria-pressed={permissionLevel === index}
                aria-label={`Set access level ${label}`}
              >
                {label}
                {!isSidebarCollapsed &&
                  (label === 'G' ? 'ST' : label === 'O' ? 'PR' : 'DM')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

const SidebarItem = memo(function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps): React.JSX.Element {
  const colorMap: Record<SidebarColor, string> = {
    primary: 'text-primary',
    blue: 'text-blue-500',
    pink: 'text-pink-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  };

  const bgMap: Record<SidebarColor, string> = {
    primary: 'bg-primary/10',
    blue: 'bg-blue-500/10',
    pink: 'bg-pink-500/10',
    purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center relative transition-all duration-300 rounded-2xl py-3.5 px-4 group',
        isActive ? cn(bgMap[item.color], 'shadow-inner') : 'hover:bg-white/[0.03]',
        isCollapsed ? 'justify-center' : 'justify-start'
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.label}
    >
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            layoutId="sidebarActiveLine"
            className="absolute left-0 w-1 h-6 rounded-r-full bg-primary"
          />
        )}
      </AnimatePresence>

      <item.icon
        size={20}
        className={cn(
          'shrink-0 transition-all duration-300',
          isActive ? colorMap[item.color] : 'text-white/20 group-hover:text-white/60',
          item.highlight && !isActive && 'text-primary animate-pulse'
        )}
      />

      {!isCollapsed && (
        <span
          className={cn(
            'ml-4 text-[10px] font-black uppercase tracking-widest truncate transition-colors',
            isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
          )}
        >
          {item.label}
        </span>
      )}

      {typeof item.count === 'number' && item.count > 0 && (
        <div
          className={cn(
            'absolute flex items-center justify-center font-black transition-all',
            isCollapsed
              ? 'top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse'
              : 'right-4 px-2 py-0.5 rounded-lg bg-primary text-black text-[9px]'
          )}
          aria-hidden="true"
        >
          {!isCollapsed && item.count}
        </div>
      )}
    </button>
  );
});
