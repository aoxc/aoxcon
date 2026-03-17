const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  logLevel: process.env.LOG_LEVEL || 'info',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  authToken: process.env.SENTINEL_AUTH_TOKEN || '',
  chainId: process.env.AOXCHAIN_CHAIN_ID || 'AOX-MAIN',
  genesisHash: process.env.AOXCHAIN_GENESIS_HASH || null,
  rpcHttpBind: process.env.AOXCHAIN_RPC_HTTP_BIND || 'http://127.0.0.1:2626',
  rpcWsBind: process.env.AOXCHAIN_RPC_WS_BIND || 'ws://127.0.0.1:3030',
  rpcGrpcBind: process.env.AOXCHAIN_RPC_GRPC_BIND || 'http://127.0.0.1:3131',
  metricsBind: process.env.AOXCHAIN_METRICS_BIND || 'http://127.0.0.1:3232',
  aoxchainRpcLocal:
    process.env.AOXCHAIN_RPC_LOCAL || 'http://127.0.0.1:2626/rpc/v1',
  aoxchainRpcRemote:
    process.env.AOXCHAIN_RPC_REMOTE || 'https://api.aoxcore.com/rpc/v1',
  xlayerApiBase: process.env.XLAYER_API_BASE || 'https://api.xlayer.tech',
  xlayerRpcUrl: process.env.XLAYER_RPC_URL || 'https://rpc.xlayer.tech',
  publicApiBase:
    process.env.AOXCHAIN_PUBLIC_API_BASE || 'https://api.aoxcore.com',
  publicWsBase: process.env.AOXCHAIN_PUBLIC_WS_BASE || 'wss://ws.aoxcore.com',
  publicGrpcHost:
    process.env.AOXCHAIN_PUBLIC_GRPC_HOST || 'grpc.aoxcore.com:443',
  tlsEnabled: process.env.AOXCHAIN_TLS_ENABLED === 'true',
  mtlsEnabled: process.env.AOXCHAIN_MTLS_ENABLED === 'true',
  tlsCertSha256: process.env.AOXCHAIN_TLS_CERT_SHA256 || null,
  rateLimitPerMinute: Number(process.env.AOXCHAIN_RATE_LIMIT_PER_MIN || 600),
};

module.exports = { config };
