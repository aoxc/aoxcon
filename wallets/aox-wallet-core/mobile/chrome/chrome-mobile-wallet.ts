import { AoxChromeWallet } from '../../web/chrome/chrome-wallet';

/**
 * Chrome mobile wrapper strategy:
 * - Uses web wallet crypto envelope
 * - Adds stricter unlock policy + device binding token
 */
export class AoxChromeMobileWallet {
  private readonly wallet = new AoxChromeWallet();
  private boundDeviceToken: string | null = null;

  public async bindDevice(token: string): Promise<void> {
    if (token.length < 16) throw new Error('Weak device token');
    this.boundDeviceToken = token;
  }

  public async initialize(mnemonic: string, passphrase: string): Promise<void> {
    if (!this.boundDeviceToken) throw new Error('Device not bound');
    await this.wallet.initialize({ mnemonic, passphrase: `${passphrase}:${this.boundDeviceToken}` });
  }

  public async unlock(passphrase: string): Promise<void> {
    if (!this.boundDeviceToken) throw new Error('Device not bound');
    await this.wallet.unlock(`${passphrase}:${this.boundDeviceToken}`);
  }

  public async getDefaultAddress(): Promise<string> {
    const info = await this.wallet.getAddress({ account: 0, change: 0, index: 0 });
    return info.address;
  }

  public async signTransaction(txHashHex: string): Promise<string> {
    // Add runtime policy checks here (screen lock status, app attestation, etc.)
    return this.wallet.signTransaction(txHashHex);
  }
}
