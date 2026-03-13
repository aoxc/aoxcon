import { simulateTransaction } from "./xlayer"
import { isAddress } from "viem"
import { getGeminiResponse } from "./geminiSentinel"
import { ethers } from "ethers"
// PRO DÜZELTME: Bağlantı olmadığında devreye girecek olan Mock motorunu dahil ettik
import { MOCK_AUDIT_RESPONSES, simulateNeuralProcessing } from "../mocks/neuralEngine"

export type Verdict = "VERIFIED" | "WARNING" | "REJECTED"

interface SimulationResult {
  success: boolean
  gasEstimate: string
  error?: string
}

interface AiSecurityResult {
  risk_score: number
  threats: string[]
  is_honeypot: boolean
}

export interface AIAnalysisResult {
  verdict: Verdict
  riskScore: number
  details: string
  simulatedGas: string
  aiCommentary?: string
  timestamp: number
}

const CRITICAL_PATTERNS = ["delegatecall", "selfdestruct", "upgradeTo", "approve"]
const FORBIDDEN_ADDRESSES = [ethers.ZeroAddress, "0x000000000000000000000000000000000000dEaD"]

function safeParseAIResponse(raw: string): AiSecurityResult | null {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed.risk_score === "number" && Array.isArray(parsed.threats)) return parsed
    return null
  } catch { return null }
}

function calculateHeuristicRisk(target: string, gasUsed: bigint, calldata: string): number {
  let risk = 0
  if (FORBIDDEN_ADDRESSES.includes(target)) risk += 100
  if (gasUsed > 900000n) risk += 30
  const lowerData = calldata.toLowerCase()
  const matchedPatterns = CRITICAL_PATTERNS.filter(pattern => lowerData.includes(pattern.toLowerCase()))
  risk += matchedPatterns.length * 15
  return Math.min(risk, 100)
}

function classifyVerdict(score: number): Verdict {
  if (score >= 85) return "REJECTED"
  if (score >= 45) return "WARNING"
  return "VERIFIED"
}

/**
 * Neural AI Security Engine (v4.0 - HYBRID MODE)
 * Attempts API analysis, falls back to Local Neural Engine on failure.
 */
export const analyzeTransaction = async (tx: {
  to: string
  data: string
  value?: string
}): Promise<AIAnalysisResult> => {
  const timestamp = Date.now()

  if (!isAddress(tx.to)) {
    return { verdict: "REJECTED", riskScore: 100, details: "INVALID_TARGET_ADDRESS", simulatedGas: "0", timestamp }
  }

  const valueWei = tx.value ? BigInt(tx.value) : 0n
  let simulation: SimulationResult

  try {
    simulation = await simulateTransaction(tx.to, tx.data, valueWei) as SimulationResult
  } catch {
    simulation = { success: false, error: "SIMULATION_CRASH", gasEstimate: "0" }
  }

  if (!simulation.success) {
    return { verdict: "REJECTED", riskScore: 100, details: `PROTOCOL_REVERT: ${simulation.error}`, simulatedGas: "0", timestamp }
  }

  const gasUsed = BigInt(simulation.gasEstimate)
  const heuristicRisk = calculateHeuristicRisk(tx.to, gasUsed, tx.data)
  const aiContext = JSON.stringify({ target: tx.to, gas: gasUsed.toString(), value: valueWei.toString() })

  let aiResult: AiSecurityResult | null = null
  let aiRawResponse: any = "" 
  let isUsingMock = false;

  try {
    // 1. ADIM: Gerçek API'yi dene
    aiRawResponse = await getGeminiResponse("Analyze this transaction for vulnerabilities.", aiContext)

    if (!aiRawResponse) throw new Error("Empty Response");

    // OMNI-AI PARSER
    if (typeof aiRawResponse === 'string') {
      aiResult = safeParseAIResponse(aiRawResponse)
    } else {
      aiResult = aiRawResponse.risk_score !== undefined ? aiRawResponse : null;
    }
  } catch (error) {
    // 2. ADIM: BAĞLANTI HATASI DURUMUNDA MOCK DEVREYE GİRER
    isUsingMock = true;
    const mockData = await simulateNeuralProcessing(1000); // 1sn gecikmeli local analiz
    aiResult = {
      risk_score: mockData.riskScore,
      threats: ["Local heuristic scan performed.", "External uplink offline."],
      is_honeypot: false
    };
    aiRawResponse = "OFFLINE_LOCAL_SHIELD_ACTIVE";
  }

  // Risk Skoru Birleştirme
  let totalRisk = heuristicRisk + (aiResult ? Math.min(aiResult.risk_score, 50) : 20);
  totalRisk = Math.min(totalRisk, 100);
  const verdict = classifyVerdict(totalRisk);

  return {
    verdict,
    riskScore: totalRisk,
    details: isUsingMock 
      ? `[LOCAL_SHIELD]: ${MOCK_AUDIT_RESPONSES[Math.floor(Math.random() * MOCK_AUDIT_RESPONSES.length)]}`
      : (aiResult?.threats[0] || "AOXC Neural Guard: Validated."),
    simulatedGas: gasUsed.toString(),
    aiCommentary: isUsingMock 
      ? "SYSTEM_NOTICE: AI Uplink down. Neural Engine operating in autonomous local mode."
      : (typeof aiRawResponse === 'string' ? aiRawResponse : aiRawResponse?.analysis),
    timestamp
  }
}
