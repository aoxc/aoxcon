import { aoxDerivationPath, deriveAoxAddressBundle, type DerivationPathInput } from '../../shared/bip32-2626';

export interface WebWalletEnvelope {
  version: 1;
  saltB64: string;
  ivB64: string;
  ciphertextB64: string;
  kdfIterations: number;
  createdAt: number;
}

export interface WebWalletInitInput {
  mnemonic: string;
  passphrase: string;
}

function toB64(input: Uint8Array): string {
  return btoa(String.fromCharCode(...input));
}

function fromB64(input: string): Uint8Array {
  const raw = atob(input);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function deriveAesKey(passphrase: string, salt: Uint8Array, iterations = 250000): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export class AoxChromeWallet {
  private unlockedSeed: Uint8Array | null = null;
  private readonly storageKey = 'aox_wallet_envelope_v1';

  public async initialize(input: WebWalletInitInput): Promise<WebWalletEnvelope> {
    const seed = new TextEncoder().encode(input.mnemonic); // Replace with BIP39 seed in production.
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const kdfIterations = 250000;
    const key = await deriveAesKey(input.passphrase, salt, kdfIterations);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, seed);

    const envelope: WebWalletEnvelope = {
      version: 1,
      saltB64: toB64(salt),
      ivB64: toB64(iv),
      ciphertextB64: toB64(new Uint8Array(ciphertext)),
      kdfIterations,
      createdAt: Date.now()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(envelope));
    return envelope;
  }

  public async unlock(passphrase: string): Promise<void> {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) throw new Error('Wallet not initialized');

    const envelope = JSON.parse(raw) as WebWalletEnvelope;
    const key = await deriveAesKey(passphrase, fromB64(envelope.saltB64), envelope.kdfIterations);

    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(envelope.ivB64) },
      key,
      fromB64(envelope.ciphertextB64)
    );

    this.unlockedSeed = new Uint8Array(plain);
    setTimeout(() => {
      this.unlockedSeed = null;
    }, 2 * 60 * 1000); // auto-lock: 2 minutes
  }

  public async getAddress(input: DerivationPathInput = {}): Promise<{ path: string; address: string }> {
    if (!this.unlockedSeed) throw new Error('Wallet locked');
    const bundle = await deriveAoxAddressBundle(this.unlockedSeed, input);
    return { path: aoxDerivationPath(input), address: bundle.address };
  }

  public async signTransaction(txHashHex: string): Promise<string> {
    if (!this.unlockedSeed) throw new Error('Wallet locked');

    // TODO: integrate AOXCHAIN canonical signer + anti-replay domain separator.
    return `0xSIG_STUB_${txHashHex.slice(2, 10)}`;
  }
}
