import { z } from 'zod';
import { AOXC_OKX_EXPLORER_URL, AOXC_OKX_TOKEN_URL, AOXC_TOKEN_ADDRESS, getNetworkProfile, type Network } from '@/lib/network';

const intervalSchema = z.enum(['1m', '5m', '15m', '1h', '4h', '1d']);
const networkSchema = z.enum(['aoxchain', 'xlayer', 'demo']);

const defaultMarketSymbol = process.env.AOX_MARKET_SYMBOL || 'AOXCUSDT';
const xLayerMarketSymbol = process.env.AOX_XLAYER_MARKET_SYMBOL || defaultMarketSymbol;

const intervalSchema = z.enum(['1m', '5m', '15m', '1h', '4h', '1d']);

const baseUrl = process.env.AOX_API_BASE_URL || 'https://api.aoxcore.com';

function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

export function parseNetworkQuery(network: string | null): Network {
  const safe = networkSchema.safeParse(network ?? 'aoxchain');
  return safe.success ? safe.data : 'aoxchain';
}

function resolveApiBase(network: Network) {
  const target = network === 'demo' ? 'aoxchain' : network;
  return getNetworkProfile(target).apiBaseUrl;
}

function resolveMarketSymbol(network: Network): string {
  return network === 'xlayer' ? xLayerMarketSymbol : defaultMarketSymbol;
}

export function normalizeTicker(payload: any, network: Network) {
  const source = payload?.source || 'remote';
  const lastPrice = Number(payload?.lastPrice ?? payload?.price ?? 0);
  const priceChangePercent = Number(payload?.priceChangePercent ?? payload?.change24h ?? 0);
  const quoteVolume = Number(payload?.quoteVolume ?? payload?.volume ?? 0);

  return {
    symbol: payload?.symbol || resolveMarketSymbol(network),
    network,
    tokenAddress: AOXC_TOKEN_ADDRESS,
    lastPrice: Number.isFinite(lastPrice) ? lastPrice : 0,
    priceChangePercent: Number.isFinite(priceChangePercent) ? priceChangePercent : 0,
    quoteVolume: Number.isFinite(quoteVolume) ? quoteVolume : 0,
    source,
    links: {
      okxToken: AOXC_OKX_TOKEN_URL,
      okxExplorer: AOXC_OKX_EXPLORER_URL,
    },
  };
}

export async function fetchAoxTicker(network: Network) {
  const baseUrl = resolveApiBase(network);
  const symbol = resolveMarketSymbol(network);

  return fetch(`${baseUrl}/api/v1/market/ticker?symbol=${symbol}`, {
    headers: { Accept: 'application/json' },
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

export async function fetchAoxKlines(network: Network, interval: string, limit: number) {
  const baseUrl = resolveApiBase(network);
  const symbol = resolveMarketSymbol(network);

  return fetch(`${baseUrl}/api/v1/market/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`, {
    headers: { Accept: 'application/json' },
export async function fetchAoxKlines(interval: string, limit: number) {
  return fetch(`${baseUrl}/api/v1/market/klines?symbol=AOXCUSDT&interval=${interval}&limit=${limit}`, {
    headers: {
      Accept: 'application/json',
    },
    signal: withTimeout(8000),
    cache: 'no-store',
  });
}

export function normalizeKlines(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.klines)) return payload.klines;
  return [];
}

export function getDemoTicker(network: Network) {
  return normalizeTicker(
    {
      symbol: resolveMarketSymbol(network),
      lastPrice: 0.0614,
      priceChangePercent: 0.8,
      quoteVolume: 12450000,
      source: 'demo-fallback',
    },
    network,
  );
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
