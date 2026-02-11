// Chain Configuration
export const CHAIN_ID = 10141; // Monad testnet
export const CHAIN = {
  id: CHAIN_ID,
  name: 'Monad Testnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet.rpc.monad.xyz',
  blockExplorer: 'https://testnet.monadexplorer.com',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
} as const;

// Contract Addresses (update when deployed)
export const CONTRACTS = {
  identity: process.env.NEXT_PUBLIC_IDENTITY_ADDRESS || '0x0000000000000000000000000000000000000000',
  delegation: process.env.NEXT_PUBLIC_DELEGATION_ADDRESS || '0x0000000000000000000000000000000000000000',
  nadfun: process.env.NEXT_PUBLIC_NADFUN_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const;
