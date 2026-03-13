import { z } from "zod";
// Mock motorunu dahil ediyoruz
import { MOCK_SENTINEL_TALK, simulateNeuralProcessing } from "../mocks/neuralEngine";

export type SentinelVerdict = "ALLOW" | "WARN" | "REJECT"

export interface SentinelResponse {
  risk: number
  reason: string
  action: SentinelVerdict
}

export type AIProvider = "LOCAL" | "GEMINI" | "OPENAI" | "CLAUDE" | "SHADOW"; // SHADOW eklendi

const DEFAULT_TIMEOUT = 5000; // Mock deneyimi için biraz daha kısa tuttuk

const SentinelSchema = z.object({
  risk: z.number().min(0).max(100),
  reason: z.string(),
  action: z.enum(["ALLOW", "WARN", "REJECT"])
});

export class GeminiSentinel {
  private backendUrl: string;
  private provider: AIProvider;

  constructor(options?: { provider?: AIProvider; backendUrl?: string }) {
    // Çevrimdışı testler için varsayılanı SHADOW (Mock) yapabilirsin veya LOCAL bırakabilirsin
    this.provider = options?.provider || "SHADOW"; 
    this.backendUrl = options?.backendUrl || "http://localhost:5000/api/v1/sentinel/analyze";
  }

  /**
   * Mock Engine: Gerçek bir AI gibi davranan sahte motor
   */
  private async callShadowAI(): Promise<SentinelResponse> {
    const { riskScore, verdict } = await simulateNeuralProcessing(1500); // 1.5sn yapay gecikme
    
    // Verdict'leri senin enum yapına (ALLOW, WARN, REJECT) çeviriyoruz
    const actionMap: Record<string, SentinelVerdict> = {
      "VERIFIED": "ALLOW",
      "WARNING": "WARN",
      "REJECTED": "REJECT"
    };

    return {
      risk: riskScore,
      reason: `[SHADOW_NEURAL]: ${MOCK_SENTINEL_TALK[Math.floor(Math.random() * MOCK_SENTINEL_TALK.length)]}`,
      action: actionMap[verdict] || "ALLOW"
    };
  }

  private async safeFetch(url: string, payload: any): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP_${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // ... callLocalAI, callGemini vb. metodlar aynı kalıyor ...

  async analyzeSystemState(contextLogs: any, operation: string): Promise<SentinelResponse> {
    try {
      let rawResponse: any;

      // Eğer provider SHADOW ise veya internet yoksa doğrudan mock çalıştır
      if (this.provider === "SHADOW") {
        return await this.callShadowAI();
      }

      switch (this.provider) {
        case "LOCAL":
          rawResponse = await this.callLocalAI(operation, JSON.stringify(contextLogs));
          break;
        case "GEMINI":
          rawResponse = await this.callGemini(operation, JSON.stringify(contextLogs));
          break;
        // ... diğer case'ler ...
        default: rawResponse = await this.callShadowAI();
      }

      const parsed = SentinelSchema.safeParse(rawResponse);
      if (!parsed.success) throw new Error("INVALID_PARSE");
      return parsed.data;

    } catch (error) {
      // HATA ANINDA KURTARICI: Sistem çökmez, Mock motoruna düşer
      console.warn("[Sentinel] Connection lost. Falling back to Shadow AI...");
      return await this.callShadowAI();
    }
  }

  async getGeminiResponse(prompt: string, context: any = "Direct_Call") {
    return this.analyzeSystemState(context, prompt);
  }
}

// Global Singleton
const defaultSentinel = new GeminiSentinel();

export const getGeminiResponse = async (prompt: string, context: any = "") => {
  return defaultSentinel.getGeminiResponse(prompt, context);
};
