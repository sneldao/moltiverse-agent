// Staking Panel - Lock $MV for reward multipliers

'use client';

import { useState } from 'react';
import { useTokenUtility, formatTokens } from './TokenContext';
import { STAKE_TIERS, parseTokens } from './tokenUtility';

export function StakingPanel() {
  const { tokenState, actions, tier, nextTier, tokensToNextTier } = useTokenUtility();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Invalid amount' });
      return;
    }

    const amountWei = parseTokens(amount);
    
    if (amountWei > tokenState.balance) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    setIsStaking(true);
    setMessage(null);

    const success = await actions.stake(amountWei);
    
    setIsStaking(false);
    if (success) {
      setMessage({ type: 'success', text: `Staked ${amount} $MV!` });
      setStakeAmount('');
    } else {
      setMessage({ type: 'error', text: 'Stake failed' });
    }
  };

  const handleUnstake = async () => {
    const amount = parseFloat(unstakeAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Invalid amount' });
      return;
    }

    const amountWei = parseTokens(amount);
    
    if (amountWei > tokenState.staked) {
      setMessage({ type: 'error', text: 'Cannot unstake more than staked' });
      return;
    }

    setIsStaking(true);
    setMessage(null);

    const success = await actions.unstake(amountWei);
    
    setIsStaking(false);
    if (success) {
      setMessage({ type: 'success', text: `Unstaked ${amount} $MV!` });
      setUnstakeAmount('');
    } else {
      setMessage({ type: 'error', text: 'Unstake failed' });
    }
  };

  const handleMaxStake = () => {
    setStakeAmount(formatTokens(tokenState.balance).toString());
  };

  const handleMaxUnstake = () => {
    setUnstakeAmount(formatTokens(tokenState.staked).toString());
  };

  return (
    <div className="staking-panel">
      <div className="panel-header">
        <span className="icon">🔒</span>
        <h3>Staking</h3>
        <span className="current-tier" style={{ background: tier.color + '20', color: tier.color }}>
          {tier.tierName} ({tokenState.multiplier}x)
        </span>
      </div>

      {/* Current Staking Stats */}
      <div className="staking-stats">
        <div className="stat-card">
          <span className="stat-label">Available</span>
          <span className="stat-value">{formatTokens(tokenState.balance).toLocaleString()} $MV</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Staked</span>
          <span className="stat-value accent">{formatTokens(tokenState.staked).toLocaleString()} $MV</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Multiplier</span>
          <span className="stat-value highlight">{tokenState.multiplier}x</span>
        </div>
      </div>

      {/* Next Tier Progress */}
      {nextTier && (
        <div className="tier-progress">
          <div className="progress-header">
            <span>Next: {nextTier.tierName}</span>
            <span>{formatTokens(tokensToNextTier).toLocaleString()} $MV to go</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(Number(tokenState.staked) / Number(nextTier.staked)) * 100}%`,
                background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`
              }} 
            />
          </div>
          <div className="tier-reward">
            <span>Unlocks {nextTier.multiplier}x rewards!</span>
          </div>
        </div>
      )}

      {/* Stake Tiers Overview */}
      <div className="tiers-overview">
        <h4>Tier System</h4>
        <div className="tiers-grid">
          {STAKE_TIERS.filter(t => t.staked > 0).map((t, i) => (
            <div 
              key={i} 
              className={`tier-badge ${tokenState.staked >= t.staked ? 'active' : ''}`}
              style={{ borderColor: t.color }}
            >
              <span className="tier-name" style={{ color: t.color }}>{t.tierName}</span>
              <span className="tier-mult">{t.multiplier}x</span>
              <span className="tier-req">{formatTokens(t.staked)} $MV</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stake Input */}
      <div className="stake-section">
        <h4>Stake $MV</h4>
        <div className="input-row">
          <input
            type="number"
            placeholder="Amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <button onClick={handleMaxStake} className="max-btn">MAX</button>
        </div>
        <button 
          onClick={handleStake} 
          disabled={isStaking || !stakeAmount}
          className="stake-btn"
        >
          {isStaking ? 'Staking...' : 'Stake'}
        </button>
      </div>

      {/* Unstake Input */}
      <div className="unstake-section">
        <h4>Unstake $MV</h4>
        <div className="input-row">
          <input
            type="number"
            placeholder="Amount to unstake"
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
          />
          <button onClick={handleMaxUnstake} className="max-btn">MAX</button>
        </div>
        <button 
          onClick={handleUnstake} 
          disabled={isStaking || !unstakeAmount}
          className="unstake-btn"
        >
          {isStaking ? 'Unstaking...' : 'Unstake'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Info */}
      <div className="staking-info">
        <p>💡 Staked tokens earn higher rewards in all games. Higher tiers = bigger multipliers!</p>
      </div>

      <style jsx>{`
        .staking-panel {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
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
        .current-tier {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .staking-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 14px;
          text-align: center;
        }
        .stat-label {
          display: block;
          font-size: 11px;
          color: #888;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: white;
        }
        .stat-value.accent {
          color: #a78bfa;
        }
        .stat-value.highlight {
          color: #fbbf24;
        }
        .tier-progress {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 10px;
        }
        .progress-header span:first-child {
          color: #a78bfa;
          font-weight: 600;
        }
        .progress-header span:last-child {
          color: #888;
        }
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .tier-reward {
          text-align: center;
          font-size: 12px;
          color: #fbbf24;
        }
        .tiers-overview {
          margin-bottom: 20px;
        }
        .tiers-overview h4 {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: #888;
        }
        .tiers-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tier-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid;
          border-radius: 8px;
          font-size: 11px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .tier-badge.active {
          opacity: 1;
        }
        .tier-name {
          font-weight: 700;
          margin-bottom: 2px;
        }
        .tier-mult {
          color: #fbbf24;
          font-weight: 600;
        }
        .tier-req {
          color: #666;
          font-size: 10px;
        }
        .stake-section, .unstake-section {
          margin-bottom: 16px;
        }
        .stake-section h4, .unstake-section h4 {
          margin: 0 0 10px 0;
          font-size: 13px;
          color: #888;
        }
        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        .input-row input {
          flex: 1;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          outline: none;
        }
        .input-row input:focus {
          border-color: #8b5cf6;
        }
        .max-btn {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: #a78bfa;
          font-size: 12-weight: 600px;
          font;
          cursor: pointer;
        }
        .stake-btn, .unstake-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .stake-btn {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }
        .unstake-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #a78bfa;
          border: 1px solid rgba(167, 139, 250, 0.3);
        }
        .stake-btn:disabled, .unstake-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .stake-btn:hover:not(:disabled), .unstake-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .message {
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
          margin-bottom: 16px;
        }
        .message.success {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        .message.error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .staking-info {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 12px;
        }
        .staking-info p {
          margin: 0;
          font-size: 12px;
          color: #888;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
