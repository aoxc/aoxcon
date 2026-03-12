import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Activity, Cpu, Globe, ShieldAlert, Zap } from 'lucide-react';

import { cn } from '../lib/utils';
import { useAoxcStore, type StatusColor } from '../store/useAoxcStore';

interface StatusMatrixProps {
  isOnline: boolean;
  latency: number;
}

/**
 * @title AOXC Neural Status Matrix v2.6
 * @notice Global telemetry bar visualizing subsystem health with layout-safe, render-safe semantics.
 * @dev This component does not fabricate latency or uplink health. It derives presentation from:
 *      - store-backed subsystem status colors
 *      - global online/offline state
 *      - measured latency supplied by the layout shell
 */

const colorMap: Record<StatusColor, string> = {
  green: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
  yellow: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]',
  orange: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]',
  red: 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse',
  blue: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
};

/**
 * @notice Maps a status color to its corresponding text tone.
 */
function getTextTone(color: StatusColor): string {
  switch (color) {
    case 'green':
      return 'text-emerald-400';
    case 'yellow':
      return 'text-amber-400';
    case 'orange':
      return 'text-orange-400';
    case 'red':
      return 'text-rose-500';
    case 'blue':
    default:
      return 'text-cyan-400';
  }
}

/**
 * @notice Formats latency for display without fabricating healthy values.
 * @dev Invalid or offline conditions are reported explicitly as unavailable.
 */
function formatLatency(latency: number, isOnline: boolean): string {
  if (!isOnline) {
    return 'NO_LINK';
  }

  if (!Number.isFinite(latency) || latency < 0) {
    return 'NaN';
  }

  return `${Math.floor(latency)}ms`;
}

/**
 * @notice Derives an uplink label from the real global network state.
 */
function getUplinkLabel(isOnline: boolean, latency: number): string {
  if (!isOnline) {
    return 'LINK_DEGRADED';
  }

  if (!Number.isFinite(latency)) {
    return 'SYNC_PENDING';
  }

  if (latency >= 500) {
    return 'HIGH_LATENCY';
  }

  return 'UPLINK_STABLE';
}

/**
 * @notice Derives the uplink indicator color from real connectivity state.
 */
function getUplinkColor(isOnline: boolean, latency: number): string {
  if (!isOnline) {
    return 'bg-rose-500';
  }

  if (!Number.isFinite(latency)) {
    return 'bg-amber-400';
  }

  if (latency >= 500) {
    return 'bg-orange-500';
  }

  return 'bg-emerald-500';
}

/**
 * @notice Derives the uplink text color from real connectivity state.
 */
function getUplinkTextTone(isOnline: boolean, latency: number): string {
  if (!isOnline) {
    return 'text-rose-500/80';
  }

  if (!Number.isFinite(latency)) {
    return 'text-amber-400/80';
  }

  if (latency >= 500) {
    return 'text-orange-400/80';
  }

  return 'text-emerald-500/70';
}

export const StatusMatrix: React.FC<StatusMatrixProps> = ({ isOnline, latency }) => {
  const { statusMatrix, networkStatus, blockNumber } = useAoxcStore();
  const { t } = useTranslation();

  /**
   * @notice Resolves panel models with global degradation awareness.
   * @dev When the uplink is offline, local subsystem colors are clamped to a degraded
   *      ceiling to avoid falsely advertising healthy module telemetry.
   */
  const panels = useMemo(
    () => [
      {
        key: 'core',
        label: t('status_matrix.core', 'CORE_NEXUS'),
        color: isOnline ? statusMatrix.core : 'orange',
        icon: Cpu,
      },
      {
        key: 'access',
        label: t('status_matrix.access', 'SENTINEL_GATE'),
        color: networkStatus === 'critical' || !isOnline ? 'red' : statusMatrix.access,
        icon: ShieldAlert,
      },
      {
        key: 'finance',
        label: t('status_matrix.finance', 'VAULT_FLUX'),
        color: isOnline ? statusMatrix.finance : 'orange',
        icon: Zap,
      },
      {
        key: 'infra',
        label: t('status_matrix.infra', 'AUTO_REPAIR'),
        color: isOnline ? statusMatrix.infra : 'orange',
        icon: Activity,
      },
      {
        key: 'gov',
        label: t('status_matrix.gov', 'NEURAL_DAO'),
        color: isOnline ? statusMatrix.gov : 'orange',
        icon: Globe,
      },
    ],
    [isOnline, networkStatus, statusMatrix, t]
  );

  const uplinkLabel = getUplinkLabel(isOnline, latency);
  const uplinkDotClass = getUplinkColor(isOnline, latency);
  const uplinkTextClass = getUplinkTextTone(isOnline, latency);
  const latencyLabel = formatLatency(latency, isOnline);

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-4 bg-[#050505]/60 border-b border-white/5 backdrop-blur-2xl z-20 overflow-x-auto scrollbar-hide">
      <div className="hidden lg:flex flex-col border-r border-white/10 pr-6 mr-3 shrink-0">
        <span className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.3em]">
          Neural_Matrix
        </span>
        <span className="text-[7px] font-mono text-white/20 uppercase">
          BLK: #{blockNumber}
        </span>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {panels.map((panel) => (
          <motion.div
            key={panel.key}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl group relative overflow-hidden transition-all hover:bg-white/[0.05] hover:border-white/10 shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <panel.icon
              size={12}
              className="text-white/10 absolute -right-1 -bottom-1 rotate-12 group-hover:text-white/20 transition-all duration-700"
            />

            <div className="flex flex-col relative z-10 min-w-[88px]">
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50 transition-colors">
                {panel.label}
              </span>

              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{
                    scale: panel.color === 'red' ? [1, 1.3, 1] : 1,
                    boxShadow:
                      panel.color === 'red'
                        ? [
                            '0 0 5px rgba(244,63,94,0.5)',
                            '0 0 15px rgba(244,63,94,0.8)',
                            '0 0 5px rgba(244,63,94,0.5)',
                          ]
                        : 'none',
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-700',
                    colorMap[panel.color]
                  )}
                />

                <span
                  className={cn(
                    'text-[10px] font-black uppercase tracking-widest tabular-nums',
                    getTextTone(panel.color)
                  )}
                >
                  {t(`status_matrix.states.${panel.color}`, panel.color.toUpperCase())}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end border-l border-white/5 pl-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[6px] font-mono text-white/20 uppercase font-bold">
                Latency
              </span>
              <span className="text-[8px] font-mono text-cyan-500/50">
                {latencyLabel}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="ml-auto flex items-center gap-4 pl-6 border-l border-white/10 shrink-0">
        <div className="flex flex-col items-end">
          <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">
            Protocol_Uplink
          </span>
          <span className={cn('text-[9px] font-mono font-bold italic', uplinkTextClass)}>
            {uplinkLabel}
          </span>
        </div>

        <div className="relative">
          <div className={cn('absolute inset-0 blur-md rounded-full animate-pulse', uplinkDotClass, 'opacity-20')} />
          <div className={cn('w-2.5 h-2.5 rounded-full relative z-10 border border-black/50', uplinkDotClass)} />
        </div>
      </div>
    </div>
  );
};
