import {
  Contract,
  JsonRpcProvider,
  formatUnits,
  isAddress,
  type InterfaceAbi
} from "ethers"

const CORE_ABI: InterfaceAbi = [
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function getMintPolicy() view returns (uint256 yearlyLimit, uint256 mintedInCurrentYear, uint256 windowStart)",
  "function getAiStatus() view returns (bool isActive, uint256 currentNeuralThreshold)",
  "function isNeuralProtectEnabled(address account) view returns (bool)",
  "function isCriticalAddress(address account) view returns (bool)"
]

export interface NeuralDashboardState {
  totalSupply: string
  yearlyLimit: string
  mintedInCurrentYear: string
  windowStart: number
  aiActive: boolean
  neuralThreshold: string
  neuralProtectEnabled: boolean
  criticalAddress: boolean
}

const providerCache: Map<string, JsonRpcProvider> = new Map()

function getProvider(rpcUrl: string): JsonRpcProvider {

  if (providerCache.has(rpcUrl)) {
    return providerCache.get(rpcUrl)!
  }

  const provider = new JsonRpcProvider(rpcUrl)

  providerCache.set(rpcUrl, provider)

  return provider
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeout = 6000
): Promise<T> {

  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("RPC_TIMEOUT")), timeout)
    )
  ])
}

export class AoxcConnector {

  private provider: JsonRpcProvider
  private core: Contract

  constructor(rpcUrl: string, coreAddress: string) {

    if (!isAddress(coreAddress)) {
      throw new Error("Invalid AOXC core contract address")
    }

    this.provider = getProvider(rpcUrl)

    this.core = new Contract(
      coreAddress,
      CORE_ABI,
      this.provider
    )
  }

  async fetchDashboardState(account: string): Promise<NeuralDashboardState> {

    if (!isAddress(account)) {

      return {
        totalSupply: "0.00",
        yearlyLimit: "0.00",
        mintedInCurrentYear: "0.00",
        windowStart: 0,
        aiActive: false,
        neuralThreshold: "0",
        neuralProtectEnabled: false,
        criticalAddress: false
      }
    }

    try {

      const decimals = await withTimeout(this.core.decimals())

      const [
        supply,
        mintPolicy,
        aiStatus,
        protect,
        critical
      ] = await Promise.all([

        withTimeout(this.core.totalSupply()),
        withTimeout(this.core.getMintPolicy()),
        withTimeout(this.core.getAiStatus()),
        withTimeout(this.core.isNeuralProtectEnabled(account)),
        withTimeout(this.core.isCriticalAddress(account))

      ])

      return {

        totalSupply: formatUnits(supply, decimals),

        yearlyLimit: formatUnits(
          mintPolicy.yearlyLimit ?? mintPolicy[0],
          decimals
        ),

        mintedInCurrentYear: formatUnits(
          mintPolicy.mintedInCurrentYear ?? mintPolicy[1],
          decimals
        ),

        windowStart: Number(
          mintPolicy.windowStart ?? mintPolicy[2]
        ),

        aiActive: Boolean(
          aiStatus.isActive ?? aiStatus[0]
        ),

        neuralThreshold: String(
          aiStatus.currentNeuralThreshold ?? aiStatus[1]
        ),

        neuralProtectEnabled: Boolean(protect),

        criticalAddress: Boolean(critical)
      }

    } catch (err) {

      console.warn("AOXC dashboard read failed", err)

      return {
        totalSupply: "0.00",
        yearlyLimit: "0.00",
        mintedInCurrentYear: "0.00",
        windowStart: 0,
        aiActive: false,
        neuralThreshold: "0",
        neuralProtectEnabled: false,
        criticalAddress: false
      }
    }
  }
}
