const { config } = require('../config');

const ALLOWED_METHODS = new Set([
  'eth_chainId',
  'eth_call',
  'eth_estimateGas',
  'eth_getTransactionReceipt',
]);

function rpcErrorPayload(code, message, requestId, extras = {}) {
  return {
    code,
    message,
    request_id: requestId,
    user_hint: extras.user_hint || null,
    retry_after_ms: extras.retry_after_ms ?? null,
  };
}

async function proxyJsonRpc(req, res) {
  const requestId = req.requestId || 'n/a';
  const method = req.body?.method;

  if (!req.body || req.body.jsonrpc !== '2.0' || typeof method !== 'string') {
    return res
      .status(400)
      .json(
        rpcErrorPayload(
          'INVALID_REQUEST',
          'INVALID_REQUEST: jsonrpc=2.0 and method are required',
          requestId
        )
      );
  }

  if (!ALLOWED_METHODS.has(method)) {
    return res.status(404).json(
      rpcErrorPayload(
        'METHOD_NOT_FOUND',
        `METHOD_NOT_FOUND: ${method}`,
        requestId,
        {
          user_hint:
            'Use one of: eth_chainId, eth_call, eth_estimateGas, eth_getTransactionReceipt.',
        }
      )
    );
  }

  try {
    const rpcResponse = await fetch(config.rpcHttpBind, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-request-id': requestId,
      },
      body: JSON.stringify(req.body),
    });

    const payload = await rpcResponse.json();
    return res.status(rpcResponse.status).json(payload);
  } catch (_error) {
    return res.status(500).json(
      rpcErrorPayload(
        'INTERNAL_ERROR',
        'INTERNAL_ERROR: AOXChain RPC upstream unreachable',
        requestId,
        {
          user_hint:
            'Check rpc_http bind (default 127.0.0.1:2626) and retry with exponential backoff + jitter.',
        }
      )
    );
  }
}

module.exports = { proxyJsonRpc, ALLOWED_METHODS, rpcErrorPayload };
