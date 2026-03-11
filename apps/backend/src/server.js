const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.BACKEND_PORT || 7070);
const CONFIG_PATH = path.resolve(process.cwd(), 'config', 'services.json');

function loadServices() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.services || [];
  } catch (error) {
    return [];
  }
}

function sendJson(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(new Error('Geçersiz JSON gövdesi'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok', service: 'aoxcon-backend' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/services') {
    sendJson(res, 200, { services: loadServices() });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/dispatch') {
    try {
      const body = await readBody(req);
      const target = body.target;
      const action = body.action;
      const payload = body.payload || {};

      if (!target || !action) {
        sendJson(res, 400, { error: 'target ve action zorunludur' });
        return;
      }

      const service = loadServices().find((s) => s.name === target);
      if (!service) {
        sendJson(res, 404, { error: `Hedef servis bulunamadı: ${target}` });
        return;
      }

      sendJson(res, 200, {
        message: 'İstek merkeze ulaştı (stub). Entegrasyon adaptörünü bu noktaya ekleyin.',
        target,
        action,
        upstream: service,
        payload
      });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  sendJson(res, 404, { error: 'Route bulunamadı' });
});

server.listen(PORT, () => {
  console.log(`[backend] running on :${PORT}`);
});
