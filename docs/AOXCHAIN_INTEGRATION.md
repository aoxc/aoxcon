# AOXChain Frontend + Backend Integration (aoxcore.com)

Bu proje AOXChain için aşağıdaki canonical endpoint yapısına göre güncellendi:

- REST base: `https://api.aoxcore.com/api/v1`
- JSON-RPC base: `https://api.aoxcore.com/rpc/v1`
- WS base: `wss://ws.aoxcore.com/ws/v1`
- gRPC host: `grpc.aoxcore.com:443`
- XLayer API: `https://api.xlayer.tech`
- XLayer RPC: `https://rpc.xlayer.tech`

## Backend route eşlemesi

- `GET /api/v1/health`
  - Health payload: `status`, `chain_id`, `genesis_hash`, `tls_enabled`, `mtls_enabled`, `tls_cert_sha256`, `readiness_score`, `warnings`, `errors`, `recommendations`, `uptime_secs`
- `GET /api/v1/endpoints`
  - Frontend için public endpoint discovery + canonical port metadata
- `POST /rpc/v1`
  - JSON-RPC proxy + whitelist (`eth_chainId`, `eth_call`, `eth_estimateGas`, `eth_getTransactionReceipt`)
  - Rate limit aşımlarında standart hata modeli (`RATE_LIMIT_EXCEEDED` + `retry_after_ms`)

## Frontend network profili

`apps/frontend/lib/network.ts` altında:

- AOXC native coin sembolü: `AOXC`
- `aoxcTokenIsNativeEquivalent: true`
- `jsonRpcUrl`, `wsUrl`, `grpcHost`, `xlayerApiBase`, `xlayerRpcUrl` alanları eklendi.

## Önemli env değişkenleri

- `NEXT_PUBLIC_AOXCHAIN_API` (default: `https://api.aoxcore.com/api/v1`)
- `NEXT_PUBLIC_AOXCHAIN_RPC` (default: `https://api.aoxcore.com/rpc/v1`)
- `NEXT_PUBLIC_AOXCHAIN_WS` (default: `wss://ws.aoxcore.com/ws/v1`)
- `NEXT_PUBLIC_AOXCHAIN_GRPC` (default: `grpc.aoxcore.com:443`)
- `NEXT_PUBLIC_XLAYER_API` (default: `https://api.xlayer.tech`)
- `NEXT_PUBLIC_XLAYER_RPC` (default: `https://rpc.xlayer.tech`)
