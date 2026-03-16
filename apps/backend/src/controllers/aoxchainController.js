const {
  probeAoxchainStatus,
  listGovernanceProposals,
  queueRelayDeployment,
  listRelayDeployments,
  DEFAULT_RPC_ENDPOINTS,
} = require('../services/aoxchainService');

async function getAoxchainStatus(req, res) {
  const status = await probeAoxchainStatus(req.requestId, req.query.rpc);
  return res.status(status.ok ? 200 : 503).json({
    network: 'aoxchain',
    rpcFallbacks: DEFAULT_RPC_ENDPOINTS,
    ...status,
  });
}

function getGovernanceProposals(_req, res) {
  return res.status(200).json({
    network: 'aoxchain',
    proposals: listGovernanceProposals(),
  });
}

function createRelayDeployment(req, res) {
  const deployment = queueRelayDeployment(req.validated);
  return res.status(201).json({
    network: 'aoxchain',
    deployment,
  });
}

function getRelayDeployments(_req, res) {
  return res.status(200).json({
    network: 'aoxchain',
    deployments: listRelayDeployments(),
  });
}

module.exports = {
  getAoxchainStatus,
  getGovernanceProposals,
  createRelayDeployment,
  getRelayDeployments,
};
