// Daily Quests System for Moltiverse
// Quest types, rewards, and progress tracking

'use client';

import { useState, useEffect } from 'react';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'play' | 'win' | 'explore' | 'social' | 'earn';
  target: number;
  reward: number;
  progress: number;
  completed: boolean;
  expiresAt: Date;
  icon: string;
}

interface QuestCardProps {
  quest: Quest;
  onClaim: (questId: string) => void;
}

export function QuestCard({ quest, onClaim }: QuestCardProps) {
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
  const canClaim = quest.progress >= quest.target && !quest.completed;

  return (
    <div className={`quest-card ${quest.completed ? 'completed' : ''} ${canClaim ? 'claimable' : ''}`}>
      <div className="quest-icon">{quest.icon}</div>
      <div className="quest-content">
        <h4>{quest.title}</h4>
        <p>{quest.description}</p>
        <div className="quest-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="progress-text">
            {quest.progress}/{quest.target}
          </span>
        </div>
      </div>
      <div className="quest-reward">
        <span className="reward-amount">+{quest.reward} MV</span>
        {quest.completed ? (
          <span className="claim-status completed">✓</span>
        ) : canClaim ? (
          <button className="claim-btn" onClick={() => onClaim(quest.id)}>
            Claim
          </button>
        ) : null}
      </div>

      <style jsx>{`
        .quest-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          transition: all 0.3s;
        }
        .quest-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
        }
        .quest-card.completed {
          opacity: 0.6;
          border-color: rgba(34, 197, 94, 0.5);
        }
        .quest-card.claimable {
          border-color: rgba(34, 197, 94, 0.8);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
        }
        .quest-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .quest-content {
          flex: 1;
        }
        .quest-content h4 {
          margin: 0 0 4px 0;
          font-size: 15px;
        }
        .quest-content p {
          margin: 0 0 10px 0;
          font-size: 13px;
          color: #888;
        }
        .quest-progress {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #06b6d4);
          border-radius: 3px;
          transition: width 0.3s;
        }
        .progress-text {
          font-size: 12px;
          color: #888;
          min-width: 40px;
        }
        .quest-reward {
          text-align: center;
        }
        .reward-amount {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #8b5cf6;
          margin-bottom: 8px;
        }
        .claim-status {
          display: block;
          padding: 6px 12px;
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border-radius: 6px;
          font-size: 12px;
        }
        .claim-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #22c554, #16a34a);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .claim-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

export function DailyQuestsSystem() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first game in Moltiverse',
      type: 'play',
      target: 1,
      reward: 10,
      progress: 0,
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: '🎮',
    },
    {
      id: '2',
      title: 'Tetris Master',
      description: 'Score 1000 points in Tetris',
      type: 'win',
      target: 1000,
      reward: 25,
      progress: 450,
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: '🧱',
    },
    {
      id: '3',
      title: 'World Explorer',
      description: 'Visit 3 different zones in the 3D world',
      type: 'explore',
      target: 3,
      reward: 15,
      progress: 2,
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: '🌍',
    },
    {
      id: '4',
      title: 'Social Butterfly',
      description: 'Chat with 2 AI agents',
      type: 'social',
      target: 2,
      reward: 20,
      progress: 2,
      completed: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: '🦋',
    },
    {
      id: '5',
      title: 'Big Earner',
      description: 'Earn 100 MV tokens in a single session',
      type: 'earn',
      target: 100,
      reward: 50,
      progress: 0,
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: '💰',
    },
  ]);

  const [totalEarned, setTotalEarned] = useState(125);
  const [streak, setStreak] = useState(7);

  const claimReward = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      setTotalEarned(e => e + quest.reward);
      setQuests(prev =>
        prev.map(q =>
          q.id === questId ? { ...q, completed: true } : q
        )
      );
    }
  };

  const completedCount = quests.filter(q => q.completed).length;
  const dailyProgress = (completedCount / quests.length) * 100;

  return (
    <div className="quests-container">
      <div className="quests-header">
        <div className="header-stats">
          <div className="stat">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat">
            <span className="stat-icon">💎</span>
            <span className="stat-value">{totalEarned}</span>
            <span className="stat-label">MV Earned</span>
          </div>
          <div className="stat">
            <span className="stat-icon">📅</span>
            <span className="stat-value">{completedCount}/{quests.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="daily-progress">
          <div className="progress-header">
            <span>Daily Progress</span>
            <span>{Math.round(dailyProgress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${dailyProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="quests-list">
        {quests.map(quest => (
          <QuestCard key={quest.id} quest={quest} onClaim={claimReward} />
        ))}
      </div>

      <div className="quests-footer">
        <p>🎯 Complete all daily quests for bonus 50 MV!</p>
      </div>

      <style jsx>{`
        .quests-container {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 24px;
        }
        .quests-header {
          margin-bottom: 24px;
        }
        .header-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .stat {
          flex: 1;
          text-align: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }
        .stat-icon {
          display: block;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #8b5cf6;
        }
        .stat-label {
          font-size: 12px;
          color: #888;
        }
        .daily-progress {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 12px;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #06b6d4);
          border-radius: 4px;
          transition: width 0.3s;
        }
        .quests-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .quests-footer {
          margin-top: 20px;
          padding: 16px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 10px;
          text-align: center;
        }
        .quests-footer p {
          margin: 0;
          font-size: 14px;
          color: #a78bfa;
        }
      `}</style>
    </div>
  );
}
