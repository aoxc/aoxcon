# AOXChain Frontend + Backend Integration (aoxcore.com)

This project is updated for full compatibility across **AOXChain + XLayer + Cardano + Sui**.

## 1. Canonical Public Endpoints (AOXChain)

- **REST Base:** `https://api.aoxcore.com/api/v1`
- **JSON-RPC Base:** `https://api.aoxcore.com/rpc/v1`
- **WS Base:** `wss://ws.aoxcore.com/ws/v1`
- **gRPC Host:** `grpc.aoxcore.com:443`

## 2. Multi-Network Endpoints

- **XLayer API:** `https://api.xlayer.tech`
- **XLayer RPC:** `https://rpc.xlayer.tech`
- **Cardano API:** `https://cardano-mainnet.blockfrost.io/api/v0`
- **Sui RPC:** `https://fullnode.mainnet.sui.io:443`

## 3. Backend Route Mapping

### `GET /api/v1/health`
- **Payload:** Returns `status`, `chain_id`, `genesis_hash`, `tls_enabled`, `mtls_enabled`, `tls_cert_sha256`, `readiness_score`, `warnings`, `errors`, `recommendations`, and `uptime_secs`.
- **Logic:** If `DEPLOYMENT_PLATFORM=vercel`, generates warnings regarding non-optimal long-lived RPC/WS/gRPC termination.

### `GET /api/v1/endpoints`
- Provides deployment recommendations and multi-network (`aoxchain`, `xlayer`, `cardano`, `sui`) discovery metadata for the frontend.

### `POST /rpc/v1`
- **JSON-RPC Proxy:** Strictly whitelists `eth_chainId`, `eth_call`, `eth_estimateGas`, and `eth_getTransactionReceipt`.
- **Rate Limiting:** Standardized error model returning `RATE_LIMIT_EXCEEDED` and `retry_after_ms` on limit breach.

## 4. Frontend Network Profiles (`apps/frontend/lib/network.ts`)

- **Supported Keys:** `main` (AOXChain), `xlayer`, `cardano`, `sui`.
- **Native Asset:** Symbol `AOXC`.
- **Flags:** `aoxcTokenIsNativeEquivalent` set to `true` for AOXChain and XLayer.
- **Fields:** Includes `family`, `apiBaseUrl`, `jsonRpcUrl`, `wsUrl`, `grpcHost`, and `explorerUrl`.

## 5. Critical Environment Variables

- `NEXT_PUBLIC_AOXCHAIN_API` (Default: `https://api.aoxcore.com/api/v1`)
- `NEXT_PUBLIC_AOXCHAIN_RPC` (Default: `https://api.aoxcore.com/rpc/v1`)
- `NEXT_PUBLIC_AOXCHAIN_WS` (Default: `wss://ws.aoxcore.com/ws/v1`)
- `NEXT_PUBLIC_AOXCHAIN_GRPC` (Default: `grpc.aoxcore.com:443`)
- `NEXT_PUBLIC_XLAYER_API` (Default: `https://api.xlayer.tech`)
- `NEXT_PUBLIC_XLAYER_RPC` (Default: `https://rpc.xlayer.tech`)

## 6. Infrastructure & Deployment Notes

- **Vercel Usage:** Optimal for Frontend, SSR, and lightweight API proxying.
- **Vercel Limitation:** Not suitable for persistent WebSocket or gRPC connections due to serverless execution limits.
- **Strategic Recommendation:** Terminate high-throughput RPC, WebSocket, and gRPC traffic on dedicated infrastructure (Kubernetes, Bare Metal, or VMs) while keeping Vercel as the global Edge layer for the frontend.