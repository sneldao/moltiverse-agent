'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars } from '@react-three/drei';

// Lazy load 3D components
const WorldScene = lazy(() => import('./WorldScene'));
const TetrisGame = lazy(() => import('../games/Tetris'));
const RacingGame = lazy(() => import('../games/Racing'));

// Loading fallback
function Loader() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#06b6d4" wireframe />
      </mesh>
    </group>
  );
}

// Props
interface World3DProps {
  enabled: boolean;
  gameType?: string | null;
  onScore?: (points: number) => void;
}

export default function World3D({ enabled, gameType, onScore }: World3DProps) {
  if (!enabled) return null;

  // Get game-specific camera settings
  const getCameraSettings = () => {
    switch (gameType) {
      case 'racing':
        return { position: [0, 8, 15] as [number, number, number], fov: 75 };
      case 'tetris':
        return { position: [0, 15, 25] as [number, number, number], fov: 50 };
      default:
        return { position: [0, 30, 30] as [number, number, number], fov: 50 };
    }
  };

  const cameraSettings = getCameraSettings();

  // Get game-specific controls hint
  const getControlsHint = () => {
    switch (gameType) {
      case 'tetris':
        return '←→ Move | ↑ Rotate | ↓ Soft | Space Hard';
      case 'racing':
        return 'W/↑ Accelerate | S/↓ Brake | A/← Left | D/→ Right | Space Boost';
      default:
        return 'WASD + Space';
    }
  };

  // Get game-specific environment
  const getEnvironmentSettings = () => {
    switch (gameType) {
      case 'racing':
        return { stars: 10000, fog: [20, 100] as [number, number], ambient: 0.5 };
      default:
        return { stars: 5000, fog: [40, 100] as [number, number], ambient: 0.3 };
    }
  };

  const envSettings = getEnvironmentSettings();

  return (
    <div className="relative w-full h-[calc(100vh-64px)] rounded-2xl overflow-hidden border border-gray-800/50">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={cameraSettings.position} fov={cameraSettings.fov} />
        
        {/* Environment */}
        <color attach="background" args={['#050508']} />
        <Stars radius={100} depth={50} count={envSettings.stars} factor={4} fade speed={gameType === 'racing' ? 0.5 : 1} />
        <Environment preset="night" />
        <fog attach="fog" args={['#050508', ...envSettings.fog]} />

        {/* Content */}
        <Suspense fallback={<Loader />}>
          {gameType === 'tetris' ? (
            <TetrisGame />
          ) : gameType === 'racing' ? (
            <RacingGame />
          ) : (
            <WorldScene />
          )}
        </Suspense>

        {/* Lighting */}
        <ambientLight intensity={envSettings.ambient} />
        <directionalLight
          position={[20, 40, 20]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        {gameType === 'racing' && (
          <hemisphereLight args={['#050508', '#1a1a2e', 0.5]} />
        )}
      </Canvas>

      {/* HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="glass px-4 py-2 rounded-lg">
          <p className="text-xs text-gray-400">{getControlsHint()}</p>
        </div>
        {gameType && (
          <div className="glass px-4 py-2 rounded-lg">
            <p className="text-xs text-cyan-400">Playing: {gameType.charAt(0).toUpperCase() + gameType.slice(1)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
