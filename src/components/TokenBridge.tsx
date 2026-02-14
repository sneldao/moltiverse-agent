// Token Bridge UI - Cross-chain token transfers

'use client';

/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';
import { Chain, CHAIN_CONFIGS } from '@/config/chains';

export function TokenBridge() {
  const [fromChain, setFromChain] = useState<Chain>('monad');
  const [toChain, setToChain] = useState<Chain>('base');
  const [amount, setAmount] = useState('');
  const [isBridging, setIsBridging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'approving' | 'bridging' | 'complete' | 'error'>('idle');

  const chains = Object.values(CHAIN_CONFIGS);

  const handleSwap = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsBridging(true);
    setStatus('bridging');

    // Simulate bridging process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus('complete');
    } catch {
      setStatus('error');
    } finally {
      setIsBridging(false);
    }
  };

  const bridgeFee = parseFloat(amount || '0') * 0.01; // 1% fee
  const receiveAmount = parseFloat(amount || '0') - bridgeFee;

  return (
    <div className="bridge-panel">
      <div className="panel-header">
        <span className="icon">🌉</span>
        <h3>Token Bridge</h3>
        <span className="badge">Cross-Chain</span>
      </div>

      {/* From Chain */}
      <div className="chain-section">
        <label>From</label>
        <div className="chain-selector">
          <select 
            value={fromChain} 
            onChange={(e) => setFromChain(e.target.value as Chain)}
          >
            {chains.map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.name} ({chain.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="amount-input">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="max-btn" onClick={() => setAmount('100')}>MAX</span>
        </div>
      </div>

      {/* Swap Button */}
      <div className="swap-section">
        <button className="swap-btn" onClick={handleSwap}>
          ⇅
        </button>
      </div>

      {/* To Chain */}
      <div className="chain-section">
        <label>To</label>
        <div className="chain-selector">
          <select 
            value={toChain} 
            onChange={(e) => setToChain(e.target.value as Chain)}
          >
            {chains.map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.name} ({chain.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="receive-amount">
          <span className="label">You&apos;ll receive</span>
          <span className="amount">{receiveAmount.toFixed(4)} $MV</span>
        </div>
      </div>

      {/* Bridge Info */}
      <div className="bridge-info">
        <div className="info-row">
          <span>Bridge Fee</span>
          <span>{bridgeFee.toFixed(4)} $MV</span>
        </div>
        <div className="info-row">
          <span>Estimated Time</span>
          <span>~2-5 minutes</span>
        </div>
      </div>

      {/* Action Button */}
      <button 
        className={`bridge-btn ${status}`}
        onClick={handleBridge}
        disabled={isBridging || !amount || parseFloat(amount) <= 0}
      >
        {status === 'idle' && 'Bridge Tokens'}
        {status === 'bridging' && 'Bridging...'}
        {status === 'complete' && '✓ Bridge Complete!'}
        {status === 'error' && 'Try Again'}
      </button>

      {/* Warning */}
      <div className="bridge-warning">
        <span>⚠️</span>
        <p>Always verify the destination chain before bridging. Cross-chain transfers cannot be reversed.</p>
      </div>

      <style jsx>{`
        .bridge-panel {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .panel-header .icon {
          font-size: 24px;
        }
        .panel-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .badge {
          padding: 4px 12px;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .chain-section {
          margin-bottom: 16px;
        }
        .chain-section label {
          display: block;
          font-size: 12px;
          color: #888;
          margin-bottom: 8px;
        }
        .chain-selector select {
          width: 100%;
          padding: 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          outline: none;
          margin-bottom: 12px;
        }
        .chain-selector select:focus {
          border-color: #3b82f6;
        }
        .amount-input {
          display: flex;
          gap: 8px;
        }
        .amount-input input {
          flex: 1;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 20px;
          font-weight: 600;
          outline: none;
        }
        .amount-input input:focus {
          border-color: #3b82f6;
        }
        .max-btn {
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #60a5fa;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .swap-section {
          display: flex;
          justify-content: center;
          margin: -10px 0;
          position: relative;
          z-index: 1;
        }
        .swap-btn {
          width: 40px;
          height: 40px;
          background: #3b82f6;
          border: 3px solid #1a1a2e;
          border-radius: 50%;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .swap-btn:hover {
          transform: rotate(180deg);
        }
        .receive-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
        }
        .receive-amount .label {
          font-size: 13px;
          color: #888;
        }
        .receive-amount .amount {
          font-size: 20px;
          font-weight: 700;
          color: #60a5fa;
        }
        .bridge-info {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 14px;
          margin: 16px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .info-row:last-child {
          margin-bottom: 0;
        }
        .info-row span:first-child {
          color: #888;
        }
        .bridge-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 16px;
        }
        .bridge-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .bridge-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bridge-btn.complete {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }
        .bridge-btn.error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        .bridge-warning {
          display: flex;
          gap: 10px;
          padding: 12px;
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.3);
          border-radius: 10px;
        }
        .bridge-warning span {
          font-size: 16px;
        }
        .bridge-warning p {
          margin: 0;
          font-size: 12px;
          color: #ca8a04;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
