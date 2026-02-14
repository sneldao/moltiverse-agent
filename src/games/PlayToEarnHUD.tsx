// Play-to-Earn Rewards Display
// Shows rewards for winning games

'use client';

import { useState, useEffect } from 'react';
import { useTokenUtility, formatTokens } from './TokenContext';
import { GAME_REWARDS } from './tokenUtility';

interface RewardNotification {
  id: number;
  game: string;
  amount: bigint;
  rank: number;
  timestamp: number;
}

export function PlayToEarnHUD() {
  const { tokenState, tier } = useTokenUtility();
  const [recentRewards, setRecentRewards] = useState<RewardNotification[]>([]);
  const [showRewards, setShowRewards] = useState(false);

  // Demo: Add random rewards periodically
  useEffect(() => {
    const games = ['tetris', 'racing', 'battle', 'quest'];
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const game = games[Math.floor(Math.random() * games.length)];
        const reward = GAME_REWARDS[game];
        const rank = Math.random() > 0.3 ? 1 : Math.floor(Math.random() * 5) + 1;
        
        let amount = reward.baseReward;
        if (rank === 1) amount = reward.winReward;
        else if (rank <= 3) amount = reward.top3Bonus;
        
        // Apply multiplier
        amount = amount * BigInt(tokenState.multiplier);
        
        const notification: RewardNotification = {
          id: Date.now(),
          game,
          amount,
          rank,
          timestamp: Date.now(),
        };
        
        setRecentRewards(prev => [...prev.slice(-4), notification]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [tokenState.multiplier]);

  // Auto-hide notifications
  useEffect(() => {
    if (recentRewards.length > 0) {
      const timer = setTimeout(() => {
        setRecentRewards(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentRewards]);

  return (
    <>
      {/* Mini HUD */}
      <div className="p2e-hud">
        <div className="hud-item">
          <span className="hud-icon">🪙</span>
          <div className="hud-info">
            <span className="hud-label">Balance</span>
            <span className="hud-value">{formatTokens(tokenState.balance).toLocaleString()}</span>
          </div>
        </div>
        <div className="hud-item multiplier">
          <span className="hud-icon">⚡</span>
          <div className="hud-info">
            <span className="hud-label">Multiplier</span>
            <span className="hud-value">{tokenState.multiplier}x</span>
          </div>
        </div>
        <div className="hud-item">
          <span className="hud-icon">🏆</span>
          <div className="hud-info">
            <span className="hud-label">Tier</span>
            <span className="hud-value" style={{ color: tier.color }}>{tier.tierName}</span>
          </div>
        </div>
        <button className="rewards-btn" onClick={() => setShowRewards(true)}>
          View Rewards
        </button>
      </div>

      {/* Reward Notifications */}
      <div className="reward-notifications">
        {recentRewards.map((reward) => (
          <div key={reward.id} className="reward-toast">
            <span className="reward-icon">
              {reward.rank === 1 ? '🏆' : reward.rank <= 3 ? '🎖️' : '💪'}
            </span>
            <div className="reward-info">
              <span className="reward-game">{reward.game}</span>
              <span className="reward-result">
                {reward.rank === 1 ? '1st Place!' : `Rank #${reward.rank}`}
              </span>
            </div>
            <span className="reward-amount">+{formatTokens(reward.amount).toFixed(2)} $MV</span>
          </div>
        ))}
      </div>

      {/* Full Rewards Panel */}
      {showRewards && (
        <div className="rewards-modal-overlay" onClick={() => setShowRewards(false)}>
          <div className="rewards-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowRewards(false)}>×</button>
            
            <div className="modal-header">
              <span className="header-icon">🎮</span>
              <h2>Play-to-Earn</h2>
              <p>Win games, earn $MV tokens!</p>
            </div>

            {/* Your Stats */}
            <div className="your-stats">
              <div className="stat-box">
                <span className="stat-icon">💰</span>
                <span className="stat-value">{formatTokens(tokenState.balance).toLocaleString()}</span>
                <span className="stat-label">Current Balance</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📈</span>
                <span className="stat-value">{formatTokens(tokenState.totalEarned).toLocaleString()}</span>
                <span className="stat-label">Lifetime Earned</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">⚡</span>
                <span className="stat-value">{tokenState.multiplier}x</span>
                <span className="stat-label">Current Multiplier</span>
              </div>
            </div>

            {/* Game Rewards Table */}
            <div className="rewards-table">
              <h3>Game Rewards</h3>
              <table>
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Entry</th>
                    <th>1st Place</th>
                    <th>Top 3</th>
                    <th>Join</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(GAME_REWARDS).map(([key, reward]) => (
                    <tr key={key}>
                      <td className="game-name">
                        <span className="game-icon">
                          {key === 'tetris' ? '🧱' : key === 'racing' ? '🏎️' : key === 'battle' ? '⚔️' : '📜'}
                        </span>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </td>
                      <td>{formatTokens(reward.entryFee)} $MV</td>
                      <td className="win">+{formatTokens(reward.winReward)} $MV</td>
                      <td className="top3">+{formatTokens(reward.top3Bonus)} $MV</td>
                      <td>
                        <button className="play-btn">Play</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Multiplier Info */}
            <div className="multiplier-info">
              <h4>💎 Stake for Higher Rewards</h4>
              <p>Your current multiplier: <strong>{tokenState.multiplier}x</strong></p>
              <p className="tip">Stake more $MV in the Staking panel to increase your rewards!</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .p2e-hud {
          position: fixed;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px 20px;
          z-index: 100;
        }
        .hud-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hud-icon {
          font-size: 20px;
        }
        .hud-info {
          display: flex;
          flex-direction: column;
        }
        .hud-label {
          font-size: 10px;
          color: #888;
          text-transform: uppercase;
        }
        .hud-value {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }
        .hud-item.multiplier .hud-value {
          color: #fbbf24;
        }
        .rewards-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #22c554, #16a34a);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 8px;
        }
        .reward-notifications {
          position: fixed;
          top: 90px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 101;
        }
        .reward-toast {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(34, 197, 94, 0.5);
          border-radius: 12px;
          padding: 14px 18px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .reward-icon {
          font-size: 24px;
        }
        .reward-info {
          display: flex;
          flex-direction: column;
        }
        .reward-game {
          font-size: 12px;
          color: #888;
          text-transform: capitalize;
        }
        .reward-result {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }
        .reward-amount {
          font-size: 16px;
          font-weight: 700;
          color: #4ade80;
          margin-left: auto;
        }
        .rewards-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .rewards-modal {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          padding: 32px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .header-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
        }
        .modal-header h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          background: linear-gradient(135deg, #22c554, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .modal-header p {
          margin: 0;
          color: #888;
          font-size: 14px;
        }
        .your-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .stat-icon {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
        }
        .stat-box .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }
        .stat-box .stat-label {
          font-size: 11px;
          color: #888;
        }
        .rewards-table {
          margin-bottom: 24px;
        }
        .rewards-table h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #888;
        }
        .rewards-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .rewards-table th {
          text-align: left;
          padding: 10px;
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rewards-table td {
          padding: 14px 10px;
          font-size: 13px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .game-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }
        .game-icon {
          font-size: 18px;
        }
        .win {
          color: #4ade80;
          font-weight: 600;
        }
        .top3 {
          color: #fbbf24;
        }
        .play-btn {
          padding: 6px 14px;
          background: linear-gradient(135deg, #22c554, #16a34a);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .multiplier-info {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .multiplier-info h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        .multiplier-info p {
          margin: 4px 0;
          font-size: 13px;
          color: #aaa;
        }
        .multiplier-info .tip {
          color: #888;
          font-size: 12px;
        }
      `}</style>
    </>
  );
}
