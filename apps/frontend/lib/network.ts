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
    label: 'Mainnet',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOX_MAINNET_RPC || 'https://rpc.aoxcore.com',
      process.env.NEXT_PUBLIC_AOX_MAINNET_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_MAINNET_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_MAINNET_CHAIN_ID || 2626),
    isDemo: false,
  },
  testnet: {
    key: 'testnet',
    label: 'Testnet',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOX_TESTNET_RPC || 'https://rpc-test.aoxcore.com',
      process.env.NEXT_PUBLIC_AOX_TESTNET_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_TESTNET_API || 'https://api-test.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_TESTNET_CHAIN_ID || 26260),
    isDemo: false,
  },
  demo: {
    key: 'demo',
    label: 'Demo Mode',
    rpcEndpoints: [DEFAULT_LOCAL_RPC],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_DEMO_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_DEMO_CHAIN_ID || 1337),
    isDemo: true,
  },
};

export function getNetworkProfile(network: Network): NetworkProfile {
  return NETWORK_PROFILES[network];
}

export function getRpcFallbackOrder(network: Network): string[] {
  return getNetworkProfile(network).rpcEndpoints;
}
