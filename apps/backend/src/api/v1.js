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

const rpcLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: config.rateLimitPerMinute,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterMs = 250;
    res.status(429).json(
      rpcErrorPayload(
        'RATE_LIMIT_EXCEEDED',
        `RATE_LIMIT_EXCEEDED: retry_after_ms=${retryAfterMs}`,
        req.requestId || 'n/a',
        {
          retry_after_ms: retryAfterMs,
          user_hint:
            'Apply retry_after_ms with exponential backoff and jitter.',
        }
      )
    );
  },
});

router.get('/health', (_req, res) => {
  const warnings = [];
  const errors = [];
  const recommendations = [];

  if (!config.genesisHash) {
    warnings.push('genesis_hash is not configured');
    recommendations.push(
      'Set a canonical 0x-prefixed genesis_hash in RpcConfig and enforce it at node startup'
    );
  }

  if (!config.tlsEnabled) {
    warnings.push('tls is disabled');
    recommendations.push(
      'Enable TLS for api.aoxcore.com and ws.aoxcore.com endpoints.'
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
    tls_cert_sha256: config.tlsCertSha256,
    readiness_score: readinessScore,
    warnings,
    errors,
    recommendations,
    uptime_secs: Math.floor((Date.now() - serviceStartedAt) / 1000),
  });
});

router.get('/endpoints', (_req, res) => {
  res.status(200).json({
    rest_base: `${config.publicApiBase}/api/v1`,
    rpc_base: `${config.publicApiBase}/rpc/v1`,
    ws_base: `${config.publicWsBase}/ws/v1`,
    grpc_host: config.publicGrpcHost,
    xlayer_api_base: config.xlayerApiBase,
    xlayer_rpc_url: config.xlayerRpcUrl,
    canonical_ports: {
      rpc_http: 2626,
      rpc_ws: 3030,
      rpc_grpc: 3131,
      metrics: 3232,
    },
  });
});

router.post('/sentinel/analyze', auth, validateAnalyzePayload, analyze);

router.get('/aoxchain/status', getAoxchainStatus);
router.get('/aoxchain/governance/proposals', getGovernanceProposals);
router.get('/aoxchain/deployments/relay', auth, getRelayDeployments);
router.post(
  '/aoxchain/deployments/relay',
  auth,
  validateRelayDeploymentPayload,
  createRelayDeployment
);

router.post('/rpc', rpcLimiter, proxyJsonRpc);

module.exports = { v1Router: router };
