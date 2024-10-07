import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  POLYGON_CHAIN_ID,
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_SYMBOL,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_TOKENS,
  SEPOLIA_TOKENS_BY_SYMBOL,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTokensByChain(chainId: number) {
  if (chainId == POLYGON_CHAIN_ID) {
    return POLYGON_TOKENS;
  }
  if (chainId == SEPOLIA_CHAIN_ID) {
    return SEPOLIA_TOKENS;
  }
  // if (chainId === 2442) {
  //   return POLYGON_ZKEVM_CARDONA_TOKENS;
  // }
  // if (chainId === 80002) {
  //   return POLYGON_AMOY_TOKENS;
  // }
  return POLYGON_TOKENS;
}

export const getTokensBySymbolByChain = (chainId: number) => {
  if (chainId === POLYGON_CHAIN_ID) {
    return POLYGON_TOKENS_BY_SYMBOL;
  }
  if (chainId === SEPOLIA_CHAIN_ID) {
    return SEPOLIA_TOKENS_BY_SYMBOL;
  }
  // if (chainId === 2442) {
  //   return POLYGON_ZKEVM_CARDONA_TOKENS_BY_SYMBOL;
  // }
  // if (chainId === 80002) {
  //   return POLYGON_AMOY_TOKENS_BY_SYMBOL;
  // }
  return POLYGON_TOKENS_BY_SYMBOL;
};

export const DEFAULT_BUY_TOKEN = "usd";
