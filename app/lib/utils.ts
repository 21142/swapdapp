import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_BUY_TOKEN = (chainId: number) => {
  if (chainId === 137) {
    return "usd";
  }
};