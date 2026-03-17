const express = require('express');
const rateLimit = require('express-rate-limit');
const { analyze } = require('../controllers/sentinelController');
const {
  getAoxchainStatus,
  getGovernanceProposals,
  createRelayDeployment,
  getRelayDeployments,
} = require('../controllers/aoxchainController');
const {
  validateAnalyzePayload,
  validateRelayDeploymentPayload,
} = require('../middleware/validator');
const { auth } = require('../middleware/auth');
const { config } = require('../config');
const {
  proxyJsonRpc,
  rpcErrorPayload,
} = require('../controllers/rpcController');

const router = express.Router();
const serviceStartedAt = Date.now();

// --- Rate Limiter Configuration ---
const rpcLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: config.rateLimitPerMinute || 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterMs = 250;
    res.status(429).json(
      rpcErrorPayload(
        'RATE_LIMIT_EXCEEDED',
        `Rate limit exceeded: retry_after_ms=${retryAfterMs}`,
        req.requestId || 'n/a',
        {
          retry_after_ms: retryAfterMs,
          user_hint: 'Apply retry_after_ms with exponential backoff and jitter.',
        }
      )
    );
  },
});

// --- Health Check Endpoint ---
router.get('/health', (_req, res) => {
  const warnings = [];
  const errors = [];
  const recommendations = [];

  // Configuration Checks
  if (!config.genesisHash) {
    warnings.push('genesis_hash_not_configured');
    recommendations.push(
      'Set a canonical 0x-prefixed genesis_hash in RpcConfig and enforce it at node startup.'
    );
  }

  if (!config.tlsEnabled) {
    warnings.push('tls_disabled');
    recommendations.push(
      'Enable TLS for api.aoxcore.com and ws.aoxcore.com endpoints.'
    );
  }

  if (config.deploymentPlatform?.toLowerCase() === 'vercel') {
    warnings.push('runtime_environment_mismatch');
    recommendations.push(
      'Vercel is suitable for frontend/edge APIs, not long-lived RPC/WS/gRPC termination. Move to dedicated infra.'
    );
  }

  const readinessScore = Math.max(
    0,
    100 - warnings.length * 15 - errors.length * 30
  );

  res.status(200).json({
    status: errors.length ? 'error' : warnings.length ? 'degraded' : 'ok',
    chain_id: config.chainId,
    genesis_hash: config.genesisHash,
    tls_enabled: config.tlsEnabled,
    mtls_enabled: config.mtlsEnabled,
    readiness_score: readinessScore,
    warnings,
    errors,
    recommendations,
    uptime_secs: Math.floor((Date.now() - serviceStartedAt) / 1000),
  });
});

// --- Service Discovery / Endpoints ---
router.get('/endpoints', (_req, res) => {
  res.status(200).json({
    deployment: {
      platform: config.deploymentPlatform,
      recommendation:
        config.deploymentPlatform?.toLowerCase() === 'vercel'
          ? 'Use Vercel for frontend/edge proxy. Keep JSON-RPC and WebSocket on dedicated infra.'
          : 'Self-hosted runtime is suitable for API + RPC gateway workloads.',
    },
    networks: {
      aoxchain: {
        rest_base: `${config.publicApiBase}/api/v1`,
        rpc_base: `${config.publicApiBase}/rpc/v1`,
        ws_base: `${config.publicWsBase}/ws/v1`,
        grpc_host: config.publicGrpcHost,
        chain_id: config.chainId,
      },
      xlayer: {
        api_base: config.xlayerApiBase,
        rpc_url: config.xlayerRpcUrl,
      },
      cardano: {
        api_base: config.cardanoApiBase,
        network: config.cardanoNetwork,
      },
      sui: {
        rpc_url: config.suiRpcUrl,
        graphql_url: config.suiGraphqlUrl,
      },
    },
    canonical_ports: {
      rpc_http: 2626,
      rpc_ws: 3030,
      rpc_grpc: 3131,
      metrics: 3232,
    },
  });
});

// --- Sentinel Analysis ---
router.post('/sentinel/analyze', auth, validateAnalyzePayload, analyze);

// --- AOX Chain Management ---
router.get('/aoxchain/status', getAoxchainStatus);
router.get('/aoxchain/governance/proposals', getGovernanceProposals);
router.get('/aoxchain/deployments/relay', auth, getRelayDeployments);
router.post(
  '/aoxchain/deployments/relay',
  auth,
  validateRelayDeploymentPayload,
  createRelayDeployment
);

// --- JSON-RPC Proxy ---
router.post('/rpc', rpcLimiter, proxyJsonRpc);

module.exports = { v1Router: router };