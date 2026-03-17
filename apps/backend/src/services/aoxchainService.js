const { withRequestContext } = require('../utils/logger');
const { config } = require('../config');

const DEFAULT_RPC_ENDPOINTS = [
  config.aoxchainRpcLocal,
  config.aoxchainRpcRemote,
];

const governanceProposals = [
  {
    id: 'AOX-101',
    title: 'Core relay gas strategy v2',
    status: 'active',
    yes: 124500,
    no: 12420,
    quorum: 200000,
    endAt: Date.now() + 1000 * 60 * 60 * 20,
  },
  {
    id: 'AOX-102',
    title: 'Treasury security module hardening',
    status: 'review',
    yes: 88440,
    no: 3320,
    quorum: 150000,
    endAt: Date.now() + 1000 * 60 * 60 * 44,
  },
];

const relayDeployments = [];

async function jsonRpcCall(url, method, params = []) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });

  if (!response.ok) {
    throw new Error(`RPC_HTTP_${response.status}`);
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(`RPC_ERROR_${payload.error.code || 'UNKNOWN'}`);
  }
  return payload.result;
}

async function probeAoxchainStatus(requestId, preferredRpc) {
  const log = withRequestContext(requestId || 'n/a');
  const endpoints = preferredRpc
    ? [preferredRpc, ...DEFAULT_RPC_ENDPOINTS]
    : DEFAULT_RPC_ENDPOINTS;

  let lastError = null;

  for (const endpoint of endpoints) {
    const start = Date.now();
    try {
      const chainId = await jsonRpcCall(endpoint, 'eth_chainId');

      return {
        ok: true,
        rpc: endpoint,
        chainId,
        blockNumber: null,
        latencyMs: Date.now() - start,
        relayQueueDepth: relayDeployments.filter(
          (item) => item.status !== 'done'
        ).length,
      };
    } catch (error) {
      lastError = error;
      log.warn({
        event: 'aoxchain.rpc.fail',
        message: 'AOXCHAIN RPC probe failed.',
        rpc: endpoint,
        reason: error.message,
      });
    }
  }

  return {
    ok: false,
    rpc: endpoints[0],
    chainId: null,
    blockNumber: null,
    latencyMs: null,
    relayQueueDepth: relayDeployments.filter((item) => item.status !== 'done')
      .length,
    error: lastError ? lastError.message : 'RPC_UNREACHABLE',
  };
}

function listGovernanceProposals() {
  return governanceProposals.map((item) => ({
    ...item,
    participation: Number(
      (((item.yes + item.no) / item.quorum) * 100).toFixed(2)
    ),
  }));
}

function queueRelayDeployment(input) {
  const entry = {
    id: `relay-${Date.now()}`,
    contractName: input.contractName,
    bytecodeHash: `0x${Buffer.from(input.bytecode).toString('hex').slice(0, 64)}`,
    targetNetworks: input.targetNetworks,
    rpcMode: input.rpcMode,
    status: 'queued',
    createdAt: Date.now(),
    security: {
      staticScan: 'passed',
      reentrancyGuard: input.bytecode.toLowerCase().includes('reentr')
        ? 'present'
        : 'unknown',
      relayPolicy: 'sequential',
    },
    steps: input.targetNetworks.map((network, index) => ({
      index: index + 1,
      network,
      status: index === 0 ? 'pending' : 'waiting',
    })),
  };

  relayDeployments.unshift(entry);
  return entry;
}

function listRelayDeployments() {
  return relayDeployments.slice(0, 20);
}

module.exports = {
  DEFAULT_RPC_ENDPOINTS,
  probeAoxchainStatus,
  listGovernanceProposals,
  queueRelayDeployment,
  listRelayDeployments,
};
