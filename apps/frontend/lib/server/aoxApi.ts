import { z } from 'zod';

const intervalSchema = z.enum(['1m', '5m', '15m', '1h', '4h', '1d']);

const baseUrl = process.env.AOX_API_BASE_URL || 'https://api.aoxcore.com';

function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

export async function fetchAoxTicker() {
  return fetch(`${baseUrl}/api/v1/market/ticker?symbol=AOXCUSDT`, {
    headers: {
      Accept: 'application/json',
    },
    signal: withTimeout(8000),
    cache: 'no-store',
  });
}

export function parseKlineQuery(interval: string | null, limit: string | null) {
  const safeInterval = intervalSchema.safeParse(interval ?? '1h');
  const limitNum = Number(limit ?? 24);
  const safeLimit = Number.isInteger(limitNum) ? Math.min(Math.max(limitNum, 1), 500) : 24;

  return {
    interval: safeInterval.success ? safeInterval.data : '1h',
    limit: safeLimit,
  };
}

export async function fetchAoxKlines(interval: string, limit: number) {
  return fetch(`${baseUrl}/api/v1/market/klines?symbol=AOXCUSDT&interval=${interval}&limit=${limit}`, {
    headers: {
      Accept: 'application/json',
    },
    signal: withTimeout(8000),
    cache: 'no-store',
  });
}

export const demoTicker = {
  symbol: 'AOXCUSDT',
  lastPrice: '0.0614',
  priceChangePercent: '0.80',
  volume: '12450000',
  source: 'demo-fallback',
};

export const demoKlines = [
  [Date.now() - 3600000, '0.0609', '0.0615', '0.0606', '0.0614', '152350'],
  [Date.now(), '0.0614', '0.0620', '0.0610', '0.0617', '198240'],
];
