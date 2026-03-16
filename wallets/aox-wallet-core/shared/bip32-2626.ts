export const AOX_BIP44_PURPOSE = 44;
export const AOX_COIN_TYPE = 2626;

export interface DerivationPathInput {
  account?: number;
  change?: 0 | 1;
  index?: number;
}

/**
 * Returns AOXCHAIN BIP44 path:
 * m/44'/2626'/account'/change/index
 */
export function aoxDerivationPath(input: DerivationPathInput = {}): string {
  const account = input.account ?? 0;
  const change = input.change ?? 0;
  const index = input.index ?? 0;

  if (account < 0 || index < 0) {
    throw new Error('Invalid derivation path indices');
  }

  return `m/${AOX_BIP44_PURPOSE}'/${AOX_COIN_TYPE}'/${account}'/${change}/${index}`;
}

export interface AoxAddressBundle {
  path: string;
  address: string;
  publicKeyHex: string;
}

/**
 * Placeholder signature for integration with your selected BIP32 library.
 */
export async function deriveAoxAddressBundle(
  _seed: Uint8Array,
  input: DerivationPathInput = {}
): Promise<AoxAddressBundle> {
  const path = aoxDerivationPath(input);

  // TODO: Replace with audited BIP32 + secp256k1/ed25519 flow required by AOXCHAIN.
  // This stub is for architecture and interface contracts.
  return {
    path,
    address: `aox1_stub_${input.account ?? 0}_${input.index ?? 0}`,
    publicKeyHex: '0xPUBLIC_KEY_PLACEHOLDER'
  };
}
