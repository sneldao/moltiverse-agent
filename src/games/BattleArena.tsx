// Battle Arena Mini-Game for Moltiverse
// PvP combat with ERC-8004 agents

'use client';

import { useState, useEffect, useCallback } from 'react';

interface BattleState {
  playerHealth: number;
  opponentHealth: number;
  playerEnergy: number;
  round: number;
  isPlayerTurn: boolean;
  battleOver: boolean;
  winner: 'player' | 'opponent' | null;
}

interface Move {
  id: string;
  name: string;
  damage: number;
  energyCost: number;
  icon: string;
  description: string;
}

export function BattleArenaMiniGame() {
  const [battle, setBattle] = useState<BattleState>({
    playerHealth: 100,
    opponentHealth: 100,
    playerEnergy: 50,
    round: 1,
    isPlayerTurn: true,
    battleOver: false,
    winner: null,
  });

  const [damagePopup, setDamagePopup] = useState<{ x: number; y: number; damage: number; type: string } | null>(null);

  const moves: Move[] = [
    { id: 'slash', name: 'Slash', damage: 15, energyCost: 10, icon: '⚔️', description: 'Quick attack' },
    { id: 'smash', name: 'Smash', damage: 25, energyCost: 20, icon: '🔨', description: 'Heavy hit' },
    { id: 'heal', name: 'Heal', damage: -20, energyCost: 15, icon: '💚', description: 'Restore health' },
    { id: 'fireball', name: 'Fireball', damage: 35, energyCost: 30, icon: '🔥', description: 'Magic attack' },
    { id: 'shield', name: 'Shield', damage: 0, energyCost: 15, icon: '🛡️', description: 'Block next attack' },
    { id: 'ultimate', name: 'Ultimate', damage: 50, energyCost: 45, icon: '💥', description: 'Massive damage' },
  ];

  const executeMove = useCallback((move: Move) => {
    if (battle.battleOver || !battle.isPlayerTurn) return;
    if (battle.playerEnergy < move.energyCost) return;

    const damage = move.damage > 0 ? move.damage : 0;
    const heal = move.damage < 0 ? -move.damage : 0;

    setBattle(prev => ({
      ...prev,
      playerEnergy: Math.max(0, prev.playerEnergy - move.energyCost),
      opponentHealth: Math.max(0, prev.opponentHealth - damage),
      playerHealth: Math.min(100, prev.playerHealth + heal),
      isPlayerTurn: false,
    }));

    // Show damage popup
    setDamagePopup({ x: 70 + Math.random() * 20, y: 50, damage, type: move.damage > 0 ? 'damage' : 'heal' });
    setTimeout(() => setDamagePopup(null), 1000);

    // Opponent response
    setTimeout(() => {
      const opponentDamage = Math.floor(Math.random() * 20) + 10;
      setBattle(prev => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - opponentDamage),
        round: prev.isPlayerTurn ? prev.round : prev.round + 1,
        isPlayerTurn: true,
      }));
    }, 1500);
  }, [battle.battleOver, battle.isPlayerTurn, battle.playerEnergy]);

  useEffect(() => {
    if (battle.opponentHealth <= 0) {
      setBattle(prev => ({ ...prev, battleOver: true, winner: 'player' }));
    } else if (battle.playerHealth <= 0) {
      setBattle(prev => ({ ...prev, battleOver: true, winner: 'opponent' }));
    }
  }, [battle.opponentHealth, battle.playerHealth]);

  const startNewBattle = () => {
    setBattle({
      playerHealth: 100,
      opponentHealth: 100,
      playerEnergy: 50,
      round: 1,
      isPlayerTurn: true,
      battleOver: false,
      winner: null,
    });
  };

  const getHealthColor = (health: number) => {
    if (health > 60) return '#22c554';
    if (health > 30) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="battle-arena">
      <div className="arena-header">
        <span className="icon">⚔️</span>
        <h3>Battle Arena</h3>
        <span className="round-badge">Round {battle.round}</span>
      </div>

      {/* Battle Field */}
      <div className="battle-field">
        {/* Player */}
        <div className="fighter player">
          <div className="fighter-avatar">🦞</div>
          <div className="fighter-name">You</div>
          <div className="health-bar-container">
            <div
              className="health-bar"
              style={{
                width: `${battle.playerHealth}%`,
                background: getHealthColor(battle.playerHealth)
              }}
            />
          </div>
          <div className="health-text">{battle.playerHealth}/100</div>
          <div className="energy-bar">
            <span>⚡ {battle.playerEnergy}</span>
            <div className="energy-fill" style={{ width: `${battle.playerEnergy}%` }} />
          </div>
        </div>

        {/* VS */}
        <div className="vs-badge">VS</div>

        {/* Opponent */}
        <div className="fighter opponent">
          <div className="fighter-avatar">🤖</div>
          <div className="fighter-name">AI Bot</div>
          <div className="health-bar-container">
            <div
              className="health-bar"
              style={{
                width: `${battle.opponentHealth}%`,
                background: getHealthColor(battle.opponentHealth)
              }}
            />
          </div>
          <div className="health-text">{battle.opponentHealth}/100</div>
        </div>

        {/* Damage Popup */}
        {damagePopup && (
          <div
            className="damage-popup"
            style={{ left: `${damagePopup.x}%` }}
          >
            {damagePopup.type === 'heal' ? '+' : '-'}{damagePopup.damage}
          </div>
        )}
      </div>

      {/* Battle Result */}
      {battle.battleOver && (
        <div className="battle-result">
          <div className={`result-banner ${battle.winner === 'player' ? 'victory' : 'defeat'}`}>
            <span className="result-icon">
              {battle.winner === 'player' ? '🎉' : '💀'}
            </span>
            <span className="result-text">
              {battle.winner === 'player' ? 'VICTORY!' : 'DEFEAT'}
            </span>
            <span className="result-rewards">
              {battle.winner === 'player' ? '+50 MV' : '+5 MV'}
            </span>
          </div>
          <button className="new-battle-btn" onClick={startNewBattle}>
            🔄 New Battle
          </button>
        </div>
      )}

      {/* Move */}
      {!battle.battleOver && (
        <div className="moves-section">
          <h4>Your Moves</h4>
          <div className="moves-grid">
            {moves.map((move) => (
              <button
                key={move.id}
                className={`move-btn ${battle.playerEnergy < move.energyCost ? 'disabled' : ''}`}
                onClick={() => executeMove(move)}
                disabled={!battle.isPlayerTurn || battle.playerEnergy < move.energyCost}
              >
                <span className="move-icon">{move.icon}</span>
                <span className="move-name">{move.name}</span>
                <span className="move-cost">-{move.energyCost}⚡</span>
                <span className="move-damage">{move.damage > 0 ? move.damage : '+'}{-move.damage} HP</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Battle Stats */}
      <div className="battle-stats">
        <div className="stat">
          <span className="stat-value">23</span>
          <span className="stat-label">Battles Won</span>
        </div>
        <div className="stat">
          <span className="stat-value">68%</span>
          <span className="stat-label">Win Rate</span>
        </div>
        <div className="stat">
          <span className="stat-value">🔥 5</span>
          <span className="stat-label">Streak</span>
        </div>
      </div>

      <style jsx>{`
        .battle-arena {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(234, 179, 8, 0.1));
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .arena-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .arena-header .icon {
          font-size: 24px;
        }
        .arena-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .round-badge {
          padding: 6px 14px;
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .battle-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          position: relative;
        }
        .fighter {
          flex: 1;
          text-align: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
        }
        .fighter.player {
          border: 2px solid rgba(34, 197, 94, 0.3);
        }
        .fighter.opponent {
          border: 2px solid rgba(239, 68, 68, 0.3);
        }
        .fighter-avatar {
          font-size: 64px;
          margin-bottom: 12px;
        }
        .fighter-name {
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 12px;
        }
        .health-bar-container {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .health-bar {
          height: 100%;
          transition: width 0.5s ease, background 0.3s;
          border-radius: 6px;
        }
        .health-text {
          font-size: 14px;
          color: #888;
          margin-bottom: 12px;
        }
        .energy-bar {
          font-size: 14px;
          color: #fbbf24;
          position: relative;
        }
        .energy-fill {
          height: 6px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          border-radius: 3px;
          margin-top: 6px;
          transition: width 0.3s;
        }
        .vs-badge {
          margin: 0 20px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(234, 179, 8, 0.2));
          border-radius: 50%;
          font-weight: 700;
          font-size: 18px;
          color: #ef4444;
        }
        .damage-popup {
          position: absolute;
          top: 30%;
          transform: translateX(-50%);
          font-size: 32px;
          font-weight: 700;
          color: #ef4444;
          animation: pop 1s ease forwards;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        @keyframes pop {
          0% { opacity: 1; transform: translateX(-50%) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) scale(1.5) translateY(-30px); }
        }
        .battle-result {
          text-align: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .result-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .result-banner.victory {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2));
          border: 2px solid rgba(34, 197, 94, 0.5);
        }
        .result-banner.defeat {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2));
          border: 2px solid rgba(239, 68, 68, 0.5);
        }
        .result-icon {
          font-size: 64px;
          margin-bottom: 12px;
        }
        .result-text {
          font-size: 32px;
          font-weight: 700;
        }
        .result-banner.victory .result-text {
          color: #4ade80;
        }
        .result-banner.defeat .result-text {
          color: #ef4444;
        }
        .result-rewards {
          font-size: 18px;
          color: #fbbf24;
          margin-top: 8px;
        }
        .new-battle-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .new-battle-btn:hover {
          transform: scale(1.02);
        }
        .moves-section {
          margin-bottom: 20px;
        }
        .moves-section h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .moves-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .move-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .move-btn:hover:not(.disabled) {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }
        .move-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .move-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .move-name {
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .move-cost {
          font-size: 12px;
          color: #fbbf24;
          margin-bottom: 4px;
        }
        .move-damage {
          font-size: 12px;
          color: #888;
        }
        .battle-stats {
          display: flex;
          gap: 16px;
        }
        .stat {
          flex: 1;
          text-align: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #8b5cf6;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 12px;
          color: #888;
        }
      `}</style>
    </div>
  );
}
