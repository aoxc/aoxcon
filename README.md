# AoxCon

AoxCon is the coordination and operations layer for AOXC ecosystem services.

It brings together:

- **AOXCHAIN network operations** (local-first RPC at `localhost:2626`)
- **multi-network telemetry** (EVM, Solana, Bitcoin, AOXCHAIN)
- **governance visibility** (proposal widgets and status)
- **secure relay deployment workflows** (sequential multi-network contract rollout)
- **AI-assisted operator interface**

The repository contains backend APIs, frontend dashboard, and CLI modules for unified operations.

---

## Table of Contents

- [Architecture](#architecture)
- [Repository Layout](#repository-layout)
- [Core Features](#core-features)
- [Configuration](#configuration)
- [Backend API](#backend-api)
- [Quick Start](#quick-start)
- [Operational Flows](#operational-flows)
- [Security Model](#security-model)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

## Architecture

AoxCon follows a layered architecture:

1. **Backend (`apps/backend`)**
   - Exposes API endpoints for health, AI analysis, AOXCHAIN status, governance, and relay deployments.
   - Probes AOXCHAIN RPC with **local-first fallback strategy**.
   - Applies request validation and optional token-based API protection.

2. **Frontend (`apps/frontend`)**
   - Angular-based operations dashboard.
   - Displays network cards, AOXCHAIN chain status, governance proposals, and relay queue state.
   - Lets operators enqueue secure sequential relay deployments.

3. **CLI (`apps/cli`)**
   - Terminal operator tooling.
   - Designed for scripted dispatch and operational workflows.

---

## Repository Layout

```text
apps/
  backend/    # API gateway + AOXCHAIN services
  frontend/   # Operator dashboard UI
  cli/        # Command-line operations tooling
config/
  services.json  # Service registry (AOXCHAIN + other network adapters)
```

---

## Core Features

### 1) AOXCHAIN Local-First RPC Integration

The backend probes AOXCHAIN using this order:

1. `http://localhost:2626` (primary)
2. `https://aoxcore.com` (fallback)

This allows local node preference with remote continuity when local RPC is unavailable.

### 2) Unified Network Telemetry

Frontend tracks and renders:

- AOXCHAIN
- EVM
- Solana
- Bitcoin

Each network card includes status, block height, latency, throughput estimate, and visual state.

### 3) Governance Visibility

Dashboard includes AOXCHAIN governance proposal widgets with:

- proposal id/title/status
- yes/no values
- participation ratio

### 4) Secure Relay Deployment Queue

Operators can submit a relay deployment job with:

- `contractName`
- `bytecode`
- `targetNetworks[]`
- `rpcMode` (`local-first` or `remote-first`)

Backend validates payload shape and records deployment steps as sequential relay tasks.

---

## Configuration

### Service Registry

`config/services.json` includes AOXCHAIN as RPC service:

- `baseUrl`: `http://localhost:2626`
- `fallbackUrl`: `https://aoxcore.com`

### Backend Environment Variables

Backend reads configuration from `apps/backend/src/config/index.js`:

- `PORT` (default `5000`)
- `NODE_ENV` (default `development`)
- `LOG_LEVEL` (default `info`)
- `GEMINI_API_KEY`
- `SENTINEL_AUTH_TOKEN` (optional; enables auth on protected endpoints)
- `AOXCHAIN_RPC_LOCAL` (default `http://localhost:2626`)
- `AOXCHAIN_RPC_REMOTE` (default `https://aoxcore.com`)

---

## Backend API

Base URL: `http://localhost:5000/api/v1`

### Health

- `GET /health`

Returns service status.

### AI Sentinel

- `POST /sentinel/analyze` (auth middleware enabled)

### AOXCHAIN Status

- `GET /aoxchain/status`
- optional query: `?rpc=<custom_rpc>`

Returns selected RPC endpoint, chain id, block number, latency, and queue depth.

### AOXCHAIN Governance

- `GET /aoxchain/governance/proposals`

Returns proposal list used by dashboard widgets.

### AOXCHAIN Relay Deployments

- `GET /aoxchain/deployments/relay` (auth middleware enabled)
- `POST /aoxchain/deployments/relay` (auth + zod validation)

Payload schema for POST:

```json
{
  "contractName": "RelayVault",
  "bytecode": "0x6080...",
  "targetNetworks": ["aoxchain", "evm", "solana"],
  "rpcMode": "local-first"
}
```

---

## Quick Start

## 1) Install dependencies

```bash
# backend
cd apps/backend && npm install

# frontend
cd ../frontend && yarn install
```

## 2) Run backend

```bash
cd apps/backend
npm start
```

Backend default URL: `http://localhost:5000`

## 3) Run frontend

```bash
cd apps/frontend
GEMINI_API_KEY=dummy yarn dev
```

Frontend default URL: `http://localhost:3000`

## 4) Verify API quickly

```bash
curl http://localhost:5000/api/v1/health
curl "http://localhost:5000/api/v1/aoxchain/status?rpc=http://localhost:2626"
curl http://localhost:5000/api/v1/aoxchain/governance/proposals
```

---

## Operational Flows

### Chain Status Monitoring

1. Frontend requests `/aoxchain/status`.
2. Backend probes local RPC first, then fallback.
3. Dashboard updates network card and latency/height values.

### Governance Monitoring

1. Frontend requests `/aoxchain/governance/proposals`.
2. Response is rendered in governance proposal widget panel.

### Multi-Network Relay Deployment

1. Operator enters contract + target networks in dashboard.
2. Frontend posts deployment payload to backend.
3. Backend validates payload and enqueues sequential relay steps.
4. Dashboard polls queue and displays current jobs.

---

## Security Model

- **Validation-first inputs** with Zod for deployment payloads.
- **Optional token auth** via `SENTINEL_AUTH_TOKEN` + `x-sentinel-token` header.
- **No secrets in frontend code** (runtime env usage expected).
- **Local-first RPC** reduces dependency on external endpoints.

> Note: Current deployment queue is in-memory. For production durability, move queue state to persistent storage (e.g., PostgreSQL/Redis).

---

## Troubleshooting

### Frontend production build fails on Google Fonts inlining

In restricted environments, `yarn build` may fail due to external font fetch restrictions.

Use dev build for local validation:

```bash
yarn ng build --configuration development
```

### AOXCHAIN status returns unavailable

- Ensure local node is running at `localhost:2626`.
- Confirm `AOXCHAIN_RPC_LOCAL` is correct.
- Check fallback endpoint reachability (`aoxcore.com`).

### Protected endpoints return 401

Set or remove `SENTINEL_AUTH_TOKEN` intentionally.
If set, include header:

```text
x-sentinel-token: <token>
```

---


## AOX Wallet Architecture (Web + Mobile)

A reference wallet blueprint for AOXCHAIN coin type `2626` is provided under:

- `wallets/aox-wallet-core/`

It includes:

- BIP44 path helper (`m/44'/2626'/account'/change/index`)
- Chrome web wallet template
- iOS secure wallet bridge contract
- Chrome mobile wrapper strategy
- Threat model and security controls

## Roadmap

- Persistent relay queue storage and signed deployment receipts
- Real proposal ingestion from AOXCHAIN governance contracts
- Role-based access control for sensitive operations
- Transaction simulation + preflight checks before relay enqueue
- Full CI test matrix for backend + frontend + integration contracts

---

## License

See [LICENSE](./LICENSE).
