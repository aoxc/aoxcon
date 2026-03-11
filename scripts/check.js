const fs = require('fs');

const required = [
  'apps/backend/src/server.js',
  'apps/web/src/server.js',
  'apps/web/src/index.html',
  'apps/cli/src/cli.js',
  'config/services.json'
];

const missing = required.filter((file) => !fs.existsSync(file));

if (missing.length > 0) {
  console.error('Eksik dosyalar:', missing.join(', '));
  process.exit(1);
}

console.log('Tüm kritik dosyalar mevcut.');
