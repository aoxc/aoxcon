export type Network = 'main' | 'xlayer' | 'cardano' | 'sui';

export interface NetworkProfile {
  key: Network;
  label: string;
  family: 'evm' | 'cardano' | 'sui';
  rpcEndpoints: string[];
  apiBaseUrl: string;
  jsonRpcUrl: string;
  wsUrl?: string;
  grpcHost?: string;
  chainId?: number;
  nativeCurrencySymbol: string;
  marketSymbol: string;
  explorerUrl?: string;
  tokenAddress?: string;
  aoxcTokenIsNativeEquivalent: boolean;
}

const DEFAULT_LOCAL_RPC = 'http://localhost:2626';

export const NETWORK_PROFILES: Record<Network, NetworkProfile> = {
  main: {
    key: 'main',
    label: 'AOX Mainnet',
    family: 'evm',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC || 'https://api.aoxcore.com/rpc/v1',
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl:
      process.env.NEXT_PUBLIC_AOXCHAIN_API || 'https://api.aoxcore.com/api/v1',
    jsonRpcUrl: process.env.NEXT_PUBLIC_AOXCHAIN_RPC || 'https://api.aoxcore.com/rpc/v1',
    wsUrl: process.env.NEXT_PUBLIC_AOXCHAIN_WS || 'wss://ws.aoxcore.com/ws/v1',
    grpcHost: process.env.NEXT_PUBLIC_AOXCHAIN_GRPC || 'grpc.aoxcore.com:443',
    chainId: Number(process.env.NEXT_PUBLIC_AOXCHAIN_CHAIN_ID || 2626),
    nativeCurrencySymbol: 'AOXC',
    marketSymbol: process.env.NEXT_PUBLIC_AOX_MARKET_SYMBOL || 'AOXCUSDT',
    explorerUrl: process.env.NEXT_PUBLIC_AOXCHAIN_EXPLORER || 'https://aoxscan.aoxcore.com',
    aoxcTokenIsNativeEquivalent: true,
  },
  xlayer: {
    key: 'xlayer',
    label: 'XLayer',
    family: 'evm',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_XLAYER_RPC || 'https://rpc.xlayer.tech',
      process.env.NEXT_PUBLIC_XLAYER_RPC_FALLBACK || 'https://rpc.ankr.com/xlayer',
    ],
    apiBaseUrl:
      process.env.NEXT_PUBLIC_XLAYER_API_PROXY || 'https://api.aoxcore.com/api/v1',
    jsonRpcUrl: process.env.NEXT_PUBLIC_XLAYER_RPC || 'https://rpc.xlayer.tech',
    wsUrl: process.env.NEXT_PUBLIC_XLAYER_WS || 'wss://ws.xlayer.tech',
    chainId: Number(process.env.NEXT_PUBLIC_XLAYER_CHAIN_ID || 196),
    nativeCurrencySymbol: 'OKB',
    marketSymbol: process.env.NEXT_PUBLIC_XLAYER_MARKET_SYMBOL || 'OKBUSDT',
    explorerUrl:
      process.env.NEXT_PUBLIC_XLAYER_EXPLORER || 'https://www.oklink.com/xlayer',
    tokenAddress:
      process.env.NEXT_PUBLIC_AOXC_ON_XLAYER_TOKEN ||
      '0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4',
    aoxcTokenIsNativeEquivalent: true,
  },
  cardano: {
    key: 'cardano',
    label: 'Cardano',
    family: 'cardano',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_CARDANO_API || 'https://cardano-mainnet.blockfrost.io/api/v0',
    ],
    apiBaseUrl:
      process.env.NEXT_PUBLIC_CARDANO_API_PROXY || 'https://api.aoxcore.com/api/v1',
    jsonRpcUrl:
      process.env.NEXT_PUBLIC_CARDANO_API || 'https://cardano-mainnet.blockfrost.io/api/v0',
    nativeCurrencySymbol: 'ADA',
    marketSymbol: process.env.NEXT_PUBLIC_CARDANO_MARKET_SYMBOL || 'ADAUSDT',
    explorerUrl:
      process.env.NEXT_PUBLIC_CARDANO_EXPLORER || 'https://cardanoscan.io',
    aoxcTokenIsNativeEquivalent: false,
  },
  sui: {
    key: 'sui',
    label: 'Sui',
    family: 'sui',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_SUI_RPC || 'https://fullnode.mainnet.sui.io:443',
    ],
    apiBaseUrl:
      process.env.NEXT_PUBLIC_SUI_API_PROXY || 'https://api.aoxcore.com/api/v1',
    jsonRpcUrl: process.env.NEXT_PUBLIC_SUI_RPC || 'https://fullnode.mainnet.sui.io:443',
    nativeCurrencySymbol: 'SUI',
    marketSymbol: process.env.NEXT_PUBLIC_SUI_MARKET_SYMBOL || 'SUIUSDT',
    explorerUrl:
      process.env.NEXT_PUBLIC_SUI_EXPLORER || 'https://suivision.xyz',
    aoxcTokenIsNativeEquivalent: false,
  },
};

export const SUPPORTED_NETWORKS = Object.keys(NETWORK_PROFILES) as Network[];

export const AOXC_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_AOXC_TOKEN_ADDRESS ||
  '0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4';
export const AOXC_OKX_TOKEN_URL = `https://web3.okx.com/tr/token/x-layer/${AOXC_TOKEN_ADDRESS}`;
export const AOXC_OKX_EXPLORER_URL = `https://web3.okx.com/tr/explorer/x-layer/token/${AOXC_TOKEN_ADDRESS}`;

export function getNetworkProfile(network: Network = 'main'): NetworkProfile {
  return NETWORK_PROFILES[network];
}

export function getRpcFallbackOrder(network: Network = 'main'): string[] {
  return getNetworkProfile(network).rpcEndpoints;
}

export function getMarketSymbol(network: Network = 'main'): string {
  return getNetworkProfile(network).marketSymbol;
}
