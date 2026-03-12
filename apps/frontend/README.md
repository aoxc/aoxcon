<div align="center">
  <img width="1200" height="475" alt="AOXCORE_Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# AOXCORE Frontend Console
### Experimental operator interface for governance, telemetry, and protocol operations

[![Status](https://img.shields.io/badge/Protocol-Active-00f2ff.svg?style=flat-square)](https://github.com/aoxc/AOXCORE)
[![Frontend](https://img.shields.io/badge/Framework-React%2019-61dafb.svg?style=flat-square)](https://react.dev/)
[![Build](https://img.shields.io/badge/Tooling-Vite-646cff.svg?style=flat-square)](https://vitejs.dev/)
[![Security](https://img.shields.io/badge/Security-Gemini%20Sentinel-8e44ad.svg?style=flat-square)](https://ai.google.dev/)

</div>

---

## Overview

The **AOXCORE Frontend Console** is an experimental operational interface designed to provide visibility into protocol state, governance workflows, and migration telemetry within the AOXCORE ecosystem.

The interface acts as a human interaction layer above the deterministic execution environment of the protocol. While the protocol itself operates entirely on-chain, this console provides operators and governance participants with the situational awareness necessary to observe system state, analyze activity, and coordinate protocol interactions.

The primary goal of the interface is not to introduce authority or control, but to expose existing protocol capabilities through a structured operational dashboard.

---

## Experimental Status

This frontend is currently under active development and should be considered **experimental infrastructure**.

Features, APIs, visual components, and integration points may change as the protocol continues to evolve. Until governance and security review explicitly declare a release as production-ready, builds should be treated as **release candidates intended for testing, rehearsal, and operational validation**.

The system is being developed in parallel with protocol migration and operational tooling, and therefore the interface may evolve alongside backend capabilities.

---

## Design Philosophy

The frontend follows several guiding design principles.

**Operational Transparency**

Operators should have clear visibility into protocol state, migration status, and system activity.

**Minimal Authority**

The interface itself does not grant power. It only exposes capabilities already defined and authorized at the protocol level.

**Deterministic Observability**

All information presented by the interface originates either from on-chain state or from verified telemetry pipelines.

**Security Conscious Interaction**

Sensitive operations are structured around explicit confirmations and transaction-level verification to support safe operational workflows.

---

## Primary Objectives

The console exists to support several operational functions within the AOXCORE ecosystem.

Provide visibility into protocol state and governance signals.

Expose migration telemetry during upgrade and parity validation periods.

Allow authorized actors to initiate deterministic protocol interactions.

Offer ledger-level inspection tools for debugging and forensic analysis.

Integrate AI-assisted sentinel insights for anomaly awareness and system monitoring.

The intention is to support complex protocol operations with clarity and transparency rather than automation alone.

---

## Technology Stack

The frontend is built using a modern TypeScript-based web stack.

Runtime and User Interface  
React 19 with TypeScript

Build System  
Vite 7

State Management  
Zustand

Data Fetching and Visualization  
TanStack Query  
Recharts

Web3 Integration  
Ethers  
Viem  
Wagmi

UX and Animation  
Framer Motion

Internationalization  
i18next  
react-i18next

---

## Local Development

### Prerequisites

Node.js 20+  
npm 10+ (or Yarn if configured in your environment)

### Installation


cd apps/frontend
npm install


### Development Server


npm run dev


### Validation and Build


npm run type-check
npm run lint
npm run build


These validation steps are intended to mirror CI checks and should be treated as required steps during development.

---

## Environment Configuration

Create a local environment file before running the system.


cp .env.example .env


Environment variables may include configuration for RPC endpoints, network identifiers, telemetry services, and AI sentinel integrations.

Values should be adjusted depending on the target environment.

---

## Operational Considerations

While the interface continues to evolve, several practices are recommended.

Maintain consistent package manager usage across local environments and CI pipelines.

Treat type checking and linting as mandatory release gates.

During protocol migration periods, frontend releases should be paired with parity validation evidence and migration scripts.

Operational tooling should always reflect the current protocol state.

---

## Related Documentation

docs/V1_V2_PARITY_MATRIX.md

docs/MIGRATION_REHEARSAL_RUNBOOK.md

docs/WEB_PUBLISH_AND_RC_CHECKLIST.md

---

## Repository

https://github.com/aoxc/aoxcon/tree/main/apps/frontend

https://github.com/aoxc

---

## Closing Note

The AOXCORE Frontend Console represents an evolving operational interface designed to make complex protocol systems observable and manageable.

As the protocol matures, the interface will continue to evolve alongside it, gradually transitioning from experimental console to stable operational infrastructure.
