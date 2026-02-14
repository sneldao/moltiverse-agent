// Chain Abstraction Layer - Support for multiple blockchains

export type Chain = 'monad' | 'solana' | 'celo' | 'base';

export interface ChainConfig {
  id: Chain;
  name: string;
  symbol: string;
  color: string;
  rpc: string;
  explorer: string;
  nativeToken: string;
  isTestnet: boolean;
}

export const CHAIN_CONFIGS: Record<Chain, ChainConfig> = {
  monad: {
    id: 'monad',
    name: 'Monad',
    symbol: 'MON',
    color: '#8b5cf6',
    rpc: 'https://rpc.monad.xyz',
    explorer: 'https://monadexplorer.com',
    nativeToken: 'MON',
    isTestnet: false,
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#14f195',
    rpc: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    nativeToken: 'SOL',
    isTestnet: false,
  },
  celo: {
    id: 'celo',
    name: 'Celo',
    symbol: 'CELO',
    color: '#35d03f',
    rpc: 'https://forno.celo.org',
    explorer: 'https://explorer.celo.org',
    nativeToken: 'CELO',
    isTestnet: false,
  },
  base: {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    color: '#0052ff',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    nativeToken: 'ETH',
    isTestnet: false,
  },
};

// Get chain by symbol
export function getChainBySymbol(symbol: string): Chain | null {
  const entries = Object.entries(CHAIN_CONFIGS);
  for (const [key, config] of entries) {
    if (config.symbol.toLowerCase() === symbol.toLowerCase()) {
      return key as Chain;
    }
  }
  return null;
}

// Get chain config
export function getChainConfig(chain: Chain): ChainConfig {
  return CHAIN_CONFIGS[chain];
}
