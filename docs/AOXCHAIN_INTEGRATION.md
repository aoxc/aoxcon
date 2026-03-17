# AOXChain Frontend + Backend Integration (aoxcore.com)

<<<<<<< HEAD
Bu proje AOXChain için aşağıdaki canonical endpoint yapısına göre güncellendi:
=======
Bu proje, **AOXChain + XLayer + Cardano + Sui** uyumluluğu için güncellendi.

## Canonical public adresler (AOXChain)
>>>>>>> origin/codex/integrate-frontend-and-backend-with-aoxchain

- REST base: `https://api.aoxcore.com/api/v1`
- JSON-RPC base: `https://api.aoxcore.com/rpc/v1`
- WS base: `wss://ws.aoxcore.com/ws/v1`
- gRPC host: `grpc.aoxcore.com:443`
<<<<<<< HEAD
- XLayer API: `https://api.xlayer.tech`
- XLayer RPC: `https://rpc.xlayer.tech`
=======

## Multi-network endpointler

- XLayer API: `https://api.xlayer.tech`
- XLayer RPC: `https://rpc.xlayer.tech`
- Cardano API (örnek): `https://cardano-mainnet.blockfrost.io/api/v0`
- Sui RPC (örnek): `https://fullnode.mainnet.sui.io:443`
>>>>>>> origin/codex/integrate-frontend-and-backend-with-aoxchain

## Backend route eşlemesi

- `GET /api/v1/health`
  - Health payload: `status`, `chain_id`, `genesis_hash`, `tls_enabled`, `mtls_enabled`, `tls_cert_sha256`, `readiness_score`, `warnings`, `errors`, `recommendations`, `uptime_secs`
<<<<<<< HEAD
- `GET /api/v1/endpoints`
  - Frontend için public endpoint discovery + canonical port metadata
=======
  - `DEPLOYMENT_PLATFORM=vercel` ise uzun ömürlü RPC/WS/gRPC için öneri/warning üretir.
- `GET /api/v1/endpoints`
  - Deployment recommendation + `aoxchain`, `xlayer`, `cardano`, `sui` endpoint discovery
>>>>>>> origin/codex/integrate-frontend-and-backend-with-aoxchain
- `POST /rpc/v1`
  - JSON-RPC proxy + whitelist (`eth_chainId`, `eth_call`, `eth_estimateGas`, `eth_getTransactionReceipt`)
  - Rate limit aşımlarında standart hata modeli (`RATE_LIMIT_EXCEEDED` + `retry_after_ms`)

## Frontend network profili

<<<<<<< HEAD
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
=======
`apps/frontend/lib/network.ts` içinde destek:

- `main` (AOXChain)
- `xlayer`
- `cardano`
- `sui`

Ayrıca profile alanları:

- `family`, `apiBaseUrl`, `jsonRpcUrl`, `wsUrl`, `grpcHost`, `explorerUrl`
- `aoxcTokenIsNativeEquivalent` (AOXChain + XLayer için `true`)

## Vercel notu

- **Vercel uygun kullanım:** Frontend, SSR, hafif API proxy endpointleri.
- **Vercel tek başına uygun değil:** Uzun yaşayan JSON-RPC, WebSocket, gRPC terminasyonu.
- Öneri: RPC/WS/gRPC katmanını dedicated infra üzerinde (VM/Kubernetes/LB) çalıştırıp Vercel’i frontend edge katmanı olarak kullanın.
>>>>>>> origin/codex/integrate-frontend-and-backend-with-aoxchain
