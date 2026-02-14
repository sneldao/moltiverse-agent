// Leaderboard - Track top players and your rankings

'use client';

import { useState, useEffect } from 'react';
import { useTokenUtility, formatTokens } from './TokenContext';

interface LeaderboardEntry {
  rank: number;
  address: string;
  points: number;
  wins: number;
  gamesPlayed: number;
  tier: string;
}

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: '0x742d...9A3f', points: 15420, wins: 87, gamesPlayed: 142, tier: 'Diamond' },
  { rank: 2, address: '0x1a2b...8C4d', points: 12850, wins: 71, gamesPlayed: 128, tier: 'Diamond' },
  { rank: 3, address: '0x9E12...5F6g', points: 11200, wins: 62, gamesPlayed: 115, tier: 'Gold' },
  { rank: 4, address: '0x3B4c...7D8e', points: 9840, wins: 54, gamesPlayed: 98, tier: 'Gold' },
  { rank: 5, address: '0x5C6d...2E9f', points: 8720, wins: 48, gamesPlayed: 89, tier: 'Silver' },
  { rank: 6, address: '0x7E8f...4A1g', points: 7650, wins: 42, gamesPlayed: 78, tier: 'Silver' },
  { rank: 7, address: '0x2D3e...6B5h', points: 6890, wins: 38, gamesPlayed: 71, tier: 'Bronze' },
  { rank: 8, address: '0x8F1a...9C3i', points: 6120, wins: 34, gamesPlayed: 65, tier: 'Bronze' },
  { rank: 9, address: '0x4E2b...1D7j', points: 5450, wins: 30, gamesPlayed: 58, tier: 'Bronze' },
  { rank: 10, address: '0x6A3c...8E2k', points: 4890, wins: 27, gamesPlayed: 52, tier: 'Bronze' },
];

interface YourStats {
  rank: number;
  points: number;
  wins: number;
  gamesPlayed: number;
  streak: number;
}

export function Leaderboard() {
  const { tokenState } = useTokenUtility();
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'day'>('all');
  const [yourStats, setYourStats] = useState<YourStats>({
    rank: 42,
    points: 2340,
    wins: 12,
    gamesPlayed: 28,
    streak: 3,
  });
  const [showFull, setShowFull] = useState(false);

  // Calculate your rank based on token balance (mock logic)
  useEffect(() => {
    const estimatedPoints = Number(tokenState.balance) / 1e16 + Number(tokenState.totalEarned) / 1e16;
    const estimatedRank = Math.max(1, 50 - Math.floor(estimatedPoints / 100));
    setYourStats(prev => ({
      ...prev,
      points: Math.floor(estimatedPoints),
      rank: estimatedRank,
    }));
  }, [tokenState.balance, tokenState.totalEarned]);

  const tierColors: Record<string, string> = {
    Diamond: '#b9f2ff',
    Gold: '#ffd700',
    Silver: '#c0c0c0',
    Bronze: '#cd7f32',
  };

  const displayedLeaderboard = showFull ? MOCK_LEADERBOARD : MOCK_LEADERBOARD.slice(0, 5);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <span className="icon">🏆</span>
        <h3>Leaderboard</h3>
        <div className="time-filters">
          <button 
            className={timeFilter === 'day' ? 'active' : ''} 
            onClick={() => setTimeFilter('day')}
          >
            24h
          </button>
          <button 
            className={timeFilter === 'week' ? 'active' : ''} 
            onClick={() => setTimeFilter('week')}
          >
            7d
          </button>
          <button 
            className={timeFilter === 'all' ? 'active' : ''} 
            onClick={() => setTimeFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      {/* Your Stats */}
      <div className="your-stats-card">
        <div className="your-rank">
          <span className="rank-label">Your Rank</span>
          <span className="rank-value">#{yourStats.rank}</span>
        </div>
        <div className="your-stats-grid">
          <div className="stat-item">
            <span className="stat-value">{yourStats.points.toLocaleString()}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{yourStats.wins}</span>
            <span className="stat-label">Wins</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{yourStats.gamesPlayed}</span>
            <span className="stat-label">Games</span>
          </div>
          <div className="stat-item streak">
            <span className="stat-value">🔥 {yourStats.streak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
      </div>

      {/* Top Players */}
      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Points</th>
              <th>Wins</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {displayedLeaderboard.map((player) => (
              <tr key={player.rank} className={player.rank <= 3 ? 'top-three' : ''}>
                <td className="rank-cell">
                  <span className={`rank-badge ${player.rank <= 3 ? `rank-${player.rank}` : ''}`}>
                    {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                  </span>
                </td>
                <td className="player-cell">
                  <span className="player-address">{player.address}</span>
                </td>
                <td className="points-cell">
                  {player.points.toLocaleString()}
                </td>
                <td className="wins-cell">
                  {player.wins}
                </td>
                <td className="tier-cell">
                  <span 
                    className="tier-badge"
                    style={{ 
                      background: tierColors[player.tier] + '20',
                      color: tierColors[player.tier]
                    }}
                  >
                    {player.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More */}
      {!showFull && (
        <button className="show-more-btn" onClick={() => setShowFull(true)}>
          Show More ▼
        </button>
      )}

      {/* Points to Next Rank */}
      <div className="rank-progress">
        <div className="progress-header">
          <span>Points to Rank #{Math.max(1, yourStats.rank - 1)}</span>
          <span>{(yourStats.rank > 1 ? (51 - yourStats.rank) * 100 : 0).toLocaleString()} pts</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(100, (yourStats.points / 5000) * 100)}%` }} />
        </div>
      </div>

      <style jsx>{`
        .leaderboard {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .leaderboard-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .leaderboard-header .icon {
          font-size: 24px;
        }
        .leaderboard-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .time-filters {
          display: flex;
          gap: 4px;
        }
        .time-filters button {
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }
        .time-filters button.active {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }
        .your-stats-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(167, 139, 250, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .your-rank {
          text-align: center;
          margin-bottom: 12px;
        }
        .rank-label {
          display: block;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 4px;
        }
        .rank-value {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .your-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .stat-item {
          text-align: center;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        .stat-item .stat-value {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: white;
        }
        .stat-item .stat-label {
          font-size: 10px;
          color: #888;
        }
        .stat-item.streak .stat-value {
          color: #ef4444;
        }
        .leaderboard-table {
          margin-bottom: 16px;
        }
        .leaderboard-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .leaderboard-table th {
          text-align: left;
          padding: 10px 8px;
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .leaderboard-table td {
          padding: 12px 8px;
          font-size: 13px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .leaderboard-table .top-three {
          background: rgba(251, 191, 36, 0.05);
        }
        .rank-cell {
          width: 50px;
        }
        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 14px;
        }
        .rank-badge.rank-1 {
          background: rgba(255, 215, 0, 0.3);
        }
        .rank-badge.rank-2 {
          background: rgba(192, 192, 192, 0.3);
        }
        .rank-badge.rank-3 {
          background: rgba(205, 127, 50, 0.3);
        }
        .player-address {
          font-family: monospace;
          color: #aaa;
        }
        .points-cell {
          font-weight: 600;
          color: #fbbf24;
        }
        .wins-cell {
          color: #888;
        }
        .tier-badge {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }
        .show-more-btn {
          width: 100%;
          padding: 10px;
          background: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .show-more-btn:hover {
          background: rgba(0, 0, 0, 0.3);
          color: #aaa;
        }
        .rank-progress {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 12px;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #888;
          margin-bottom: 8px;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}
