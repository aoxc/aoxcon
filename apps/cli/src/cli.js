#!/usr/bin/env node

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7070';

async function main() {
  const [, , command, target = 'evm', action = 'health', payload] = process.argv;

  if (!command || command === 'help') {
    console.log('Kullanım:');
    console.log('  node apps/cli/src/cli.js status');
    console.log('  node apps/cli/src/cli.js dispatch <target> <action> <payloadJson>');
    process.exit(0);
  }

  if (command === 'status') {
    const res = await fetch(`${BACKEND_URL}/health`);
    console.log(JSON.stringify(await res.json(), null, 2));
    return;
  }

  if (command === 'dispatch') {
    let parsedPayload = {};
    if (payload) {
      parsedPayload = JSON.parse(payload);
    }

    const res = await fetch(`${BACKEND_URL}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target,
        action,
        payload: parsedPayload
      })
    });

    console.log(JSON.stringify(await res.json(), null, 2));
    return;
  }

  console.error(`Bilinmeyen komut: ${command}`);
  process.exit(1);
}

main().catch((error) => {
  console.error('CLI Hatası:', error.message);
  process.exit(1);
});
