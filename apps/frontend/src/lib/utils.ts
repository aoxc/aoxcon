/**
 * AOXC Architecture Utility Layer
 *
 * Security Profile
 * - deterministic class merging
 * - NaN-safe number formatting
 * - cryptographically safe trace IDs
 * - side-effect free helpers
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind Class Combiner
 *
 * Combines clsx conditional class handling with tailwind-merge
 * conflict resolution.
 *
 * Prevents:
 * - Tailwind specificity conflicts
 * - duplicated utility classes
 * - conditional class collisions
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}

/**
 * Crypto Value Formatter
 *
 * Standardizes token display across AOXC Neural OS.
 * Prevents UI corruption from NaN / Infinity values.
 */
export function formatCryptoValue(
  value: number | string | bigint | null | undefined,
  decimals = 2
): string {

  let numeric: number

  if (typeof value === "bigint") {
    numeric = Number(value)
  } else if (typeof value === "string") {
    numeric = Number.parseFloat(value)
  } else if (typeof value === "number") {
    numeric = value
  } else {
    return "0"
  }

  if (!Number.isFinite(numeric)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numeric)
}

/**
 * Trace ID Generator
 *
 * Generates a collision-resistant short identifier
 * used for logs, UI traces and ephemeral events.
 *
 * Uses crypto API when available.
 */
export function generateTraceId(length = 8): string {

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {

    const bytes = new Uint8Array(length)
    crypto.getRandomValues(bytes)

    return Array.from(bytes)
      .map(b => alphabet[b % alphabet.length])
      .join("")
  }

  // Fallback for non-crypto environments
  return Array.from({ length })
    .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join("")
}
