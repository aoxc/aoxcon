export type Network = 'mainnet' | 'testnet' | 'demo';

export interface NetworkProfile {
  key: Network;
  label: string;
  rpcEndpoints: string[];
  apiBaseUrl: string;
  chainId: number;
  isDemo: boolean;
}

const DEFAULT_LOCAL_RPC = 'http://localhost:2626';

export const NETWORK_PROFILES: Record<Network, NetworkProfile> = {
  mainnet: {
    key: 'mainnet',
    label: 'X Layer Mainnet',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOX_MAINNET_RPC || 'https://rpc.xlayer.tech',
      process.env.NEXT_PUBLIC_AOX_MAINNET_RPC_FALLBACK || 'https://xlayerrpc.okx.com',
      DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_MAINNET_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_MAINNET_CHAIN_ID || 196),
    isDemo: false,
  },
  testnet: {
    key: 'testnet',
    label: 'X Layer Testnet',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOX_TESTNET_RPC || 'https://testrpc.xlayer.tech',
      process.env.NEXT_PUBLIC_AOX_TESTNET_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_TESTNET_API || 'https://api-test.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_TESTNET_CHAIN_ID || 195),
    isDemo: false,
  },
  demo: {
    key: 'demo',
    label: 'Demo (Local Simulation)',
    rpcEndpoints: [DEFAULT_LOCAL_RPC],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_DEMO_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_DEMO_CHAIN_ID || 1337),
    isDemo: true,
  },
};

export const AOXC_TOKEN_ADDRESS = '0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4';
export const AOXC_OKX_TOKEN_URL = `https://web3.okx.com/tr/token/x-layer/${AOXC_TOKEN_ADDRESS}`;
export const AOXC_OKX_EXPLORER_URL = `https://web3.okx.com/tr/explorer/x-layer/token/${AOXC_TOKEN_ADDRESS}`;

export function getNetworkProfile(network: Network): NetworkProfile {
  return NETWORK_PROFILES[network];
}

export function getRpcFallbackOrder(network: Network): string[] {
  return getNetworkProfile(network).rpcEndpoints;
}
