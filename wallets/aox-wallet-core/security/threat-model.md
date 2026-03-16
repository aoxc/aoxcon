# AOX Wallet Security Model (Web vs Mobile)

## 1) Threat Boundaries

### Web (Chrome)
- Browser extension spoofing
- XSS injection
- Local storage theft
- Clipboard / phishing attack

### Mobile (iOS + Chrome wrapper)
- Jailbreak / root bypass
- Overlay phishing
- Device theft
- Runtime hook frameworks

## 2) Control Set

### Web Controls
- AES-GCM encrypted local envelope
- High-iteration PBKDF2 key derivation
- Origin allowlist + CSP hardening
- Auto-lock timeout + explicit unlock per signing period

### Mobile Controls
- Keychain / Secure Enclave mandatory for seed/private key material
- Biometric gate per-signature action
- Device integrity check before wallet initialization
- Session key rotation and minimal in-memory exposure

## 3) Operational Security Recommendations

- Require transaction simulation for contract deployment actions.
- Add hardware-backed attestation where possible.
- Add anti-phishing channel binding (domain + app identity).
- Rotate encryption versions and migrate envelopes carefully.

## 4) Realistic Security Statement

No software wallet can claim literal 100% security.
Target should be continuous hardening + audited cryptography + operational controls.
