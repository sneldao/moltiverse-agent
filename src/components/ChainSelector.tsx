// Chain Selector Component - Multi-chain support UI

'use client';

import { useState, useEffect } from 'react';
import { Chain, CHAIN_CONFIGS, ChainConfig } from '@/config/chains';
import { createMultiChainWallet, MultiChainWallet, WalletState } from '@/config/multiChainWallet';

interface ChainSelectorProps {
  onChainChange?: (chain: Chain) => void;
}

export function ChainSelector({ onChainChange }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState<MultiChainWallet | null>(null);
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    chain: 'monad',
    balance: '0',
    walletType: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize wallet
    const w = createMultiChainWallet();
    setWallet(w);

    // Listen for changes
    w.onChainChange((chain) => {
      setWalletState(prev => ({ ...prev, chain }));
    });
    w.onAddressChange((address) => {
      setWalletState(prev => ({ ...prev, address, connected: !!address }));
    });
  }, []);

  const handleConnect = async (chain: Chain) => {
    if (!wallet) return;
    setIsConnecting(true);
    const success = await wallet.connect(chain);
    setIsConnecting(false);
    
    if (success) {
      setWalletState(wallet.getState());
    }
  };

  const handleSwitchChain = async (chain: Chain) => {
    if (!wallet) return;
    await wallet.switchChain(chain);
    setWalletState(wallet.getState());
    onChainChange?.(chain);
  };

  const chains = Object.values(CHAIN_CONFIGS);
  const currentChain = CHAIN_CONFIGS[walletState.chain];

  return (
    <div className="chain-selector">
      {!walletState.connected ? (
        // Connect Wallet
        <div className="connect-section">
          <button 
            className="connect-btn"
            onClick={() => handleConnect('monad')}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        // Connected - show chain selector
        <div className="wallet-info">
          <div className="balance-display">
            <span className="balance">{parseFloat(walletState.balance).toFixed(4)}</span>
            <span className="symbol">{currentChain.symbol}</span>
          </div>
          
          <button 
            className="chain-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span 
              className="chain-indicator"
              style={{ background: currentChain.color }}
            />
            <span className="chain-name">{currentChain.name}</span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </button>

          {isOpen && (
            <div className="chain-dropdown">
              <div className="dropdown-header">
                <span>Select Network</span>
                <button className="disconnect-btn" onClick={() => {
                  wallet?.disconnect();
                  setWalletState({
                    connected: false,
                    address: null,
                    chain: 'monad',
                    balance: '0',
                    walletType: null,
                  });
                }}>
                  Disconnect
                </button>
              </div>
              <div className="chain-list">
                {chains.map((chain) => (
                  <button
                    key={chain.id}
                    className={`chain-option ${walletState.chain === chain.id ? 'active' : ''}`}
                    onClick={() => handleSwitchChain(chain.id)}
                  >
                    <span 
                      className="chain-icon"
                      style={{ background: chain.color }}
                    />
                    <div className="chain-details">
                      <span className="name">{chain.name}</span>
                      <span className="symbol">{chain.symbol}</span>
                    </div>
                    {walletState.chain === chain.id && (
                      <span className="check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {walletState.address && (
            <div className="address-display">
              {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .chain-selector {
          position: relative;
        }
        .connect-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .connect-btn:hover {
          transform: scale(1.05);
        }
        .connect-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .balance-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }
        .balance {
          font-weight: 700;
          color: white;
        }
        .symbol {
          font-size: 12px;
          color: #888;
        }
        .chain-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chain-btn:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        .chain-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .chain-name {
          font-weight: 500;
        }
        .dropdown-arrow {
          font-size: 10px;
          color: #888;
        }
        .chain-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          width: 240px;
          background: rgba(10, 10, 30, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          overflow: hidden;
          z-index: 100;
        }
        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dropdown-header span {
          font-size: 13px;
          color: #888;
        }
        .disconnect-btn {
          padding: 4px 10px;
          background: rgba(239, 68, 68, 0.2);
          border: none;
          border-radius: 6px;
          color: #ef4444;
          font-size: 11px;
          cursor: pointer;
        }
        .chain-list {
          padding: 8px;
        }
        .chain-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .chain-option:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .chain-option.active {
          background: rgba(139, 92, 246, 0.2);
        }
        .chain-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .chain-details {
          flex: 1;
          text-align: left;
        }
        .chain-details .name {
          display: block;
          font-weight: 600;
          color: white;
        }
        .chain-details .symbol {
          font-size: 12px;
          color: #888;
        }
        .check {
          color: #4ade80;
          font-weight: bold;
        }
        .address-display {
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 6px;
          font-size: 12px;
          color: #888;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
