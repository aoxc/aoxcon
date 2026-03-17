export type Network = 'aoxchain' | 'xlayer' | 'demo';
export type Network = 'mainnet' | 'testnet' | 'demo';

export interface NetworkProfile {
  key: Network;
  label: string;
  rpcEndpoints: string[];
  apiBaseUrl: string;
  chainId: number;
  nativeCurrencySymbol: string;
  isDemo: boolean;
  isMirror: boolean;
  isDemo: boolean;
}

const DEFAULT_LOCAL_RPC = 'http://localhost:2626';

export const NETWORK_PROFILES: Record<Network, NetworkProfile> = {
  aoxchain: {
    key: 'aoxchain',
    label: 'AOXCHAIN (aoxcore.com)',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC || 'https://rpc.aoxcore.com',
      process.env.NEXT_PUBLIC_AOXCHAIN_RPC_FALLBACK || DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOXCHAIN_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOXCHAIN_CHAIN_ID || 2626),
    nativeCurrencySymbol: 'AOXC',
    isDemo: false,
    isMirror: false,
  },
  xlayer: {
    key: 'xlayer',
    label: 'X Layer (AOXC Mirror Token)',
    rpcEndpoints: [
      process.env.NEXT_PUBLIC_XLAYER_RPC || 'https://rpc.xlayer.tech',
      process.env.NEXT_PUBLIC_XLAYER_RPC_FALLBACK || 'https://xlayerrpc.okx.com',
      DEFAULT_LOCAL_RPC,
    ],
    apiBaseUrl: process.env.NEXT_PUBLIC_XLAYER_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_XLAYER_CHAIN_ID || 196),
    nativeCurrencySymbol: 'OKB',
    isDemo: false,
    isMirror: true,
  },
  demo: {
    key: 'demo',
    label: 'Demo (Gerçek Benzeri Simülasyon)',
    rpcEndpoints: [DEFAULT_LOCAL_RPC],
    apiBaseUrl: process.env.NEXT_PUBLIC_AOX_DEMO_API || 'https://api.aoxcore.com',
    chainId: Number(process.env.NEXT_PUBLIC_AOX_DEMO_CHAIN_ID || 1337),
    nativeCurrencySymbol: 'AOXC',
    isDemo: true,
    isMirror: false,
  },
};

export const AOXC_TOKEN_ADDRESS = '0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4';
export const AOXC_OKX_TOKEN_URL = `https://web3.okx.com/tr/token/x-layer/${AOXC_TOKEN_ADDRESS}`;
export const AOXC_OKX_EXPLORER_URL = `https://web3.okx.com/tr/explorer/x-layer/token/${AOXC_TOKEN_ADDRESS}`;

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
