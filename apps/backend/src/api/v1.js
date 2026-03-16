const express = require('express');
const { analyze } = require('../controllers/sentinelController');
const {
  getAoxchainStatus,
  getGovernanceProposals,
  createRelayDeployment,
  getRelayDeployments,
} = require('../controllers/aoxchainController');
const { validateAnalyzePayload, validateRelayDeploymentPayload } = require('../middleware/validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'ok', service: 'sentinel-api', version: 'v1' });
});

router.post('/sentinel/analyze', auth, validateAnalyzePayload, analyze);

router.get('/aoxchain/status', getAoxchainStatus);
router.get('/aoxchain/governance/proposals', getGovernanceProposals);
router.get('/aoxchain/deployments/relay', auth, getRelayDeployments);
router.post('/aoxchain/deployments/relay', auth, validateRelayDeploymentPayload, createRelayDeployment);

module.exports = { v1Router: router };
