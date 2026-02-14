// Immersive 3D World Manager for Moltiverse
// Ties together all 3D elements into a cohesive experience

'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import WorldScene from './WorldScene';
import { DynamicSky, Moon } from './DynamicSky';
import { AmbientParticles, SparkleParticles, PortalParticles, Fireflies } from './Particles';
import { WorldPostProcessing } from './PostProcessing';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

interface ImmersiveWorldProps {
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weather?: 'clear' | 'rain' | 'stars';
  showPostProcessing?: boolean;
}

export default function ImmersiveWorld({
  timeOfDay = 'night',
  weather = 'clear',
  showPostProcessing = true,
}: ImmersiveWorldProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0.5, 0]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="immersive-world">
      {/* Loading screen */}
      {!isLoaded && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner">🌌</div>
            <div className="loading-text">Entering Moltiverse...</div>
          </div>
        </div>
      )}

      {/* 3D World Canvas */}
      <Canvas
        camera={{ position: [0, 15, 40], fov: 60 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: 1, // ACESFilmic
          toneMappingExposure: 1.2,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050508');
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={timeOfDay === 'night' ? 0.2 : 0.5} />
        <directionalLight
          position={timeOfDay === 'day' ? [50, 100, 50] : [30, 50, 30]}
          intensity={timeOfDay === 'day' ? 1.5 : 0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        {timeOfDay === 'night' && (
          <>
            <pointLight position={[0, 10, 0]} intensity={0.5} color="#06b6d4" />
            <pointLight position={[-20, 10, -20]} intensity={0.3} color="#a855f7" />
            <pointLight position={[20, 10, -20]} intensity={0.3} color="#22c55e" />
          </>
        )}

        {/* Sky and Environment */}
        <DynamicSky timeOfDay={timeOfDay} aurora={timeOfDay === 'night'} stars={weather === 'stars' || timeOfDay === 'night'} />
        {timeOfDay === 'night' && <Moon />}

        {/* Main World Scene */}
        <WorldScene />

        {/* Ambient Particles */}
        {timeOfDay === 'night' && (
          <>
            <AmbientParticles count={300} color="#a855f7" spread={100} />
            <AmbientParticles count={100} color="#06b6d4" spread={80} position={[0, 5, 0]} />
            <SparkleParticles position={[playerPosition[0], playerPosition[1] + 3, playerPosition[2]]} />
            <Fireflies position={[0, 0, 0]} count={20} />
          </>
        )}

        {/* Portal Particles */}
        <PortalParticles position={[-25, 2, -20]} color="#22c55e" />
        <PortalParticles position={[25, 2, -20]} color="#f59e0b" />
        <PortalParticles position={[0, 2, 30]} color="#a855f7" />

        {/* Post Processing */}
        {showPostProcessing && (
          <EffectComposer>
            <Bloom
              intensity={1.2}
              kernelSize={KernelSize.LARGE}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>

      {/* World Info HUD */}
      <div className="world-hud">
        <div className="hud-top-left">
          <div className="time-display">
            <span className="time-icon">🌙</span>
            <span className="time-text">{timeOfDay.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="hud-top-right">
          <div className="coordinates">
            <span>X: {playerPosition[0].toFixed(1)}</span>
            <span>Y: {playerPosition[1].toFixed(1)}</span>
            <span>Z: {playerPosition[2].toFixed(1)}</span>
          </div>
        </div>
        
        <div className="hud-bottom-left">
          <div className="fps-counter">
            <span className="fps-label">FPS</span>
            <span className="fps-value">60</span>
          </div>
        </div>
        
        <div className="hud-bottom-right">
          <div className="world-status">
            <span className="status-dot online" />
            <span>Online: 247</span>
          </div>
        </div>
      </div>

      {/* Movement Guide */}
      <div className="movement-guide">
        <div className="guide-item">
          <span className="key">W</span>
          <span>Forward</span>
        </div>
        <div className="guide-item">
          <span className="key">A</span>
          <span>Left</span>
        </div>
        <div className="guide-item">
          <span className="key">S</span>
          <span>Back</span>
        </div>
        <div className="guide-item">
          <span className="key">D</span>
          <span>Right</span>
        </div>
        <div className="guide-item">
          <span className="key">Space</span>
          <span>Jump</span>
        </div>
        <div className="guide-item">
          <span className="key">E</span>
          <span>Interact</span>
        </div>
      </div>

      {/* Minimap */}
      <div className="minimap">
        <div className="minimap-header">MOLTIVERSE</div>
        <div className="minimap-content">
          <div className="minimap-player" style={{
            left: `${50 + playerPosition[0] * 0.5}%`,
            top: `${50 + playerPosition[2] * 0.5}%`,
          }} />
          <div className="minimap-marker" style={{ left: '35%', top: '30%' }}>🎮</div>
          <div className="minimap-marker" style={{ left: '65%', top: '30%' }}>🏎️</div>
          <div className="minimap-marker" style={{ left: '50%', top: '75%' }}>⚔️</div>
          <div className="minimap-marker" style={{ left: '80%', top: '60%' }}>📋</div>
        </div>
      </div>

      <style jsx>{`
        .immersive-world {
          width: 100%;
          height: 100vh;
          position: relative;
          background: #050508;
          overflow: hidden;
        }
        .loading-screen {
          position: absolute;
          inset: 0;
          background: #050508;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .loading-content {
          text-align: center;
        }
        .loading-spinner {
          font-size: 64px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loading-text {
          margin-top: 16px;
          font-size: 18px;
          color: #8b5cf6;
        }
        .world-hud {
          position: absolute;
          inset: 0;
          pointer-events: none;
          padding: 20px;
        }
        .hud-top-left, .hud-bottom-left {
          position: absolute;
          left: 20px;
        }
        .hud-top-left { top: 20px; }
        .hud-bottom-left { bottom: 20px; }
        .hud-top-right, .hud-bottom-right {
          position: absolute;
          right: 20px;
        }
        .hud-top-right { top: 20px; }
        .hud-bottom-right { bottom: 20px; }
        .time-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        .time-icon {
          font-size: 20px;
        }
        .time-text {
          font-size: 12px;
          font-weight: 700;
          color: #a78bfa;
          letter-spacing: 1px;
        }
        .coordinates {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          font-family: monospace;
          font-size: 11px;
          color: #06b6d4;
        }
        .fps-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
        }
        .fps-label {
          font-size: 10px;
          color: #888;
        }
        .fps-value {
          font-size: 16px;
          font-weight: 700;
          color: #22c55e;
        }
        .world-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          font-size: 12px;
          color: #888;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.online {
          background: #22c55e;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .movement-guide {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          padding: 12px 20px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        .guide-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .key {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(139, 92, 246, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.5);
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #a78bfa;
        }
        .guide-item span:last-child {
          font-size: 10px;
          color: #888;
        }
        .minimap {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        .minimap-header {
          padding: 8px;
          background: rgba(139, 92, 246, 0.2);
          font-size: 10px;
          font-weight: 700;
          color: #a78bfa;
          text-align: center;
          letter-spacing: 1px;
        }
        .minimap-content {
          position: relative;
          height: 120px;
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
        }
        .minimap-player {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px #22c55e;
        }
        .minimap-marker {
          position: absolute;
          font-size: 12px;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}
