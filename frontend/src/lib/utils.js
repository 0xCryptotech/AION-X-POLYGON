import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format MATIC values
export function formatBNB(value) {
  return parseFloat(value).toFixed(4);
}

// Alias for backward compatibility
export const formatMATIC = formatBNB;

// Format percentage
export function formatPercentage(value) {
  return `${parseFloat(value).toFixed(2)}%`;
}

// Calculate odds from pools
export function calculateOdds(outcomePool, totalPool) {
  if (totalPool === 0) return 0;
  return ((outcomePool / totalPool) * 100).toFixed(2);
}

// Format time remaining
export function formatTimeRemaining(timestamp) {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Shorten wallet address
export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Mock wallet connection
export function mockWalletConnect() {
  return {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    balance: "2.5432",
    connected: true
  };
}