// Enhanced Quest System with real rewards

'use client';

import { useState, useEffect } from 'react';
import { useTokenUtility, formatTokens } from './TokenContext';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'explore' | 'game' | 'social' | 'collect' | 'challenge';
  difficulty: 1 | 2 | 3;
  requirement: number;
  progress: number;
  reward: bigint;
  expiresAt: number;
  completed: boolean;
}

const QUEST_TEMPLATES: Omit<Quest, 'progress' | 'completed'>[] = [
  { id: 'q1', title: 'World Explorer', description: 'Visit 5 different zones in the world', type: 'explore', difficulty: 1, requirement: 5, reward: BigInt('1000000000000000000'), expiresAt: 0 },
  { id: 'q2', title: 'Tetris Champion', description: 'Win 3 Tetris games', type: 'game', difficulty: 2, requirement: 3, reward: BigInt('5000000000000000000'), expiresAt: 0 },
  { id: 'q3', title: 'Social Butterfly', description: 'Chat with 3 different agents', type: 'social', difficulty: 1, requirement: 3, reward: BigInt('2000000000000000000'), expiresAt: 0 },
  { id: 'q4', title: 'Collector', description: 'Find 10 collectibles in the world', type: 'collect', difficulty: 2, requirement: 10, reward: BigInt('5000000000000000000'), expiresAt: 0 },
  { id: 'q5', title: 'Speed Runner', description: 'Complete Tetris with 500+ points', type: 'challenge', difficulty: 3, requirement: 500, reward: BigInt('10000000000000000000'), expiresAt: 0 },
  { id: 'q6', title: 'First Blood', description: 'Win your first game', type: 'game', difficulty: 1, requirement: 1, reward: BigInt('1000000000000000000'), expiresAt: 0 },
  { id: 'q7', title: 'High Roller', description: 'Stake 10+ $MV', type: 'challenge', difficulty: 2, requirement: 10, reward: BigInt('3000000000000000000'), expiresAt: 0 },
  { id: 'q8', title: 'Agent Whisperer', description: 'Use all agent services once', type: 'social', difficulty: 2, requirement: 5, reward: BigInt('5000000000000000000'), expiresAt: 0 },
];

export function QuestSystem() {
  const { tokenState, actions } = useTokenUtility();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [showQuests, setShowQuests] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize quests
  useEffect(() => {
    const dailyQuests = QUEST_TEMPLATES.map((q, i) => ({
      ...q,
      progress: Math.floor(Math.random() * q.requirement), // Random progress for demo
      completed: Math.random() > 0.8, // Some completed for demo
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }));
    setQuests(dailyQuests);
  }, []);

  // Listen for quest progress events (would be connected to game actions)
  const updateProgress = (type: Quest['type'], amount: number) => {
    setQuests(prev => prev.map(quest => {
      if (quest.type === type && !quest.completed) {
        const newProgress = Math.min(quest.progress + amount, quest.requirement);
        const completed = newProgress >= quest.requirement;
        
        if (completed && !quest.completed) {
          // Award reward
          actions.awardReward(quest.reward, quest.title);
          setNotification(`🎉 Quest Complete: ${quest.title} +${formatTokens(quest.reward)} $MV!`);
          setTimeout(() => setNotification(null), 4000);
        }
        
        return { ...quest, progress: newProgress, completed };
      }
      return quest;
    }));
  };

  const difficultyColors = { 1: '#4ade80', 2: '#fbbf24', 3: '#ef4444' };
  const difficultyNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

  return (
    <>
      {/* Quest Button */}
      <button
        onClick={() => setShowQuests(true)}
        className="quest-btn"
        style={{
          position: 'fixed',
          top: '80px',
          left: '20px',
          zIndex: 100,
        }}
      >
        <span className="quest-icon">📜</span>
        <span className="quest-label">Quests</span>
        {quests.filter(q => !q.completed).length > 0 && (
          <span className="quest-badge">{quests.filter(q => !q.completed).length}</span>
        )}
      </button>

      {/* Notification */}
      {notification && (
        <div className="quest-notification">
          {notification}
        </div>
      )}

      {/* Quest Panel */}
      {showQuests && (
        <div className="quest-overlay" onClick={() => setShowQuests(false)}>
          <div className="quest-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h2>📜 Daily Quests</h2>
              <p>Complete quests to earn $MV rewards!</p>
              <button className="close-btn" onClick={() => setShowQuests(false)}>×</button>
            </div>

            <div className="quest-stats">
              <div className="stat">
                <span className="value">{quests.filter(q => q.completed).length}</span>
                <span className="label">Completed</span>
              </div>
              <div className="stat">
                <span className="value">{quests.filter(q => !q.completed).length}</span>
                <span className="label">Remaining</span>
              </div>
              <div className="stat">
                <span className="value">{formatTokens(quests.filter(q => q.completed).reduce((acc, q) => acc + q.reward, BigInt(0)))}</span>
                <span className="label">$MV Earned</span>
              </div>
            </div>

            <div className="quest-list">
              {quests.map(quest => (
                <div key={quest.id} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
                  <div className="quest-header">
                    <div className="quest-info">
                      <h4>{quest.title}</h4>
                      <p>{quest.description}</p>
                    </div>
                    <span 
                      className="difficulty"
                      style={{ background: difficultyColors[quest.difficulty] + '20', color: difficultyColors[quest.difficulty] }}
                    >
                      {difficultyNames[quest.difficulty]}
                    </span>
                  </div>
                  
                  <div className="quest-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(quest.progress / quest.requirement) * 100}%`,
                          background: quest.completed ? '#4ade80' : '#8b5cf6'
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {quest.progress}/{quest.requirement}
                    </span>
                  </div>

                  <div className="quest-reward">
                    <span>Reward:</span>
                    <span className="reward-amount">+{formatTokens(quest.reward)} $MV</span>
                  </div>

                  {quest.completed && (
                    <div className="completed-badge">✅ Completed!</div>
                  )}
                </div>
              ))}
            </div>

            <div className="quest-tips">
              <h4>💡 Tips</h4>
              <ul>
                <li>Talk to agents in the world to progress social quests</li>
                <li>Play Tetris to complete game challenges</li>
                <li>Explore all zones for exploration rewards</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quest-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: 12px;
          color: #a78bfa;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quest-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          transform: scale(1.05);
        }
        .quest-icon {
          font-size: 18px;
        }
        .quest-badge {
          background: #ef4444;
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
        }
        .quest-notification {
          position: fixed;
          top: 120px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #22c554, #16a34a);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          font-weight: 600;
          z-index: 300;
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .quest-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }
        .quest-panel {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .panel-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }
        .panel-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
        }
        .panel-header p {
          margin: 0;
          color: #888;
          font-size: 14px;
        }
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
        }
        .quest-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 16px 24px;
          background: rgba(0, 0, 0, 0.2);
        }
        .stat {
          text-align: center;
        }
        .stat .value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #a78bfa;
        }
        .stat .label {
          font-size: 12px;
          color: #888;
        }
        .quest-list {
          padding: 16px;
        }
        .quest-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .quest-item.completed {
          opacity: 0.7;
          border-color: rgba(34, 197, 94, 0.3);
        }
        .quest-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .quest-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }
        .quest-info p {
          margin: 0;
          font-size: 13px;
          color: #888;
        }
        .difficulty {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        .quest-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .progress-text {
          font-size: 12px;
          color: #888;
          min-width: 40px;
          text-align: right;
        }
        .quest-reward {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .quest-reward span:first-child {
          color: #888;
        }
        .reward-amount {
          color: #4ade80;
          font-weight: 600;
        }
        .completed-badge {
          margin-top: 12px;
          text-align: center;
          color: #4ade80;
          font-weight: 600;
        }
        .quest-tips {
          padding: 16px 24px;
          background: rgba(139, 92, 246, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .quest-tips h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
        }
        .quest-tips ul {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #888;
        }
        .quest-tips li {
          margin-bottom: 6px;
        }
      `}</style>
    </>
  );
}
