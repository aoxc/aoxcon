# AOX Wallet Core (BIP32/BIP44 - Coin Type 2626)

This folder contains a **reference wallet architecture** for AOXCHAIN using derivation path:

- `m/44'/2626'/account'/change/index`

It is split into two security domains:

- **Web (Chrome)**: key material is encrypted in-browser and unlocked per session.
- **Mobile (iOS + Chrome mobile wrapper)**: key material is protected using secure enclave / keychain-backed strategy.

> Goal: practical path toward high-security wallet flows. Absolute "100% security" is not realistic in software; this design targets defense-in-depth.

---

## Folder Structure

```text
wallets/aox-wallet-core/
  shared/
    bip32-2626.ts              # Path helpers + deterministic derivation conventions
  web/
    chrome/
      chrome-wallet.ts         # Web wallet manager (PBKDF2 + AES-GCM envelope)
  mobile/
    ios/
      ios-secure-wallet.ts     # iOS secure storage bridge contract (Keychain/Secure Enclave)
    chrome/
      chrome-mobile-wallet.ts  # Mobile Chrome wrapper logic (biometric gate + session unlock)
  security/
    threat-model.md            # Web vs mobile security boundaries and controls
```

---

## Web Header (Chrome)

- Uses mnemonic-based seed derivation in memory only.
- Encrypts wallet envelope using passphrase-derived key (PBKDF2/SHA-256 + AES-GCM).
- Requires unlock before signing.
- Enforces idle timeout and origin allowlist.

## Mobile Header (iOS / Chrome)

- Seed never leaves secure storage abstraction.
- Signing requests require biometric prompt.
- Session keys are ephemeral and rotated.
- Device integrity checks and jailbreak detection should be enforced in native layer.

---

## Important

These files are **reference implementation templates** designed for integration planning.
For production wallet release you should add:

- audited cryptography libraries
- robust transaction codec for AOXCHAIN
- secure random generation validation
- anti-phishing domain binding
- hardware-backed signing where available
- formal security audit + penetration test
