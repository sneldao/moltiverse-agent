// Multi-chain Wallet Connection System

import { Chain, CHAIN_CONFIGS, ChainConfig } from './chains';

export type WalletType = 'metamask' | 'phantom' | 'walletconnect' | 'coinbase';

export interface WalletState {
  connected: boolean;
  address: string | null;
  chain: Chain;
  balance: string;
  walletType: WalletType | null;
}

export interface MultiChainWallet {
  connect: (chain: Chain) => Promise<boolean>;
  disconnect: () => void;
  switchChain: (chain: Chain) => Promise<boolean>;
  getBalance: () => Promise<string>;
  getState: () => WalletState;
  onChainChange: (callback: (chain: Chain) => void) => void;
  onAddressChange: (callback: (address: string | null) => void) => void;
}

// Detect wallet type
export function detectWalletType(): WalletType | null {
  if (typeof window === 'undefined') return null;
  
  if ((window as any).phantom?.solana?.isPhantom) {
    return 'phantom';
  }
  if ((window as any).ethereum?.isMetaMask) {
    return 'metamask';
  }
  if ((window as any).ethereum?.isCoinbaseWallet) {
    return 'coinbase';
  }
  return null;
}

// Create multi-chain wallet instance
export function createMultiChainWallet(): MultiChainWallet {
  let state: WalletState = {
    connected: false,
    address: null,
    chain: 'monad',
    balance: '0',
    walletType: null,
  };

  const listeners: {
    chain: ((chain: Chain) => void)[];
    address: ((address: string | null) => void)[];
  } = {
    chain: [],
    address: [],
  };

  async function connect(chain: Chain): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const config = CHAIN_CONFIGS[chain];
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      console.error('No wallet found');
      return false;
    }

    try {
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        state.address = accounts[0];
        state.connected = true;
        state.walletType = detectWalletType();
        
        // Get balance
        const balance = await ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        state.balance = (parseInt(balance, 16) / 1e18).toFixed(4);

        // Listen for chain changes
        ethereum.on('chainChanged', (chainId: string) => {
          const newChain = mapChainIdToChain(chainId);
          if (newChain) {
            state.chain = newChain;
            listeners.chain.forEach(cb => cb(newChain));
          }
        });

        // Listen for account changes
        ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            state.address = null;
            state.connected = false;
            listeners.address.forEach(cb => cb(null));
          } else {
            state.address = accounts[0];
            listeners.address.forEach(cb => cb(accounts[0]));
          }
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Wallet connection error:', error);
      return false;
    }
  }

  function disconnect() {
    state = {
      connected: false,
      address: null,
      chain: 'monad',
      balance: '0',
      walletType: null,
    };
    listeners.address.forEach(cb => cb(null));
  }

  async function switchChain(chain: Chain): Promise<boolean> {
    const config = CHAIN_CONFIGS[chain];
    const ethereum = (window as any).ethereum;

    if (!ethereum) return false;

    try {
      // Try to switch chain
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chain).toString(16)}` }],
      });
      state.chain = chain;
      listeners.chain.forEach(cb => cb(chain));
      return true;
    } catch (switchError: any) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${Number(chain).toString(16)}`,
              chainName: config.name,
              nativeCurrency: {
                name: config.symbol,
                symbol: config.symbol,
                decimals: 18,
              },
              rpcUrls: [config.rpc],
              blockExplorerUrls: [config.explorer],
            }],
          });
          state.chain = chain;
          listeners.chain.forEach(cb => cb(chain));
          return true;
        } catch (addError) {
          console.error('Error adding chain:', addError);
          return false;
        }
      }
      return false;
    }
  }

  async function getBalance(): Promise<string> {
    if (!state.address) return '0';
    
    const ethereum = (window as any).ethereum;
    if (!ethereum) return '0';

    try {
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [state.address, 'latest'],
      });
      return (parseInt(balance, 16) / 1e18).toFixed(4);
    } catch {
      return '0';
    }
  }

  return {
    connect,
    disconnect,
    switchChain,
    getBalance,
    getState: () => ({ ...state }),
    onChainChange: (cb) => listeners.chain.push(cb),
    onAddressChange: (cb) => listeners.address.push(cb),
  };
}

// Map chain ID to Chain type
function mapChainIdToChain(chainId: string): Chain | null {
  const chainIdNum = parseInt(chainId, 16);
  
  const chainMap: Record<number, Chain> = {
    10143: 'monad',   // Monad testnet (example)
    101: 'solana',    // Solana (placeholder)
    42220: 'celo',    // Celo
    8453: 'base',     // Base
  };
  
  return chainMap[chainIdNum] || null;
}
