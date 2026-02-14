// Enhanced Game HUD - Better in-game UI

'use client';

import { useState, useEffect } from 'react';

interface GameHUDProps {
  gameType: string;
  score: number;
  level: number;
  time?: number;
  onPause?: () => void;
  onQuit?: () => void;
}

export function GameHUD({ gameType, score, level, time, onPause, onQuit }: GameHUDProps) {
  const [showSettings, setShowSettings] = useState(false);

  const gameIcons: Record<string, string> = {
    tetris: '🧱',
    racing: '🏎️',
    battle: '⚔️',
  };

  return (
    <div className="game-hud">
      {/* Top Bar */}
      <div className="hud-top">
        <div className="game-info">
          <span className="game-icon">{gameIcons[gameType] || '🎮'}</span>
          <span className="game-name">{gameType.charAt(0).toUpperCase() + gameType.slice(1)}</span>
        </div>
        
        <div className="hud-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          {time !== undefined && (
            <div className="stat">
              <span className="stat-label">Time</span>
              <span className="stat-value">{formatTime(time)}</span>
            </div>
          )}
        </div>

        <div className="hud-actions">
          <button className="hud-btn" onClick={onPause}>
            ⏸️
          </button>
          <button className="hud-btn" onClick={() => setShowSettings(!showSettings)}>
            ⚙️
          </button>
          <button className="hud-btn quit" onClick={onQuit}>
            ✕
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="level-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(score % 1000) / 10}%` }} />
        </div>
        <span className="progress-label">Next Level in {1000 - (score % 1000)} pts</span>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h4>Game Settings</h4>
          <div className="setting">
            <span>Sound</span>
            <button className="toggle on">ON</button>
          </div>
          <div className="setting">
            <span>Music</span>
            <button className="toggle on">ON</button>
          </div>
          <div className="setting">
            <span>Effects</span>
            <button className="toggle on">ON</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }
        .hud-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
        }
        .game-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .game-icon {
          font-size: 28px;
        }
        .game-name {
          font-size: 18px;
          font-weight: 700;
          color: white;
        }
        .hud-stats {
          display: flex;
          gap: 32px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-label {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hud-actions {
          display: flex;
          gap: 8px;
        }
        .hud-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          border: none;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hud-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }
        .hud-btn.quit:hover {
          background: rgba(239,68,68,0.5);
        }
        .level-progress {
          padding: 0 24px;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        .progress-label {
          display: block;
          text-align: center;
          font-size: 11px;
          color: #888;
          margin-top: 4px;
        }
        .settings-panel {
          position: absolute;
          top: 80px;
          right: 24px;
          background: rgba(10,10,30,0.95);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
        }
        .settings-panel h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #aaa;
        }
        .setting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .toggle {
          padding: 4px 12px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          cursor: pointer;
        }
        .toggle.on {
          background: rgba(34,197,94,0.3);
          color: #4ade80;
        }
      `}</style>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Mini player stats overlay
export function PlayerStatsOverlay({ 
  health = 100, 
  energy = 100, 
  tokens = 0 
}: { 
  health?: number; 
  energy?: number; 
  tokens?: number; 
}) {
  return (
    <div className="player-stats-overlay">
      <div className="stat-bar health">
        <span className="icon">❤️</span>
        <div className="bar">
          <div className="fill" style={{ width: `${health}%` }} />
        </div>
        <span className="value">{health}</span>
      </div>
      <div className="stat-bar energy">
        <span className="icon">⚡</span>
        <div className="bar">
          <div className="fill" style={{ width: `${energy}%` }} />
        </div>
        <span className="value">{energy}</span>
      </div>
      <div className="stat-bar tokens">
        <span className="icon">🪙</span>
        <span className="value">{tokens.toLocaleString()}</span>
      </div>

      <style jsx>{`
        .player-stats-overlay {
          position: absolute;
          bottom: 80px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(0,0,0,0.7);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        .icon {
          font-size: 16px;
        }
        .bar {
          width: 100px;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .health .fill { background: #ef4444; }
        .energy .fill { background: #fbbf24; }
        .value {
          font-size: 14px;
          font-weight: 700;
          min-width: 40px;
        }
        .stat-bar.health .value { color: #ef4444; }
        .stat-bar.energy .value { color: #fbbf24; }
        .stat-bar.tokens .value { color: #4ade80; }
      `}</style>
    </div>
  );
}
