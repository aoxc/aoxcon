import React, { memo, useMemo } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

import { Pulse } from './Pulse';
import { cn } from '../lib/utils';
import { useHeaderMarketData } from '../hooks/useHeaderMarketData';
import type { MarketTicker, SupportedSymbol } from '../services/market';

interface HeaderProps {
  isOnline: boolean;
  latency: number;
}

const SYSTEM_VERSION = 'v2.1.0';
const NODE_LABEL = 'FR_NODE_B';
const MARKET_ORDER: readonly SupportedSymbol[] = ['AOXC', 'OKB', 'SUI', 'ADA'] as const;

/**
 * @notice Bounds latency to a deterministic, render-safe integer value.
 * @dev Invalid numeric inputs are normalized to zero to preserve stable UI output
 *      and prevent malformed telemetry text in the header band.
 */
function normalizeLatency(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

/**
 * @notice Formats a market price into a compact operator-facing string.
 * @dev Invalid or unavailable values are rendered explicitly as "NaN" to avoid
 *      presenting misleading synthetic fallback numbers.
 */
function formatPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return 'NaN';
  }

  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (price >= 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  return price.toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
}

/**
 * @notice Formats 24h market delta data.
 * @dev Non-finite values are converted into an operational label to signal
 *      degraded upstream market telemetry.
 */
function formatChange(change24h: number): string {
  if (!Number.isFinite(change24h)) {
    return 'SYSTEM';
  }

  const sign = change24h > 0 ? '+' : '';
  return `${sign}${change24h.toFixed(2)}%`;
}

/**
 * @notice Returns the semantic text tone for a market delta.
 */
function getChangeTone(change24h: number): string {
  if (!Number.isFinite(change24h)) {
    return 'text-white/35';
  }

  if (change24h > 0) {
    return 'text-emerald-500';
  }

  if (change24h < 0) {
    return 'text-rose-500';
  }

  return 'text-white/60';
}

/**
 * @notice Maps internal market status values to compact display labels.
 */
function getStatusLabel(status: MarketTicker['status']): string {
  switch (status) {
    case 'LOADING':
      return 'SYNC';
    case 'ERROR':
      return 'ERROR';
    case 'NO_DATA':
      return 'NO_DATA';
    case 'STALE':
      return 'STALE';
    case 'OK':
    default:
      return 'LIVE';
  }
}

/**
 * @notice Returns status-specific text styling for widget health.
 */
function getStatusTone(status: MarketTicker['status']): string {
  switch (status) {
    case 'OK':
      return 'text-primary/70';
    case 'STALE':
      return 'text-amber-400/80';
    case 'NO_DATA':
      return 'text-white/35';
    case 'ERROR':
      return 'text-rose-500/80';
    case 'LOADING':
    default:
      return 'text-white/35';
  }
}

/**
 * @notice Returns a telemetry label derived from live connectivity state.
 */
function getUplinkLabel(isOnline: boolean): string {
  return isOnline ? 'Uplink_Stable' : 'Uplink_Offline';
}

/**
 * @notice Returns a render-safe latency label.
 * @dev The label remains deterministic even when upstream telemetry is degraded.
 */
function getLatencyLabel(latency: number): string {
  return `${normalizeLatency(latency)}MS`;
}

interface TokenWidgetProps {
  ticker: MarketTicker;
  isPrimary?: boolean;
}

const TokenWidget = memo(function TokenWidget({
  ticker,
  isPrimary = false,
}: TokenWidgetProps): React.JSX.Element {
  const isDegraded = ticker.status !== 'OK';
  const priceLabel = formatPrice(ticker.price);
  const changeLabel = formatChange(ticker.change24h);
  const statusLabel = getStatusLabel(ticker.status);

  return (
    <div
      className={cn(
        'flex shrink-0 items-center h-10 rounded-sm overflow-hidden border transition-all duration-200',
        isPrimary
          ? 'bg-primary/5 border-primary/15'
          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]',
        isDegraded && 'opacity-90'
      )}
      aria-label={`${ticker.symbol} market widget`}
      title={`${ticker.symbol} | PRICE=${priceLabel} | CHANGE=${changeLabel} | STATUS=${statusLabel}`}
      data-symbol={ticker.symbol}
      data-status={ticker.status}
    >
      <div
        className={cn(
          'px-3 h-full flex items-center border-r shrink-0',
          isPrimary ? 'bg-primary/10 border-primary/15' : 'bg-white/5 border-white/5'
        )}
      >
        <span
          className={cn(
            'text-[10px] font-black tracking-tight uppercase',
            isPrimary ? 'text-primary' : 'text-white/70'
          )}
        >
          {ticker.symbol}
        </span>
      </div>

      <div className="px-4 h-full min-w-[96px] flex flex-col justify-center">
        <span className="text-[10px] text-white font-bold font-mono leading-none tabular-nums">
          {priceLabel}
        </span>

        <span
          className={cn(
            'text-[7px] font-black mt-1 leading-none uppercase tracking-tight tabular-nums',
            getChangeTone(ticker.change24h)
          )}
        >
          {changeLabel}
        </span>
      </div>

      <div className="px-3 h-full flex items-center border-l border-white/5 bg-black/20 shrink-0">
        <span
          className={cn(
            'text-[7px] font-black tracking-widest uppercase whitespace-nowrap',
            getStatusTone(ticker.status)
          )}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
});

const MarketStrip = memo(function MarketStrip({
  data,
}: {
  data: Record<SupportedSymbol, MarketTicker>;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 min-w-max">
      {MARKET_ORDER.map((symbol, index) => (
        <React.Fragment key={symbol}>
          {index > 0 && <div className="w-2 h-px bg-white/5 shrink-0" aria-hidden="true" />}
          <TokenWidget ticker={data[symbol]} isPrimary={symbol === 'AOXC'} />
        </React.Fragment>
      ))}
    </div>
  );
});

/**
 * @title AOXC Neural OS - Header Engine v2.2.0
 * @notice Production-safe header implementation with real market data integration.
 * @dev This component is intentionally resilient against:
 *      - partial provider outages
 *      - invalid numeric payloads
 *      - transient browser-side fetch degradation
 *      - narrow viewport pressure inside the market strip
 */
export const Header: React.FC<HeaderProps> = ({ isOnline, latency }) => {
  const safeLatency = normalizeLatency(latency);
  const { data, isLoading, lastRefreshAt } = useHeaderMarketData(30_000);

  const uplinkLabel = useMemo(() => getUplinkLabel(isOnline), [isOnline]);
  const latencyLabel = useMemo(() => getLatencyLabel(safeLatency), [safeLatency]);

  return (
    <header
      className="relative z-[60] h-16 shrink-0 border-b border-white/5 bg-[#050505] overflow-hidden"
      data-online={isOnline ? 'true' : 'false'}
      data-market-loading={isLoading ? 'true' : 'false'}
      data-market-refresh-at={lastRefreshAt ?? ''}
      aria-label="AOXC system header"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]" />

      <div className="relative h-full flex items-center min-w-0">
        {/* LEFT SLOT: BRAND */}
        <div className="h-full shrink-0 w-64 lg:w-72 xl:w-80 px-4 lg:px-6 flex items-center border-r border-white/5">
          <div className="flex flex-col min-w-0">
            <h1 className="text-white font-black text-sm tracking-[0.34em] lg:tracking-[0.4em] uppercase leading-none whitespace-nowrap">
              AOXC<span className="text-primary text-glow">OS</span>
            </h1>

            <div className="flex items-center gap-2 mt-1.5 min-w-0">
              <span className="text-[8px] text-white/30 font-mono tracking-widest font-bold uppercase whitespace-nowrap">
                Core_Module
              </span>
              <span className="text-[8px] text-primary font-mono font-black whitespace-nowrap">
                {SYSTEM_VERSION}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER SLOT: MARKET STRIP */}
        <div className="flex-1 min-w-0 h-full flex items-center justify-start xl:justify-center px-3 lg:px-4 overflow-x-auto scrollbar-hide">
          <MarketStrip data={data} />
        </div>

        {/* RIGHT SLOT: TELEMETRY */}
        <div className="h-full shrink-0 w-52 lg:w-64 xl:w-[420px] 2xl:w-[450px] flex items-center justify-end px-4 lg:px-6 gap-5 lg:gap-6 xl:gap-8 border-l border-white/5 bg-black/20">
          <div className="hidden xl:flex items-center gap-6 2xl:gap-7">
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em] whitespace-nowrap">
                Gas_X1
              </span>

              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap size={10} className="text-primary shrink-0" />
                <span className="text-[10px] text-white/80 font-mono font-bold whitespace-nowrap">
                  0.1 GWEI
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em] whitespace-nowrap">
                Sentinel
              </span>

              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={10} className="text-emerald-500 shrink-0" />
                <span className="text-[10px] text-emerald-500 font-mono font-bold uppercase italic whitespace-nowrap">
                  Secure
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4 lg:pl-5 xl:pl-6 border-l border-white/5 shrink-0">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[9px] font-black uppercase tracking-widest transition-colors whitespace-nowrap',
                    isOnline ? 'text-primary' : 'text-rose-500'
                  )}
                >
                  {uplinkLabel}
                </span>

                <div
                  className={cn(
                    'w-2 h-2 rounded-full shadow-lg shrink-0',
                    isOnline
                      ? 'bg-primary animate-pulse shadow-primary/20'
                      : 'bg-rose-500 shadow-rose-500/20'
                  )}
                  aria-hidden="true"
                />
              </div>

              <span className="text-[8px] text-white/10 font-mono font-bold mt-1 uppercase tracking-tighter whitespace-nowrap">
                DLY: {latencyLabel} // {NODE_LABEL}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FX */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-40 pointer-events-none">
        <Pulse isOnline={isOnline} latency={safeLatency} />
      </div>

      {/* TOP EDGE */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </header>
  );
};
