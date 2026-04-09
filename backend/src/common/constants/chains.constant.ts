import { Address } from 'viem';
import { Chain, sepolia } from 'viem/chains';

export const SUPPORTED_CHAINS: Record<number, Chain> = {
  [sepolia.id]: sepolia,
} as const;

export const MINT_CONTRACT_ADDRESS: Record<number, Address> = {
  [sepolia.id]: '0x523Af6445F33Cc08aea2De9A9bc1Ba920978f3cF',
};
