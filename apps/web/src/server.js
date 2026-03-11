const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.WEB_PORT || 5173);
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7070';

const INDEX_PATH = path.resolve(process.cwd(), 'apps', 'web', 'src', 'index.html');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/') {
    const html = fs.readFileSync(INDEX_PATH, 'utf8').replaceAll('__BACKEND_URL__', BACKEND_URL);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'aoxcon-web' }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`[web] running on :${PORT}`);
});
