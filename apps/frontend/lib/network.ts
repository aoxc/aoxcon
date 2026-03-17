export type Network = 'main';

export interface NetworkProfile {
  key: Network;
  label: string;
  rpcEndpoints: string[];
  apiBaseUrl: string;
  jsonRpcUrl: string;
  wsUrl: string;
  grpcHost: string;
  xlayerApiBase: string;
  xlayerRpcUrl: string;
  chainId: number;
  nativeCurrencySymbol: string;
  aoxcTokenIsNativeEquivalent: boolean;
}

const DEFAULT_LOCAL_RPC = 'http://localhost:2626';

export const NETWORK_PROFILES: Record<Network, NetworkProfile> = {
  main: {
    key: 'main',
    label: 'AOX Mainnet',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC || 'https://api.aoxcore.com/rpc/v1',
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOXCHAIN_API || 'https://api.aoxcore.com/api/v1',
    jsonRpcUrl: process.env.NEXT_PUBLIC_AOXCHAIN_RPC || 'https://api.aoxcore.com/rpc/v1',
    wsUrl: process.env.NEXT_PUBLIC_AOXCHAIN_WS || 'wss://ws.aoxcore.com/ws/v1',
    grpcHost: process.env.NEXT_PUBLIC_AOXCHAIN_GRPC || 'grpc.aoxcore.com:443',
    xlayerApiBase: process.env.NEXT_PUBLIC_XLAYER_API || 'https://api.xlayer.tech',
    xlayerRpcUrl: process.env.NEXT_PUBLIC_XLAYER_RPC || 'https://rpc.xlayer.tech',
    chainId: Number(process.env.NEXT_PUBLIC_AOXCHAIN_CHAIN_ID || 2626),
    nativeCurrencySymbol: 'AOXC',
    aoxcTokenIsNativeEquivalent: true,
  },
};

export const AOXC_TOKEN_ADDRESS = '0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4';
export const AOXC_OKX_TOKEN_URL = `https://web3.okx.com/tr/token/x-layer/${AOXC_TOKEN_ADDRESS}`;
export const AOXC_OKX_EXPLORER_URL = `https://web3.okx.com/tr/explorer/x-layer/token/${AOXC_TOKEN_ADDRESS}`;

export function getNetworkProfile(network: Network = 'main'): NetworkProfile {
  return NETWORK_PROFILES[network];
}

export function getRpcFallbackOrder(network: Network = 'main'): string[] {
  return getNetworkProfile(network).rpcEndpoints;
}

export function getMarketSymbol(_network: Network = 'main'): string {
  return process.env.NEXT_PUBLIC_AOX_MARKET_SYMBOL || 'AOXCUSDT';
}
