import { ethers, JsonRpcProvider, Contract, type InterfaceAbi } from "ethers"

export enum ChainId {
  XLAYER_MAINNET = 196,
  XLAYER_TESTNET = 195
}

type NetworkConfig = {
  name: string
  rpc: string[]
  aoxc: string
}

const NETWORKS: Record<number, NetworkConfig> = {
  [ChainId.XLAYER_MAINNET]: {
    name: "X-Layer Mainnet",
    rpc: [
      "https://rpc.xlayer.tech",
      "https://rpc2.xlayer.tech"
    ],
    aoxc: "0xeb9580c3946bb47d73aae1d4f7a94148b554b2f4"
  },

  [ChainId.XLAYER_TESTNET]: {
    name: "X-Layer Testnet",
    rpc: [
      "https://testrpc.xlayer.tech"
    ],
    aoxc: "0xYourTestnetTokenAddress"
  }
}

export interface NeuralBalance {
  okb: string
  aoxc: string
}

export const ERC20_ABI: InterfaceAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
]

const providerPool: Map<number, JsonRpcProvider> = new Map()

export const getProvider = (chainId: number = ChainId.XLAYER_MAINNET): JsonRpcProvider => {

  if (providerPool.has(chainId)) {
    return providerPool.get(chainId)!
  }

  const config = NETWORKS[chainId]

  if (!config) {
    throw new Error("Unsupported chain")
  }

  const provider = new JsonRpcProvider(config.rpc[0])

  providerPool.set(chainId, provider)

  return provider
}

let lastCall = 0

export const throttleRequest = async <T>(fn: () => Promise<T>): Promise<T> => {

  const now = Date.now()

  if (now - lastCall < 150) {
    await new Promise(r => setTimeout(r, 150))
  }

  lastCall = Date.now()

  return fn()
}

export const getSecureContract = (
  address: string,
  abi: InterfaceAbi,
  chainId: number = ChainId.XLAYER_MAINNET
) => {

  const provider = getProvider(chainId)

  return new Contract(address, abi, provider)
}

export const getAoxcBalance = async (
  address: string,
  chainId: number = ChainId.XLAYER_MAINNET
): Promise<string> => {

  if (!ethers.isAddress(address)) {
    return "0.00"
  }

  const config = NETWORKS[chainId]

  return throttleRequest(async () => {

    try {

      const contract = getSecureContract(config.aoxc, ERC20_ABI, chainId)

      const [balance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals()
      ])

      return ethers.formatUnits(balance, decimals)

    } catch (err) {

      console.warn("AOXC balance read failed", err)

      return "0.00"
    }
  })
}

export const getNeuralBalances = async (
  address: string,
  chainId: number = ChainId.XLAYER_MAINNET
): Promise<NeuralBalance> => {

  if (!ethers.isAddress(address)) {
    return { okb: "0.00", aoxc: "0.00" }
  }

  try {

    const provider = getProvider(chainId)

    const [nativeBalance, tokenBalance] = await Promise.all([
      provider.getBalance(address),
      getAoxcBalance(address, chainId)
    ])

    return {
      okb: ethers.formatEther(nativeBalance),
      aoxc: tokenBalance
    }

  } catch (err) {

    console.warn("Balance read failed", err)

    return { okb: "0.00", aoxc: "0.00" }
  }
}

export const simulateTransaction = async (
  to: string,
  data: string,
  value: bigint = 0n,
  chainId: number = ChainId.XLAYER_MAINNET
) => {

  return throttleRequest(async () => {

    try {

      const provider = getProvider(chainId)

      const gasEstimate = await provider.estimateGas({
        to,
        data,
        value
      })

      await provider.call({
        to,
        data,
        value
      })

      return {
        success: true,
        gasEstimate: gasEstimate.toString(),
        risk: "LOW",
        timestamp: Date.now()
      }

    } catch (error: any) {

      let risk = "HIGH"

      if (error.message?.includes("revert")) {
        risk = "CRITICAL"
      }

      return {
        success: false,
        error: error.reason || error.message,
        gasEstimate: "0",
        risk,
        timestamp: Date.now()
      }
    }
  })
}

export const getBlockNumber = async (chainId: number = ChainId.XLAYER_MAINNET) => {
  return getProvider(chainId).getBlockNumber()
}

export const getGasPrice = async (chainId: number = ChainId.XLAYER_MAINNET) => {
  return getProvider(chainId).getFeeData()
}

export const getBalance = async (
  address: string,
  chainId: number = ChainId.XLAYER_MAINNET
) => {

  const provider = getProvider(chainId)

  const balance = await provider.getBalance(address)

  return ethers.formatEther(balance)
}

export const getLogs = async (
  filter: ethers.Filter,
  chainId: number = ChainId.XLAYER_MAINNET
) => {

  const provider = getProvider(chainId)

  return provider.getLogs(filter)
}

export const debugTrace = async (
  txHash: string,
  chainId: number = ChainId.XLAYER_MAINNET
) => {

  const provider = getProvider(chainId)

  return provider.send("debug_traceTransaction", [txHash, {}])
}
