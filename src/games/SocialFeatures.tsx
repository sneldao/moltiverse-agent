// Social Features for Moltiverse
// Friends, guilds, and player interactions

'use client';

import { useState } from 'react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'in_game';
  score: number;
  lastSeen: string;
}

interface Guild {
  id: string;
  name: string;
  members: number;
  rank: number;
  score: number;
  description: string;
}

export function SocialFeatures() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'CryptoKing', avatar: '👑', status: 'online', score: 15420, lastSeen: 'Now' },
    { id: '2', name: 'TetrisPro', avatar: '🧱', status: 'in_game', score: 12850, lastSeen: 'In Tetris' },
    { id: '3', name: 'AgentMaster', avatar: '🤖', status: 'online', score: 11200, lastSeen: 'Now' },
    { id: '4', name: 'RacingAce', avatar: '🏎️', status: 'offline', score: 9800, lastSeen: '2h ago' },
    { id: '5', name: 'QuestHunter', avatar: '🎯', status: 'online', score: 8450, lastSeen: 'Now' },
  ]);

  const [guilds, setGuilds] = useState<Guild[]>([
    { id: '1', name: 'Moltiverse Elite', members: 128, rank: 1, score: 154200, description: 'Top players united' },
    { id: '2', name: 'Tetris Masters', members: 89, rank: 2, score: 98450, description: 'Block stacking champions' },
    { id: '3', name: 'Agent Builders', members: 67, rank: 3, score: 76500, description: 'ERC-8004 enthusiasts' },
  ]);

  const [activeTab, setActiveTab] = useState<'friends' | 'guilds' | 'activity'>('friends');

  return (
    <div className="social-container">
      <div className="social-header">
        <span className="icon">👥</span>
        <h3>Social Hub</h3>
        <span className="badge">Live</span>
      </div>

      {/* Tabs */}
      <div className="social-tabs">
        {(['friends', 'guilds', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="friends-list">
          <div className="friends-header">
            <span>Online: {friends.filter(f => f.status === 'online').length}</span>
            <button className="add-btn">+ Add</button>
          </div>
          {friends.map((friend) => (
            <div key={friend.id} className={`friend-card ${friend.status}`}>
              <div className="friend-avatar">
                {friend.avatar}
                <span className={`status-dot ${friend.status}`} />
              </div>
              <div className="friend-info">
                <span className="friend-name">{friend.name}</span>
                <span className="friend-status">{friend.lastSeen}</span>
              </div>
              <div className="friend-score">
                {friend.score.toLocaleString()}
              </div>
              <div className="friend-actions">
                <button className="action-btn">👋</button>
                <button className="action-btn">🎮</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guilds Tab */}
      {activeTab === 'guilds' && (
        <div className="guilds-list">
          <div className="guilds-header">
            <span>Top Guilds</span>
            <button className="create-btn">+ Create</button>
          </div>
          {guilds.map((guild) => (
            <div key={guild.id} className="guild-card">
              <div className="guild-rank">#{guild.rank}</div>
              <div className="guild-info">
                <span className="guild-name">{guild.name}</span>
                <span className="guild-desc">{guild.description}</span>
                <div className="guild-stats">
                  <span>👥 {guild.members}</span>
                  <span>🏆 {guild.score.toLocaleString()}</span>
                </div>
              </div>
              <button className="join-btn">Join</button>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="activity-feed">
          <div className="activity-item">
            <span className="activity-icon">🎉</span>
            <div className="activity-content">
              <span className="activity-text">
                <strong>CryptoKing</strong> won a battle!
              </span>
              <span className="activity-time">2 min ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🏆</span>
            <div className="activity-content">
              <span className="activity-text">
                <strong>TetrisPro</strong> reached score 15,000!
              </span>
              <span className="activity-time">5 min ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👋</span>
            <div className="activity-content">
              <span className="activity-text">
                <strong>AgentMaster</strong> joined the game
              </span>
              <span className="activity-time">10 min ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🎮</span>
            <div className="activity-content">
              <span className="activity-text">
                <strong>RacingAce</strong> unlocked new track
              </span>
              <span className="activity-time">15 min ago</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .social-container {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(236, 72, 153, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .social-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .social-header .icon {
          font-size: 24px;
        }
        .social-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .social-header .badge {
          padding: 4px 12px;
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border-radius: 20px;
          font-size: 11px;
        }
        .social-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tab {
          flex: 1;
          padding: 10px;
          background: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab:hover {
          color: white;
        }
        .tab.active {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          color: white;
        }
        .friends-header, .guilds-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 13px;
          color: #888;
        }
        .add-btn, .create-btn {
          padding: 6px 14px;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          cursor: pointer;
        }
        .friend-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }
        .friend-card:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .friend-avatar {
          position: relative;
          font-size: 28px;
        }
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #1e293b;
        }
        .status-dot.online { background: #22c554; }
        .status-dot.in_game { background: #eab308; }
        .status-dot.offline { background: #6b7280; }
        .friend-info {
          flex: 1;
        }
        .friend-name {
          display: block;
          font-weight: 600;
          font-size: 14px;
        }
        .friend-status {
          font-size: 12px;
          color: #888;
        }
        .friend-score {
          font-size: 14px;
          font-weight: 700;
          color: #ec4899;
        }
        .friend-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: rgba(236, 72, 153, 0.3);
        }
        .guild-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin-bottom: 12px;
        }
        .guild-rank {
          font-size: 18px;
          font-weight: 700;
          color: #ec4899;
          width: 40px;
        }
        .guild-info {
          flex: 1;
        }
        .guild-name {
          display: block;
          font-weight: 600;
          font-size: 14px;
        }
        .guild-desc {
          font-size: 12px;
          color: #888;
          display: block;
          margin-bottom: 6px;
        }
        .guild-stats {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #888;
        }
        .join-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .activity-icon {
          font-size: 24px;
        }
        .activity-content {
          flex: 1;
        }
        .activity-text {
          display: block;
          font-size: 13px;
          line-height: 1.4;
        }
        .activity-time {
          font-size: 11px;
          color: #888;
        }
      `}</style>
    </div>
  );
}
