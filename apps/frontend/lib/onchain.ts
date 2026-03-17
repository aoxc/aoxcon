import {
  createPublicClient,
  defineChain,
  fallback,
  formatUnits,
  getAddress,
  http,
  pad,
  trim,
} from 'viem';

const AOXC_TOKEN = getAddress('0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4');

const xLayer = defineChain({
  id: 196,
  name: 'X Layer',
  network: 'xlayer',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.xlayer.tech', 'https://xlayerrpc.okx.com'],
    },
    public: {
      http: ['https://rpc.xlayer.tech', 'https://xlayerrpc.okx.com'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 47416,
    },
  },
});

const client = createPublicClient({
  chain: xLayer,
  transport: fallback([
    http('https://rpc.xlayer.tech'),
    http('https://xlayerrpc.okx.com'),
  ]),
});

const abi = [
  {
    type: 'function',
    stateMutability: 'view',
    name: 'name',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'decimals',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'INITIAL_SUPPLY',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'paused',
    inputs: [],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'yearlyMintLimit',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'mintedThisYear',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'lastMintTimestamp',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'maxTransferAmount',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'dailyTransferLimit',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'HARD_CAP_INFLATION_BPS',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'YEAR_SECONDS',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
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

export async function fetchOnChainSnapshot() {
  try {
    const [
      chainId,
      blockNumber,
      implementationSlotValue,
      adminSlotValue,
      contractReads,
    ] = await Promise.all([
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
        multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
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

    const [
      name,
      symbol,
      decimals,
      totalSupply,
      initialSupply,
      paused,
      yearlyMintLimit,
      mintedThisYear,
      lastMintTimestamp,
      maxTransferAmount,
      dailyTransferLimit,
      hardCapInflationBps,
      yearSeconds,
    ] = contractReads;

    const implementation = implementationSlotValue
      ? decodeAddressFromSlot(implementationSlotValue as `0x${string}`)
      : null;

    const proxyAdmin = adminSlotValue
      ? decodeAddressFromSlot(adminSlotValue as `0x${string}`)
      : null;

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
