import { useEffect, useMemo, useState } from 'react';
import { fetchHeaderMarketData } from '../services/market';
import type { MarketTicker, SupportedSymbol } from '../services/market';

interface UseHeaderMarketDataResult {
  data: Record<SupportedSymbol, MarketTicker>;
  isLoading: boolean;
  lastRefreshAt: number | null;
}

/**
 * @notice Returns a stable render-safe initial widget state.
 * @dev The initial state is explicit to avoid undefined access paths during first render.
 */
function createInitialTicker(symbol: SupportedSymbol): MarketTicker {
  return {
    symbol,
    price: Number.NaN,
    change24h: Number.NaN,
    lastUpdatedAt: null,
    status: 'LOADING',
    source: symbol === 'AOXC' ? 'AOXC_CUSTOM' : 'COINGECKO',
  };
}

/**
 * @notice Header market data hook with resilient periodic refresh behavior.
 * @dev This hook is intentionally designed to tolerate partial upstream failure
 *      without collapsing the widget state model used by the header.
 */
export function useHeaderMarketData(
  refreshIntervalMs = 30_000
): UseHeaderMarketDataResult {
  const initialData = useMemo<Record<SupportedSymbol, MarketTicker>>(
    () => ({
      AOXC: createInitialTicker('AOXC'),
      OKB: createInitialTicker('OKB'),
      SUI: createInitialTicker('SUI'),
      ADA: createInitialTicker('ADA'),
    }),
    []
  );

  const [data, setData] = useState<Record<SupportedSymbol, MarketTicker>>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshAt, setLastRefreshAt] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let activeController: AbortController | null = null;

    const run = async (): Promise<void> => {
      activeController?.abort();

      const controller = new AbortController();
      activeController = controller;

      try {
        const next = await fetchHeaderMarketData(controller.signal);

        if (!isMounted || controller.signal.aborted) {
          return;
        }

        setData(next);
        setLastRefreshAt(Date.now());
      } catch {
        if (!isMounted || controller.signal.aborted) {
          return;
        }

        setData((prev) => ({
          AOXC:
            prev.AOXC.status === 'OK'
              ? prev.AOXC
              : { ...prev.AOXC, status: 'ERROR' },
          OKB:
            prev.OKB.status === 'OK'
              ? prev.OKB
              : { ...prev.OKB, status: 'ERROR' },
          SUI:
            prev.SUI.status === 'OK'
              ? prev.SUI
              : { ...prev.SUI, status: 'ERROR' },
          ADA:
            prev.ADA.status === 'OK'
              ? prev.ADA
              : { ...prev.ADA, status: 'ERROR' },
        }));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    const intervalId = window.setInterval(() => {
      void run();
    }, refreshIntervalMs);

    return () => {
      isMounted = false;
      activeController?.abort();
      window.clearInterval(intervalId);
    };
  }, [refreshIntervalMs]);

  return {
    data,
    isLoading,
    lastRefreshAt,
  };
}
