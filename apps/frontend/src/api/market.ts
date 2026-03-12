export type SupportedSymbol = 'AOXC' | 'OKB' | 'SUI' | 'ADA';

export type MarketWidgetStatus =
  | 'OK'
  | 'LOADING'
  | 'NO_DATA'
  | 'ERROR'
  | 'STALE';

export interface MarketTicker {
  symbol: SupportedSymbol;
  price: number;
  change24h: number;
  lastUpdatedAt: number | null;
  status: MarketWidgetStatus;
  source: 'AOXC_CUSTOM' | 'COINGECKO';
}

interface CoingeckoCoinPayload {
  usd?: number;
  usd_24h_change?: number | null;
  last_updated_at?: number;
}

type CoingeckoResponse = Partial<
  Record<'okb' | 'sui' | 'cardano', CoingeckoCoinPayload>
>;

/**
 * @notice Immutable fallback model returned when a provider cannot supply valid market data.
 * @dev The UI layer must remain render-safe under all network, parsing, or provider failure modes.
 *      For that reason, the service returns a structured degraded object instead of throwing.
 */
function createNoDataTicker(
  symbol: SupportedSymbol,
  source: MarketTicker['source'],
  status: Exclude<MarketWidgetStatus, 'OK' | 'LOADING'>
): MarketTicker {
  return {
    symbol,
    price: Number.NaN,
    change24h: Number.NaN,
    lastUpdatedAt: null,
    status,
    source,
  };
}

/**
 * @notice Validates numeric input received from third-party providers.
 * @dev Rejects non-finite values to prevent unsafe UI formatting and misleading displays.
 */
function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * @notice Parses a single CoinGecko asset payload into the internal market model.
 * @dev A missing or non-finite price invalidates the record. A nullable 24h change is tolerated
 *      because the upstream provider documents that this field can be null in some conditions.
 */
function parseCoingeckoTicker(
  symbol: Extract<SupportedSymbol, 'OKB' | 'SUI' | 'ADA'>,
  payload: CoingeckoCoinPayload | undefined
): MarketTicker {
  const price = toFiniteNumber(payload?.usd);
  const change24h = toFiniteNumber(payload?.usd_24h_change);
  const lastUpdatedAt = toFiniteNumber(payload?.last_updated_at);

  if (price === null) {
    return createNoDataTicker(symbol, 'COINGECKO', 'NO_DATA');
  }

  return {
    symbol,
    price,
    change24h: change24h ?? Number.NaN,
    lastUpdatedAt,
    status: lastUpdatedAt ? 'OK' : 'STALE',
    source: 'COINGECKO',
  };
}

/**
 * @notice Fetches market data for CoinGecko-listed assets.
 * @dev This provider intentionally does not throw for content-level issues. It only throws for
 *      transport-level failures, while malformed per-asset records are downgraded individually.
 */
async function fetchCoingeckoTickers(
  signal?: AbortSignal
): Promise<Record<'OKB' | 'SUI' | 'ADA', MarketTicker>> {
  const url =
    'https://api.coingecko.com/api/v3/simple/price' +
    '?ids=okb,sui,cardano' +
    '&vs_currencies=usd' +
    '&include_24hr_change=true' +
    '&include_last_updated_at=true';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  const json = (await response.json()) as CoingeckoResponse;

  return {
    OKB: parseCoingeckoTicker('OKB', json.okb),
    SUI: parseCoingeckoTicker('SUI', json.sui),
    ADA: parseCoingeckoTicker('ADA', json.cardano),
  };
}

interface AoxcEndpointPayload {
  priceUsd?: number | null;
  change24h?: number | null;
  lastUpdatedAt?: number | null;
}

/**
 * @notice Fetches AOXC market data from the project-defined upstream endpoint.
 * @dev AOXC is treated as a first-class internal asset. The endpoint is injected via environment
 *      configuration so the frontend remains deployment-agnostic and infrastructure-compatible.
 *
 *      Expected JSON response:
 *      {
 *        "priceUsd": 0.038409,
 *        "change24h": 2.18,
 *        "lastUpdatedAt": 1711356300
 *      }
 */
async function fetchAoxcTicker(signal?: AbortSignal): Promise<MarketTicker> {
  const endpoint = import.meta.env.VITE_AOXC_PRICE_ENDPOINT;

  if (!endpoint || typeof endpoint !== 'string') {
    return createNoDataTicker('AOXC', 'AOXC_CUSTOM', 'NO_DATA');
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    return createNoDataTicker('AOXC', 'AOXC_CUSTOM', 'ERROR');
  }

  const json = (await response.json()) as AoxcEndpointPayload;

  const price = toFiniteNumber(json.priceUsd);
  const change24h = toFiniteNumber(json.change24h);
  const lastUpdatedAt = toFiniteNumber(json.lastUpdatedAt);

  if (price === null) {
    return createNoDataTicker('AOXC', 'AOXC_CUSTOM', 'NO_DATA');
  }

  return {
    symbol: 'AOXC',
    price,
    change24h: change24h ?? Number.NaN,
    lastUpdatedAt,
    status: lastUpdatedAt ? 'OK' : 'STALE',
    source: 'AOXC_CUSTOM',
  };
}

/**
 * @notice Loads the complete market strip model used by the header.
 * @dev Promise.allSettled is intentionally used so one provider failure does not cascade into
 *      total widget failure. This is critical for observability-oriented dashboards.
 */
export async function fetchHeaderMarketData(
  signal?: AbortSignal
): Promise<Record<SupportedSymbol, MarketTicker>> {
  const [aoxcResult, cgResult] = await Promise.allSettled([
    fetchAoxcTicker(signal),
    fetchCoingeckoTickers(signal),
  ]);

  const aoxc =
    aoxcResult.status === 'fulfilled'
      ? aoxcResult.value
      : createNoDataTicker('AOXC', 'AOXC_CUSTOM', 'ERROR');

  const coingecko =
    cgResult.status === 'fulfilled'
      ? cgResult.value
      : {
          OKB: createNoDataTicker('OKB', 'COINGECKO', 'ERROR'),
          SUI: createNoDataTicker('SUI', 'COINGECKO', 'ERROR'),
          ADA: createNoDataTicker('ADA', 'COINGECKO', 'ERROR'),
        };

  return {
    AOXC: aoxc,
    OKB: coingecko.OKB,
    SUI: coingecko.SUI,
    ADA: coingecko.ADA,
  };
}
