// 3D Spatial Audio System for Moltiverse
// Immersive audio based on position and distance

'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AudioSource {
  id: string;
  position: [number, number, number];
  sound: string;
  volume: number;
  loop: boolean;
  spatial: boolean;
}

interface AudioZone {
  id: string;
  position: [number, number, number];
  radius: number;
  sound: string;
  ambient: boolean;
}

export function SpatialAudioSystem() {
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [spatialEnabled, setSpatialEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const [audioSources] = useState<AudioSource[]>([
    { id: 'portal-tetris', position: [-25, 2, -20], sound: 'portal_ambient', volume: 0.5, loop: true, spatial: true },
    { id: 'portal-racing', position: [25, 2, -20], sound: 'engine_hum', volume: 0.6, loop: true, spatial: true },
    { id: 'hub-music', position: [0, 5, 0], sound: 'ambient_music', volume: 0.4, loop: true, spatial: false },
    { id: 'npc-chat', position: [-15, 2, 15], sound: 'npc_voice', volume: 0.3, loop: false, spatial: true },
    { id: 'battle-arena', position: [0, 2, 30], sound: 'battle_ambience', volume: 0.7, loop: true, spatial: true },
  ]);

  const [audioZones] = useState<AudioZone[]>([
    { id: 'central-hub', position: [0, 0, 0], radius: 20, sound: 'hub_ambience', ambient: true },
    { id: 'tetris-zone', position: [-25, 0, -20], radius: 15, sound: 'puzzle_sounds', ambient: true },
    { id: 'racing-zone', position: [25, 0, -20], radius: 20, sound: 'engine_sounds', ambient: true },
    { id: 'battle-zone', position: [0, 0, 30], radius: 18, sound: 'combat_sounds', ambient: true },
    { id: 'secret-zone', position: [-40, 0, -40], radius: 12, sound: 'mystery_ambience', ambient: true },
  ]);

  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Simulate 3D audio based on player position
  useEffect(() => {
    if (!spatialEnabled) return;

    const calculateSpatialVolume = (source: AudioSource) => {
      const dx = source.position[0] - playerPosition[0];
      const dy = source.position[1] - playerPosition[1];
      const dz = source.position[2] - playerPosition[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Inverse distance model
      const maxDistance = 50;
      const volume = Math.max(0, 1 - distance / maxDistance);
      return volume * source.volume * masterVolume;
    };

    // Update audio volumes based on player position
    console.log('Spatial audio updated for position:', playerPosition);
  }, [playerPosition, spatialEnabled, masterVolume]);

  return (
    <div className="spatial-audio">
      <div className="audio-header">
        <span className="icon">🔊</span>
        <h3>3D Spatial Audio</h3>
        <span className={`badge ${spatialEnabled ? 'active' : 'inactive'}`}>
          {spatialEnabled ? '● Active' : '○ Off'}
        </span>
      </div>

      {/* Master Controls */}
      <div className="controls-section">
        <div className="control-row">
          <span className="control-label">Master Volume</span>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume * 100}
              onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
              className="slider"
            />
            <span className="slider-value">{Math.round(masterVolume * 100)}%</span>
          </div>
        </div>
        <div className="control-toggles">
          <button
            className={`toggle-btn ${spatialEnabled ? 'on' : 'off'}`}
            onClick={() => setSpatialEnabled(!spatialEnabled)}
          >
            {spatialEnabled ? '✓ Spatial 3D' : '○ Spatial 3D'}
          </button>
          <button
            className={`toggle-btn ${ambientEnabled ? 'on' : 'off'}`}
            onClick={() => setAmbientEnabled(!ambientEnabled)}
          >
            {ambientEnabled ? '✓ Ambient' : '○ Ambient'}
          </button>
        </div>
      </div>

      {/* Audio Zones Visualization */}
      <div className="zones-section">
        <h4>Audio Zones</h4>
        <div className="zones-list">
          {audioZones.map((zone) => (
            <div key={zone.id} className="zone-card">
              <div className="zone-info">
                <span className="zone-name">{zone.id.replace(/-/g, ' ')}</span>
                <span className="zone-radius">Radius: {zone.radius}m</span>
              </div>
              <div className="zone-sound">
                <span className="sound-icon">🔊</span>
                <span className="sound-name">{zone.sound}</span>
              </div>
              <div className="zone-status">
                {playerPosition[0] >= zone.position[0] - zone.radius &&
                 playerPosition[0] <= zone.position[0] + zone.radius &&
                 playerPosition[2] >= zone.position[2] - zone.radius &&
                 playerPosition[2] <= zone.position[2] + zone.radius ? (
                  <span className="in-zone">● In Zone</span>
                ) : (
                  <span className="out-zone">○ Nearby</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Sources */}
      <div className="sources-section">
        <h4>Active Audio Sources</h4>
        <div className="sources-list">
          {audioSources.map((source) => {
            const dx = source.position[0] - playerPosition[0];
            const dz = source.position[2] - playerPosition[2];
            const distance = Math.sqrt(dx * dx + dz * dz);
            const volume = spatialEnabled
              ? Math.max(0, 1 - distance / 50) * source.volume * masterVolume
              : source.volume * masterVolume;
            
            return (
              <div key={source.id} className="source-card">
                <div className="source-icon">{source.spatial ? '📍' : '🔊'}</div>
                <div className="source-info">
                  <span className="source-name">{source.id.replace(/-/g, ' ')}</span>
                  <span className="source-distance">
                    {Math.round(distance)}m away
                  </span>
                </div>
                <div className="source-volume">
                  <div className="volume-bar">
                    <div
                      className="volume-fill"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                  <span className="volume-value">{Math.round(volume * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Audio Visualization */}
      <div className="visualization-section">
        <h4>3D Audio Field</h4>
        <div className="audio-visualizer">
          <div className="visualizer-center">
            <span className="player-icon">🦞</span>
            <span className="player-label">You</span>
          </div>
          {audioSources.map((source, i) => {
            const dx = source.position[0] - playerPosition[0];
            const dz = source.position[2] - playerPosition[2];
            const angle = Math.atan2(dz, dx) * (180 / Math.PI);
            const distance = Math.min(Math.sqrt(dx * dx + dz * dz) / 50, 1) * 100;
            
            return (
              <div
                key={source.id}
                className="audio-source-indicator"
                style={{
                  transform: `rotate(${angle + 90}deg) translateY(-${100 - distance}px)`,
                }}
              >
                <span className="source-dot" />
                <span className="source-label">{source.sound.split('_')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sound Library */}
      <div className="library-section">
        <h4>Sound Library</h4>
        <div className="sound-grid">
          {[
            { name: 'Portal Ambient', icon: '🌀', category: 'environment' },
            { name: 'NPC Voice', icon: '🤖', category: 'voice' },
            { name: 'Battle', icon: '⚔️', category: 'combat' },
            { name: 'Engine', icon: '🏎️', category: 'vehicle' },
            { name: 'Victory', icon: '🎉', category: 'ui' },
            { name: 'Ambient Music', icon: '🎵', category: 'music' },
            { name: 'Nature', icon: '🌿', category: 'environment' },
            { name: 'UI Click', icon: '👆', category: 'ui' },
          ].map((sound, i) => (
            <button key={i} className="sound-card">
              <span className="sound-icon">{sound.icon}</span>
              <span className="sound-name">{sound.name}</span>
              <span className="sound-category">{sound.category}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .spatial-audio {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(236, 72, 153, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .audio-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .audio-header .icon {
          font-size: 24px;
        }
        .audio-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
        }
        .badge.active {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        .badge.inactive {
          background: rgba(107, 114, 128, 0.2);
          color: #9ca3af;
        }
        .controls-section {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .control-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .control-label {
          font-size: 14px;
          color: #888;
        }
        .slider-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .slider {
          width: 150px;
          height: 6px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-value {
          font-size: 12px;
          color: #ec4899;
          font-weight: 600;
          min-width: 40px;
        }
        .control-toggles {
          display: flex;
          gap: 12px;
        }
        .toggle-btn {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .toggle-btn.on {
          background: #22c554;
          color: white;
        }
        .toggle-btn.off {
          background: rgba(255, 255, 255, 0.1);
          color: #888;
        }
        .zones-section, .sources-section, .visualization-section, .library-section {
          margin-bottom: 20px;
        }
        .zones-section h4, .sources-section h4, .visualization-section h4, .library-section h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .zones-list, .sources-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .zone-card, .source-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .zone-info, .source-info {
          flex: 1;
        }
        .zone-name, .source-name {
          display: block;
          font-weight: 600;
          font-size: 13px;
          text-transform: capitalize;
        }
        .zone-radius, .source-distance {
          font-size: 11px;
          color: #888;
        }
        .zone-sound, .zone-status {
          text-align: right;
        }
        .sound-icon {
          font-size: 16px;
        }
        .sound-name {
          font-size: 12px;
          color: #888;
          margin-left: 4px;
        }
        .in-zone {
          font-size: 11px;
          color: #4ade80;
        }
        .out-zone {
          font-size: 11px;
          color: #888;
        }
        .source-volume {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .volume-bar {
          width: 60px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .volume-fill {
          height: 100%;
          background: linear-gradient(90deg, #ec4899, #8b5cf6);
          border-radius: 3px;
        }
        .volume-value {
          font-size: 11px;
          color: #ec4899;
          min-width: 30px;
        }
        .visualization-section {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .audio-visualizer {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent);
          border-radius: 50%;
        }
        .visualizer-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .player-icon {
          font-size: 32px;
          display: block;
        }
        .player-label {
          font-size: 10px;
          color: #888;
        }
        .audio-source-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center;
        }
        .source-dot {
          display: block;
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
        }
        .source-label {
          position: absolute;
          left: 15px;
          top: -2px;
          font-size: 10px;
          color: #888;
          white-space: nowrap;
        }
        .sound-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .sound-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sound-card:hover {
          background: rgba(236, 72, 153, 0.1);
          border-color: rgba(236, 72, 153, 0.3);
        }
        .sound-card .sound-icon {
          font-size: 24px;
        }
        .sound-card .sound-name {
          font-size: 11px;
          font-weight: 600;
        }
        .sound-card .sound-category {
          font-size: 9px;
          color: #888;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}

// Ambient audio hook for 3D world
export function useSpatialAudio() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [listener, setListener] = useState<THREE.AudioListener | null>(null);
  const [sounds, setSounds] = useState<Map<string, THREE.PositionalAudio>>(new Map());

  const initializeAudio = () => {
    if (isInitialized) return;

    const audioListener = new THREE.AudioListener();
    setListener(audioListener);
    setIsInitialized(true);
    console.log('3D Audio initialized');
  };

  const playSound = (id: string, url: string, position: [number, number, number]) => {
    if (!isInitialized) return;

    // In a real implementation, this would create and play THREE.PositionalAudio
    console.log(`Playing 3D sound: ${id} at position:`, position);
  };

  const stopSound = (id: string) => {
    console.log(`Stopping sound: ${id}`);
  };

  const setMasterVolume = (volume: number) => {
    if (listener) {
      listener.setMasterVolume(volume);
    }
  };

  return {
    isInitialized,
    initializeAudio,
    playSound,
    stopSound,
    setMasterVolume,
  };
}
