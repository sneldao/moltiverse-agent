// Agent Avatar Customization for Moltiverse
// Character customization, skins, and progression

'use client';

import { useState } from 'react';

interface AvatarSkin {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  icon: string;
  unlocked: boolean;
  price?: number;
}

interface AvatarAccessory {
  id: string;
  name: string;
  type: 'hat' | 'aura' | 'badge' | 'effect';
  icon: string;
  unlocked: boolean;
  price?: number;
}

export function AgentAvatarCustomization() {
  const [selectedSkin, setSelectedSkin] = useState('default');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [previewRotation, setPreviewRotation] = useState(0);

  const [skins] = useState<AvatarSkin[]>([
    { id: 'default', name: 'Classic L', rarity: 'common', color: '#22c55e', icon: '🦞', unlocked: true },
    { id: 'cyber', name: 'Cyber Blue', rarity: 'rare', color: '#3b82f6', icon: '🤖', unlocked: true },
    { id: 'gold', name: 'Golden', rarity: 'epic', color: '#f59e0b', icon: '👑', unlocked: false, price: 500 },
    { id: 'neon', name: 'Neon Pink', rarity: 'epic', color: '#ec4899', icon: '✨', unlocked: false, price: 750 },
    { id: 'shadow', name: 'Shadow', rarity: 'legendary', color: '#1e293b', icon: '🥷', unlocked: false, price: 1500 },
    { id: 'cosmic', name: 'Cosmic', rarity: 'legendary', color: '#a855f7', icon: '🌟', unlocked: false, price: 2000 },
  ]);

  const [accessories] = useState<AvatarAccessory[]>([
    { id: 'crown', name: 'Crown', type: 'hat', icon: '👑', unlocked: true },
    { id: 'halo', name: 'Halo', type: 'aura', icon: '😇', unlocked: false, price: 300 },
    { id: 'fire', name: 'Fire Aura', type: 'aura', icon: '🔥', unlocked: false, price: 400 },
    { id: 'veteran', name: 'Veteran', type: 'badge', icon: '🎖️', unlocked: true },
    { id: 'sparkles', name: 'Sparkles', type: 'effect', icon: '✨', unlocked: false, price: 200 },
    { id: 'wings', name: 'Angel Wings', type: 'effect', icon: '🪽', unlocked: false, price: 600 },
  ]);

  const unlockedSkins = skins.filter(s => s.unlocked).length;
  const unlockedAccessories = accessories.filter(a => a.unlocked).length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#3b82f6';
      case 'epic': return '#a855f7';
      case 'legendary': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="avatar-customization">
      <div className="customization-header">
        <span className="icon">🎨</span>
        <h3>Avatar Customization</h3>
        <span className="badge">{unlockedSkins + unlockedAccessories}/{skins.length + accessories.length}</span>
      </div>

      {/* Avatar Preview */}
      <div className="avatar-preview">
        <div
          className="preview-container"
          style={{ transform: `rotateY(${previewRotation}deg)` }}
        >
          <div className="preview-avatar">
            {selectedAccessories.includes('halo') && (
              <div className="aura halo">😇</div>
            )}
            {selectedAccessories.includes('fire') && (
              <div className="aura fire">🔥</div>
            )}
            <div
              className="avatar-skin"
              style={{
                background: skins.find(s => s.id === selectedSkin)?.color || '#22c55e'
              }}
            >
              {skins.find(s => s.id === selectedSkin)?.icon || '🦞'}
            </div>
            {selectedAccessories.includes('crown') && (
              <div className="accessory crown">👑</div>
            )}
          </div>
        </div>
        <div className="preview-controls">
          <button onClick={() => setPreviewRotation(r => r - 30)}>←</button>
          <span>Rotate</span>
          <button onClick={() => setPreviewRotation(r => r + 30)}>→</button>
        </div>
      </div>

      {/* Skins Section */}
      <div className="section">
        <h4>Skins</h4>
        <div className="items-grid">
          {skins.map((skin) => (
            <button
              key={skin.id}
              className={`item-card ${selectedSkin === skin.id ? 'selected' : ''} ${!skin.unlocked ? 'locked' : ''}`}
              onClick={() => skin.unlocked && setSelectedSkin(skin.id)}
            >
              <div
                className="item-icon"
                style={{ background: getRarityColor(skin.rarity) }}
              >
                {skin.unlocked ? skin.icon : '🔒'}
              </div>
              <div className="item-info">
                <span className="item-name">{skin.name}</span>
                <span className="item-rarity">{skin.rarity}</span>
              </div>
              {!skin.unlocked && (
                <span className="item-price">{skin.price} $MV</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accessories Section */}
      <div className="section">
        <h4>Accessories</h4>
        <div className="items-grid">
          {accessories.map((acc) => (
            <button
              key={acc.id}
              className={`item-card ${selectedAccessories.includes(acc.id) ? 'selected' : ''} ${!acc.unlocked ? 'locked' : ''}`}
              onClick={() => {
                if (acc.unlocked) toggleAccessory(acc.id);
              }}
            >
              <div className="item-icon">{acc.icon}</div>
              <div className="item-info">
                <span className="item-name">{acc.name}</span>
                <span className="item-type">{acc.type}</span>
              </div>
              {!acc.unlocked && (
                <span className="item-price">{acc.price} $MV</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progression */}
      <div className="progression-section">
        <h4>Avatar Progression</h4>
        <div className="progression-bars">
          <div className="progression-item">
            <span className="prog-label">Skins</span>
            <div className="prog-bar">
              <div
                className="prog-fill"
                style={{ width: `${(unlockedSkins / skins.length) * 100}%` }}
              />
            </div>
            <span className="prog-count">{unlockedSkins}/{skins.length}</span>
          </div>
          <div className="progression-item">
            <span className="prog-label">Accessories</span>
            <div className="prog-bar">
              <div
                className="prog-fill"
                style={{ width: `${(unlockedAccessories / accessories.length) * 100}%` }}
              />
            </div>
            <span className="prog-count">{unlockedAccessories}/{accessories.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="stats-display">
        <h4>Avatar Stats</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Speed</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: '75%' }} />
            </div>
            <span className="stat-value">75</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Luck</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: '60%' }} />
            </div>
            <span className="stat-value">60</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Charm</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: '90%' }} />
            </div>
            <span className="stat-value">90</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .avatar-customization {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .customization-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .customization-header .icon {
          font-size: 24px;
        }
        .customization-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .customization-header .badge {
          padding: 4px 12px;
          background: rgba(168, 85, 247, 0.2);
          color: #a78bfa;
          border-radius: 20px;
          font-size: 11px;
        }
        .avatar-preview {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 24px;
          text-align: center;
        }
        .preview-container {
          perspective: 500px;
          display: inline-block;
        }
        .preview-avatar {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
        }
        .avatar-skin {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          transition: all 0.3s;
        }
        .aura {
          position: absolute;
          inset: -20px;
          font-size: 48px;
          animation: pulse 2s infinite;
        }
        .aura.halo { filter: drop-shadow(0 0 20px gold); }
        .aura.fire { filter: drop-shadow(0 0 15px orange); }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .accessory.crown {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 36px;
        }
        .preview-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
        }
        .preview-controls button {
          width: 36px;
          height: 36px;
          background: rgba(168, 85, 247, 0.2);
          border: none;
          border-radius: 8px;
          color: #a78bfa;
          cursor: pointer;
        }
        .preview-controls span {
          font-size: 12px;
          color: #888;
        }
        .section {
          margin-bottom: 24px;
        }
        .section h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .item-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .item-card:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .item-card.selected {
          border-color: #a78bfa;
          background: rgba(168, 85, 247, 0.1);
        }
        .item-card.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .item-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .item-info {
          text-align: center;
        }
        .item-name {
          display: block;
          font-size: 12px;
          font-weight: 600;
        }
        .item-rarity, .item-type {
          font-size: 10px;
          color: #888;
          text-transform: uppercase;
        }
        .item-price {
          font-size: 11px;
          color: #f59e0b;
        }
        .progression-section {
          margin-bottom: 24px;
        }
        .progression-section h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .progression-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .progression-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .prog-label {
          width: 80px;
          font-size: 12px;
          color: #888;
        }
        .prog-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .prog-fill {
          height: 100%;
          background: linear-gradient(90deg, #a78bfa, #ec4899);
          border-radius: 4px;
          transition: width 0.3s;
        }
        .prog-count {
          width: 40px;
          text-align: right;
          font-size: 12px;
          color: #888;
        }
        .stats-display h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .stats-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-label {
          width: 60px;
          font-size: 12px;
          color: #888;
        }
        .stat-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .stat-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 3px;
        }
        .stat-value {
          width: 30px;
          text-align: right;
          font-size: 14px;
          font-weight: 700;
          color: #22c55e;
        }
      `}</style>
    </div>
  );
}
