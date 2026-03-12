# AoxCon

AoxCon is a central coordination repository intended to bring together the **web interface**, **backend orchestration layer**, and **command-line tooling** of the AOXC ecosystem.

The goal of this repository is to provide a single operational entry point where multiple services and chain integrations can be coordinated and managed in a consistent way.

At the moment the project should be considered **early infrastructure under active development**. Components are still evolving and some functionality is implemented as stubs while integration work continues.

---

# Purpose

Several AOXC components currently exist across separate repositories.  
AoxCon aims to gradually consolidate those pieces into a unified operational layer.

The repository is designed to:

- provide a central backend gateway
- expose a lightweight web management interface
- offer a unified CLI for operational commands
- coordinate multiple chain integrations through a common dispatch mechanism

Rather than replacing existing services, AoxCon is intended to **organize and orchestrate them from a single control surface**.

---

# Repository Structure

The project is organized into three primary application layers.


apps/
├─ backend → service gateway and orchestration layer
├─ frontend → lightweight administrative interface
└─ cli → operational command line tooling


Additional configuration lives under:


config/services.json


This file acts as a service registry describing available integrations such as EVM or other chains.

---

# Architecture Overview

The system follows a simple layered model.

Backend (Gateway / Orchestrator)

The backend acts as a routing and coordination layer.  
External services are accessed through adapters which normalize requests and responses.

Web Interface

The web layer provides a minimal operational interface for inspecting services and triggering actions.

CLI

The CLI provides a deterministic command-line interface for operational workflows, scripting, and automation.

Configuration

Service endpoints and integration parameters are centralized in a configuration file to keep runtime behavior predictable.

---

# Quick Start

Start the backend service.


node apps/backend/src/server.js


In another terminal start the web interface.


node apps/frontend/src/server.js


You can then interact with the system through the CLI.


node apps/cli/src/cli.js status

node apps/cli/src/cli.js dispatch evm wallet.balance '{"address":"0x123"}'


The dispatch command routes a request through the backend to the appropriate service adapter.

---

# EVM Integration Migration Plan

The repository is intended to eventually host the EVM related tooling that currently exists in a separate repository.

A gradual migration strategy is recommended.

Step 1 — Code Relocation

Move EVM backend logic into


apps/backend/src/adapters/evm/


Move EVM CLI commands into


apps/cli/src/commands/evm/


Move EVM web modules into


apps/frontend/src/modules/evm/


Step 2 — Adapter Standardization

Each external service should expose a minimal interface.


health()
dispatch(action, payload)
normalizeError(error)


This ensures all integrations behave consistently from the perspective of the gateway.

Step 3 — Endpoint Normalization

Instead of multiple service-specific endpoints, external calls should be routed through a single endpoint.


POST /dispatch


The target service is selected through the `target` field, for example:


evm
solana
btc


Step 4 — CLI Consolidation

Operational commands from multiple repositories can gradually be unified under a single CLI interface.

Example usage:


aoxcon dispatch evm wallet.balance --payload '{...}'


Step 5 — Configuration Centralization

Service endpoints and credentials should be managed through


config/services.json


combined with environment variables.

Step 6 — Gradual Migration

The recommended migration order is:

1. integrate the EVM services first
2. validate dispatch and adapter behavior
3. onboard additional chain services using the same adapter pattern

---

# Current Status

At the moment this repository contains a **working integration skeleton**.

The dispatch endpoint currently returns stub responses instead of calling real upstream services.  
This allows the system architecture to be exercised before full service integration.

As adapters are implemented, the stub logic inside


apps/backend/src/server.js


can be replaced with calls to the appropriate service adapter.

---

# Development Notes

The project is intentionally minimal at this stage.

The immediate focus is on:

- stabilizing the dispatch model
- unifying CLI operations
- integrating EVM services
- gradually connecting additional chain integrations

The architecture may evolve as these components mature.
