import { Chain, mainnet, polygon, sepolia } from 'viem/chains';

export const SUPPORTED_CHAINS: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
  [polygon.id]: polygon,
} as const;
