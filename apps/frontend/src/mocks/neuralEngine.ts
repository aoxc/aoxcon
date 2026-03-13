/**
 * @title AOXC Neural OS - Shadow AI Mock Engine
 * @version 4.0.0-SHADOW
 * @notice Centralized simulation logic providing deterministic fallbacks when 
 * external AI Uplinks are severed or degraded.
 */

// --- TECHNICAL AUDIT NARRATIVES ---
export const MOCK_AUDIT_RESPONSES = [
  "HYBRID_SCAN: Static analysis confirms bytecode integrity. No re-entrancy vectors found.",
  "HEURISTIC_OK: State mutation patterns align with standard protocol behavior.",
  "RESOURCE_AUDIT: Gas allocation optimized for X-Layer throughput constraints.",
  "ZK_VERIFIED: Zero-knowledge circuit parameters verified. Logic gates consistent.",
  "MOVE_SECURE: Object capability boundaries strictly enforced. No leakage detected.",
  "UTXO_VALID: Deterministic graph traversal confirms absolute input/output parity."
];

// --- SENTINEL STATUS UPDATES ---
export const MOCK_SENTINEL_TALK = [
  "SYSTEM_HEALTH: Operational parameters within optimal ranges. Load is nominal.",
  "NODE_SYNC: Minor congestion on Sui nodes detected; X-Layer integrity is persistent.",
  "FORENSIC_OK: Security audit of last 128 blocks shows no anomalous signature patterns.",
  "NEURAL_HEARTBEAT: Matrix synchronization at 99.98%. Heartbeat remains stable.",
  "MEMPOOL_SCAN: Heuristic filters report 0.00% exploit probability in current pool."
];

// --- CRITICAL FAILURE MESSAGES ---
export const MOCK_FAILURE_NOTICES = [
  "UPLINK_DEGRADED: External AI connectivity lost. Switching to Local Shadow Engine.",
  "FAILSAFE_ENGAGED: Autonomous neural heuristics active. Security standards maintained.",
  "OFFLINE_MODE: Operating on internal risk-scoring matrix. Real-time LLM sync suspended."
];

/**
 * @notice Simulates advanced AI decision making with calibrated latencies.
 * @dev This prevents UI thread locking while maintaining the 'thinking' effect.
 */
export const simulateNeuralProcessing = async (delay = 1800) => {
  // Gerçekçi bir 'düşünme' süreci simülasyonu
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // %0-15 arası risk (Genelde güvenli), nadiren %30 (Warning)
  const isHealthy = Math.random() > 0.1;
  const riskScore = isHealthy ? Math.floor(Math.random() * 12) : Math.floor(Math.random() * 40);
  
  return {
    riskScore,
    verdict: riskScore > 35 ? "REJECTED" : riskScore > 15 ? "WARNING" : "VERIFIED" as const,
    isMock: true // Sisteme bu verinin mock olduğunu bildirir
  };
};

/**
 * @notice Returns a technical status message based on system online state.
 */
export const getSystemStatusMessage = (isOnline: boolean) => {
  if (!isOnline) {
    return MOCK_FAILURE_NOTICES[Math.floor(Math.random() * MOCK_FAILURE_NOTICES.length)];
  }
  return MOCK_SENTINEL_TALK[Math.floor(Math.random() * MOCK_SENTINEL_TALK.length)];
};
