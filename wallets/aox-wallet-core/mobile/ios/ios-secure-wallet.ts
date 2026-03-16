import type { DerivationPathInput } from '../../shared/bip32-2626';

/**
 * iOS native bridge contract.
 * In production, this should be implemented in Swift with Keychain + Secure Enclave.
 */
export interface IOSNativeWalletBridge {
  createSeedInSecureEnclave: (mnemonic: string) => Promise<void>;
  deriveAddress: (path: string) => Promise<string>;
  signWithBiometricGate: (txHashHex: string, path: string) => Promise<string>;
  hasBiometric: () => Promise<boolean>;
  isDeviceCompromised: () => Promise<boolean>;
}

export class AoxIOSSecureWallet {
  constructor(private readonly nativeBridge: IOSNativeWalletBridge) {}

  public async initialize(mnemonic: string): Promise<void> {
    const compromised = await this.nativeBridge.isDeviceCompromised();
    if (compromised) throw new Error('Device integrity check failed');

    const hasBio = await this.nativeBridge.hasBiometric();
    if (!hasBio) throw new Error('Biometric is required for iOS secure wallet');

    await this.nativeBridge.createSeedInSecureEnclave(mnemonic);
  }

  public async getAddress(input: DerivationPathInput = {}): Promise<string> {
    const account = input.account ?? 0;
    const change = input.change ?? 0;
    const index = input.index ?? 0;
    const path = `m/44'/2626'/${account}'/${change}/${index}`;

    return this.nativeBridge.deriveAddress(path);
  }

  public async signTransaction(txHashHex: string, input: DerivationPathInput = {}): Promise<string> {
    const account = input.account ?? 0;
    const change = input.change ?? 0;
    const index = input.index ?? 0;
    const path = `m/44'/2626'/${account}'/${change}/${index}`;

    // Native layer should show biometric prompt each signature request.
    return this.nativeBridge.signWithBiometricGate(txHashHex, path);
  }
}
