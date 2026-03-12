/// <reference types="vite/client" />

/**
 * @title AOXC Neural OS - Environment and Global Type Definitions
 * @notice Centralized ambient type declarations for Vite environment variables,
 *         browser wallet providers, and non-TypeScript asset imports.
 * @dev This file is intended to eliminate unsafe implicit typing across the
 *      frontend runtime boundary, especially for:
 *      - Vite environment variable access via import.meta.env
 *      - EIP-1193 wallet provider access via window.ethereum
 *      - Static asset imports consumed by the application
 *
 *      The declarations below are intentionally explicit to reduce the risk of:
 *      - TS2339 property access errors
 *      - unchecked provider method usage
 *      - inconsistent environment contract assumptions between deployments
 */

/**
 * @notice Canonical EIP-1193 request payload.
 * @dev This structure is used by modern browser wallet providers for JSON-RPC requests.
 */
interface EthereumRequestArguments {
  method: string;
  params?: readonly unknown[] | object;
}

/**
 * @notice Minimal EIP-1193 compatible browser wallet provider contract.
 * @dev The application should treat provider presence as optional and runtime-dependent.
 *      Consumers must still perform defensive checks before relying on event support
 *      or wallet-specific flags.
 */
interface EthereumProvider {
  readonly isMetaMask?: boolean;
  readonly isOKXWallet?: boolean;
  readonly autoRefreshOnNetworkChange?: boolean;

  request(args: EthereumRequestArguments): Promise<unknown>;

  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
}

/**
 * @notice Strongly typed Vite environment variable contract.
 * @dev All variables declared here are expected to be injected at build time.
 *      Optional variables are explicitly marked to support deployment variance
 *      without forcing unsafe casting in application code.
 */
interface ImportMetaEnv {
  /**
   * @dev AOXC contract addresses
   */
  readonly VITE_AOXC_REGISTRY_ADDR: string;
  readonly VITE_AOXC_CORE_ADDR: string;
  readonly VITE_AOXC_NEXUS_ADDR: string;
  readonly VITE_AOXC_SENTINEL_ADDR: string;
  readonly VITE_AOXC_VAULT_ADDR: string;

  /**
   * @dev AOXC market data endpoint for live header pricing.
   *      Expected to return a JSON payload controlled by project infrastructure.
   */
  readonly VITE_AOXC_PRICE_ENDPOINT?: string;

  /**
   * @dev AI integration configuration
   */
  readonly VITE_GEMINI_API_KEY: string;

  /**
   * @dev Network configuration
   */
  readonly VITE_XLAYER_RPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * @notice Global browser window augmentation for injected wallet providers.
 * @dev The provider is optional because server-side rendering, test environments,
 *      privacy browsers, or users without wallet extensions may not expose it.
 */
interface Window {
  ethereum?: EthereumProvider;
}

/**
 * @notice Solidity source file module declaration.
 * @dev Allows importing Solidity artifacts or raw source files when supported by tooling.
 */
declare module '*.sol' {
  const content: string;
  export default content;
}

/**
 * @notice JSON module declaration for toolchains that require an explicit ambient definition.
 * @dev Vite generally supports JSON imports natively, but this declaration preserves
 *      type compatibility in stricter TypeScript setups and mixed tooling environments.
 */
declare module '*.json' {
  const value: unknown;
  export default value;
}
