'use client';

import { http, createConfig, injected } from 'wagmi';
import { useState, useEffect } from 'react';

// Monad testnet configuration
const MONAD_CHAIN = {
  id: 10141,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
} as const;

// Wagmi config
export const config = createConfig({
  chains: [MONAD_CHAIN],
  transports: {
    [MONAD_CHAIN.id]: http(),
  },
  connectors: [injected()],
});

// Wallet state interface
interface WalletState {
  isConnected: boolean;
  address: `0x${string}` | null;
  chainId: number | null;
  isConnecting: boolean;
}

// Get wallet state hook
export function useWalletState(): WalletState {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isConnecting: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
          setWalletState({
            isConnected: true,
            address: accounts[0] as `0x${string}`,
            chainId: parseInt(chainId, 16),
            isConnecting: false,
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletState(prev => ({
          ...prev,
          isConnected: true,
          address: accounts[0] as `0x${string}`,
        }));
      } else {
        setWalletState({
          isConnected: false,
          address: null,
          chainId: null,
          isConnecting: false,
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWalletState(prev => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
    };

    (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    (window as any).ethereum.on('chainChanged', handleChainChanged);

    return () => {
      (window as any).ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      (window as any).ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return walletState;
}

// Connect wallet
export async function connectWallet(): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return { success: false, error: 'No wallet installed' };
  }

  try {
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Disconnect wallet
export async function disconnectWallet(): Promise<void> {
  // Wallet disconnection is handled by the wallet itself
}

// Switch to Monad
export async function switchToMonad(): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return { success: false, error: 'No wallet installed' };
  }

  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x279F' }],
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x279F',
            chainName: 'Monad Testnet',
            nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
            rpcUrls: ['https://testnet.rpc.monad.xyz'],
            blockExplorerUrls: ['https://testnet.monadexplorer.com'],
          }],
        });
        return { success: true };
      } catch (addError) {
        return { success: false, error: String(addError) };
      }
    }
    return { success: false, error: String(error) };
  }
}
