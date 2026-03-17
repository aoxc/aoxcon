import { createPublicClient, defineChain, fallback, formatUnits, getAddress, http, pad, trim } from 'viem';
import { AOXC_TOKEN_ADDRESS, getRpcFallbackOrder, type Network } from './network';
import { getRpcFallbackOrder } from './network';

const AOXC_TOKEN = getAddress(AOXC_TOKEN_ADDRESS);

const chains = {
  aoxchain: defineChain({
    id: Number(process.env.NEXT_PUBLIC_AOXCHAIN_CHAIN_ID || 2626),
    name: 'AOXCHAIN',
    network: 'aoxchain',
    nativeCurrency: {
      name: 'AOXC',
      symbol: 'AOXC',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: getRpcFallbackOrder('aoxchain') },
      public: { http: getRpcFallbackOrder('aoxchain') },
    },
  }),
  xlayer: defineChain({
    id: Number(process.env.NEXT_PUBLIC_XLAYER_CHAIN_ID || 196),
    name: 'X Layer',
    network: 'xlayer',
    nativeCurrency: {
      name: 'OKB',
      symbol: 'OKB',
      decimals: 18,
const aoxMainnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_AOX_MAINNET_CHAIN_ID || 2626),
  name: 'AOX Core Mainnet',
  network: 'aoxcore',
  nativeCurrency: {
    name: 'AOX',
    symbol: 'AOX',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: getRpcFallbackOrder('mainnet'),
    },
    public: {
      http: getRpcFallbackOrder('mainnet'),
    },
    rpcUrls: {
      default: { http: getRpcFallbackOrder('xlayer') },
      public: { http: getRpcFallbackOrder('xlayer') },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 47416,
      },
    },
  }),
};

const clients = {
  aoxchain: createPublicClient({
    chain: chains.aoxchain,
    transport: fallback(getRpcFallbackOrder('aoxchain').map((url) => http(url))),
  }),
  xlayer: createPublicClient({
    chain: chains.xlayer,
    transport: fallback(getRpcFallbackOrder('xlayer').map((url) => http(url))),
  }),
};
const client = createPublicClient({
  chain: aoxMainnet,
  transport: fallback(getRpcFallbackOrder('mainnet').map((url) => http(url))),
});

const abi = [
  { type: 'function', stateMutability: 'view', name: 'name', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', stateMutability: 'view', name: 'symbol', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', stateMutability: 'view', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', stateMutability: 'view', name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'INITIAL_SUPPLY', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'paused', inputs: [], outputs: [{ type: 'bool' }] },
  { type: 'function', stateMutability: 'view', name: 'yearlyMintLimit', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'mintedThisYear', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'lastMintTimestamp', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'maxTransferAmount', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'dailyTransferLimit', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'HARD_CAP_INFLATION_BPS', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', stateMutability: 'view', name: 'YEAR_SECONDS', inputs: [], outputs: [{ type: 'uint256' }] },
] as const;

const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc' as const;
const ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103' as const;

function decodeAddressFromSlot(slotValue: `0x${string}`): string | null {
  if (!slotValue || slotValue === '0x') return null;
  const trimmed = trim(slotValue);
  if (trimmed === '0x') return null;
  const padded = pad(trimmed, { size: 20 });
  return getAddress(padded);
}

function formatToken(value: bigint, decimals: number): string {
  return formatUnits(value, decimals);
}

function formatTimestamp(value: bigint): string | null {
  if (value === BigInt(0)) return null;
  return new Date(Number(value) * 1000).toLocaleString();
}

export async function fetchOnChainSnapshot(network: Network = 'aoxchain') {
  const target = network === 'demo' ? 'aoxchain' : network;
  const client = clients[target];

  const [chainId, blockNumber, implementationSlotValue, adminSlotValue, contractReads] = await Promise.all([
    client.getChainId(),
    client.getBlockNumber(),
    client.getStorageAt({ address: AOXC_TOKEN, slot: IMPLEMENTATION_SLOT }),
    client.getStorageAt({ address: AOXC_TOKEN, slot: ADMIN_SLOT }),
    client.multicall({
      allowFailure: false,
      multicallAddress: target === 'xlayer' ? '0xcA11bde05977b3631167028862bE2a173976CA11' : undefined,
      contracts: [
        { address: AOXC_TOKEN, abi, functionName: 'name' },
        { address: AOXC_TOKEN, abi, functionName: 'symbol' },
        { address: AOXC_TOKEN, abi, functionName: 'decimals' },
        { address: AOXC_TOKEN, abi, functionName: 'totalSupply' },
        { address: AOXC_TOKEN, abi, functionName: 'INITIAL_SUPPLY' },
        { address: AOXC_TOKEN, abi, functionName: 'paused' },
        { address: AOXC_TOKEN, abi, functionName: 'yearlyMintLimit' },
        { address: AOXC_TOKEN, abi, functionName: 'mintedThisYear' },
        { address: AOXC_TOKEN, abi, functionName: 'lastMintTimestamp' },
        { address: AOXC_TOKEN, abi, functionName: 'maxTransferAmount' },
        { address: AOXC_TOKEN, abi, functionName: 'dailyTransferLimit' },
      ],
    }),
  ]);

  const [name, symbol, decimals, totalSupply, initialSupply, paused, yearlyMintLimit, mintedThisYear, lastMintTimestamp, maxTransferAmount, dailyTransferLimit] = contractReads;
export async function fetchOnChainSnapshot() {
  try {
    const [chainId, blockNumber, implementationSlotValue, adminSlotValue, contractReads] = await Promise.all([
      client.getChainId(),
      client.getBlockNumber(),
      client.getStorageAt({
        address: AOXC_TOKEN,
        slot: IMPLEMENTATION_SLOT,
      }),
      client.getStorageAt({
        address: AOXC_TOKEN,
        slot: ADMIN_SLOT,
      }),
      client.multicall({
        allowFailure: false,
        contracts: [
          { address: AOXC_TOKEN, abi, functionName: 'name' },
          { address: AOXC_TOKEN, abi, functionName: 'symbol' },
          { address: AOXC_TOKEN, abi, functionName: 'decimals' },
          { address: AOXC_TOKEN, abi, functionName: 'totalSupply' },
          { address: AOXC_TOKEN, abi, functionName: 'INITIAL_SUPPLY' },
          { address: AOXC_TOKEN, abi, functionName: 'paused' },
          { address: AOXC_TOKEN, abi, functionName: 'yearlyMintLimit' },
          { address: AOXC_TOKEN, abi, functionName: 'mintedThisYear' },
          { address: AOXC_TOKEN, abi, functionName: 'lastMintTimestamp' },
          { address: AOXC_TOKEN, abi, functionName: 'maxTransferAmount' },
          { address: AOXC_TOKEN, abi, functionName: 'dailyTransferLimit' },
          { address: AOXC_TOKEN, abi, functionName: 'HARD_CAP_INFLATION_BPS' },
          { address: AOXC_TOKEN, abi, functionName: 'YEAR_SECONDS' },
        ],
      }),
    ]);

  const implementation = implementationSlotValue ? decodeAddressFromSlot(implementationSlotValue as `0x${string}`) : null;
  const proxyAdmin = adminSlotValue ? decodeAddressFromSlot(adminSlotValue as `0x${string}`) : null;

  return {
    observedAt: new Date().toLocaleTimeString(),
    chain: target,
    chainId,
    latestBlock: blockNumber.toString(),
    tokenAddress: AOXC_TOKEN,
    token: {
      name,
      symbol,
      decimals,
      totalSupplyFormatted: formatToken(totalSupply, decimals),
      initialSupplyFormatted: formatToken(initialSupply, decimals),
    },
    controls: {
      paused,
      maxTransferAmountFormatted: formatToken(maxTransferAmount, decimals),
      dailyTransferLimitFormatted: formatToken(dailyTransferLimit, decimals),
    },
    mintPolicy: {
      yearlyMintLimitFormatted: formatToken(yearlyMintLimit, decimals),
      mintedThisYearFormatted: formatToken(mintedThisYear, decimals),
      lastMintFormatted: formatTimestamp(lastMintTimestamp),
    },
    proxy: {
      implementation,
      admin: proxyAdmin,
    },
  };
      yearlyMintLimit,
      mintedThisYear,
      lastMintTimestamp,
      maxTransferAmount,
      dailyTransferLimit,
      hardCapInflationBps,
      yearSeconds,
    ] = contractReads;

    const implementation = implementationSlotValue ? decodeAddressFromSlot(implementationSlotValue as `0x${string}`) : null;

    const proxyAdmin = adminSlotValue ? decodeAddressFromSlot(adminSlotValue as `0x${string}`) : null;

    return {
      observedAt: new Date().toLocaleTimeString(),
      chainId,
      latestBlock: blockNumber.toString(),
      tokenAddress: AOXC_TOKEN,
      token: {
        name,
        symbol,
        decimals,
        totalSupplyFormatted: formatToken(totalSupply, decimals),
        initialSupplyFormatted: formatToken(initialSupply, decimals),
      },
      controls: {
        paused,
        maxTransferAmountFormatted: formatToken(maxTransferAmount, decimals),
        dailyTransferLimitFormatted: formatToken(dailyTransferLimit, decimals),
      },
      mintPolicy: {
        yearlyMintLimitFormatted: formatToken(yearlyMintLimit, decimals),
        mintedThisYearFormatted: formatToken(mintedThisYear, decimals),
        lastMintFormatted: formatTimestamp(lastMintTimestamp),
        hardCapInflationBps: hardCapInflationBps.toString(),
        yearSeconds: yearSeconds.toString(),
      },
      proxy: {
        implementation,
        admin: proxyAdmin,
      },
    };
  } catch (error) {
    console.error('Failed to fetch on-chain snapshot:', error);
    throw error;
  }
}
