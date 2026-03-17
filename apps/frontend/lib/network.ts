export type Network = 'main';

export interface NetworkProfile {
  key: Network;
  label: string;
  rpcEndpoints: string[];
  apiBaseUrl: string;
  chainId: number;
  nativeCurrencySymbol: string;
}

const DEFAULT_LOCAL_RPC = 'http://localhost:2626';

export const NETWORK_PROFILES: Record<Network, NetworkProfile> = {
  main: {
    key: 'main',
    label: 'AOX Mainnet',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC || 'https://rpc.aoxcore.com',
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOXCHAIN_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOXCHAIN_CHAIN_ID || 2626),
    nativeCurrencySymbol: 'AOXC',
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
