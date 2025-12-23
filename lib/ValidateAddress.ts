import { isAddress as isEvmAddress } from "ethers";
import * as btc from "bitcoinjs-lib";
import { PublicKey } from "@solana/web3.js";

// Optional sanitization (strip HTML injection)
function sanitize(input: string) {
  return input.replace(/<.*?>/g, "").trim();
}

// -----------------------------
// Regex Definitions
// -----------------------------
const tronRegex = /^T[a-zA-Z0-9]{33}$/;
const xrpRegex = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;
const ltcRegex = /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/;
const dogeRegex = /^[DA9][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const tonRegex = /^[a-zA-Z0-9_-]{48}$/;
const cosmosRegex = /^cosmos1[0-9a-z]{38}$/;

// -----------------------------
// Helper Validators
// -----------------------------
function isValidBitcoin(address: string) {
  try {
    btc.address.toOutputScript(address);
    return true;
  } catch {
    return false;
  }
}

function isValidSolana(address: string) {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// -----------------------------
// Main Validator
// -----------------------------
export function validateBlockchainAddress(raw: string) {
  const address: string = sanitize(raw);

  if (!address) {
    return {
      isValid: false,
      chain: null,
      error: "Input is empty",
    };
  }

  // -------------------------
  // EVM (ETH, BNB, Polygon, AVAX…)
  // -------------------------
  if (isEvmAddress(address)) {
    return {
      isValid: true,
      chain: "EVM",
      error: null,
    };
  }

  // -------------------------
  // Bitcoin
  // -------------------------
  if (/^(1|3|bc1|tb1)/.test(address)) {
    const ok = isValidBitcoin(address);
    return {
      isValid: ok,
      chain: ok ? "Bitcoin" : null,
      error: ok ? null : "Invalid Bitcoin address",
    };
  }

  // -------------------------
  // Solana
  // -------------------------
  if (String(address).length >= 25 && String(address).length <= 44) {
    const ok = isValidSolana(address as string);
    return {
      isValid: ok,
      chain: ok ? "Solana" : null,
      error: ok ? null : "Invalid Solana address",
    };
  }

  // -------------------------
  // Tron
  // -------------------------
  if (tronRegex.test(address)) {
    return { isValid: true, chain: "Tron", error: null };
  }

  // -------------------------
  // XRP
  // -------------------------
  if (xrpRegex.test(address)) {
    return { isValid: true, chain: "XRP", error: null };
  }

  // -------------------------
  // Litecoin
  // -------------------------
  if (ltcRegex.test(address)) {
    return { isValid: true, chain: "Litecoin", error: null };
  }

  // -------------------------
  // Dogecoin
  // -------------------------
  if (dogeRegex.test(address)) {
    return { isValid: true, chain: "Dogecoin", error: null };
  }

  // -------------------------
  // TON
  // -------------------------
  if (tonRegex.test(address)) {
    return { isValid: true, chain: "TON", error: null };
  }

  // -------------------------
  // Cosmos
  // -------------------------
  if (cosmosRegex.test(address)) {
    return { isValid: true, chain: "Cosmos", error: null };
  }

  // -------------------------
  // Final fallback
  // -------------------------
  return {
    isValid: false,
    chain: null,
    error: "Invalid or unsupported address",
  };
}
