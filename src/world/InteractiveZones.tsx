// Interactive World Zones for Moltiverse
// Interactive zones, collectibles, and exploration mechanics

'use client';

import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Collectible {
  id: string;
  type: 'coin' | 'gem' | 'star' | 'powerup';
  position: [number, number, number];
  rotation: number;
  collected: boolean;
}

interface Zone {
  id: string;
  name: string;
  type: 'safe' | 'danger' | 'secret' | 'teleport';
  position: [number, number, number];
  radius: number;
  color: string;
  unlocked: boolean;
  description: string;
}

interface InteractiveObject {
  id: string;
  name: string;
  type: 'chest' | 'npc' | 'sign' | 'lever' | 'portal';
  position: [number, number, number];
  interacted: boolean;
  reward?: string;
}

export function InteractiveZones() {
  const [collectibles] = useState<Collectible[]>([
    { id: 'c1', type: 'coin', position: [-15, 1, 15], rotation: 0, collected: false },
    { id: 'c2', type: 'coin', position: [15, 1, 15], rotation: 1, collected: false },
    { id: 'c3', type: 'gem', position: [0, 2, -25], rotation: 0, collected: false },
    { id: 'c4', type: 'star', position: [-30, 3, -30], rotation: 0, collected: false },
    { id: 'c5', type: 'powerup', position: [30, 1, 0], rotation: 0, collected: false },
    { id: 'c6', type: 'coin', position: [0, 1, 40], rotation: 2, collected: false },
    { id: 'c7', type: 'gem', position: [-20, 2, 30], rotation: 1, collected: false },
    { id: 'c8', type: 'star', position: [25, 3, -25], rotation: 0, collected: false },
  ]);

  const [zones] = useState<Zone[]>([
    { id: 'z1', name: 'Central Hub', type: 'safe', position: [0, 0, 0], radius: 15, color: '#22c55e', unlocked: true, description: 'Safe trading zone' },
    { id: 'z2', name: 'Tetris Arena', type: 'safe', position: [-25, 0, -20], radius: 10, color: '#22c55e', unlocked: true, description: 'Block puzzle games' },
    { id: 'z3', name: 'Racing Track', type: 'safe', position: [25, 0, -20], radius: 12, color: '#22c55e', unlocked: false, description: 'High-speed racing' },
    { id: 'z4', name: 'Battle Arena', type: 'danger', position: [0, 0, 30], radius: 15, color: '#ef4444', unlocked: false, description: 'PvP combat zone' },
    { id: 'z5', name: 'Secret Garden', type: 'secret', position: [-40, 0, -40], radius: 8, color: '#a855f7', unlocked: false, description: 'Hidden treasures' },
    { id: 'z6', name: 'Quest Board', type: 'safe', position: [30, 0, 20], radius: 10, color: '#22c55e', unlocked: true, description: 'Daily missions' },
  ]);

  const [interactives] = useState<InteractiveObject[]>([
    { id: 'i1', name: 'Treasure Chest', type: 'chest', position: [-35, 1, 35], interacted: false, reward: '100 $MV' },
    { id: 'i2', name: 'Guide NPC', type: 'npc', position: [0, 1.5, 10], interacted: false },
    { id: 'i3', name: 'World Map', type: 'sign', position: [15, 2, -5], interacted: true },
    { id: 'i4', name: 'Speed Lever', type: 'lever', position: [25, 1, 5], interacted: false },
  ]);

  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [collectedCount, setCollectedCount] = useState(0);

  const collectItem = (id: string) => {
    setCollectedCount(prev => prev + 1);
  };

  return (
    <group>
      {/* Collectibles */}
      {collectibles.map((item) => (
        !item.collected && (
          <CollectibleItem
            key={item.id}
            {...item}
            onCollect={() => collectItem(item.id)}
          />
        )
      ))}

      {/* Zones */}
      {zones.map((zone) => (
        <ZoneMarker
          key={zone.id}
          zone={zone}
          hovered={hoveredZone === zone.id}
          onHover={() => setHoveredZone(zone.id)}
          onUnhover={() => setHoveredZone(null)}
        />
      ))}

      {/* Interactive Objects */}
      {interactives.map((obj) => (
        <InteractiveObjectItem
          key={obj.id}
          {...obj}
        />
      ))}

      {/* Collection counter in world */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#fbbf24"
        anchorX="center"
      >
        {collectedCount}/{collectibles.filter(c => !c.collected).length + collectedCount}
      </Text>
    </group>
  );
}

// Collectible item component
function CollectibleItem({
  id,
  type,
  position,
  rotation,
  onCollect,
}: Collectible & { onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = {
    coin: '#fbbf24',
    gem: '#a855f7',
    star: '#22c55e',
    powerup: '#ef4444',
  }[type];

  const icon = {
    coin: '🪙',
    gem: '💎',
    star: '⭐',
    powerup: '⚡',
  }[type];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation + state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onCollect}
      >
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="#fff"
          anchorX="center"
        >
          {icon} Collect
        </Text>
      )}
      <pointLight color={color} intensity={hovered ? 2 : 0.5} distance={3} />
    </group>
  );
}

// Zone marker component
function ZoneMarker({
  zone,
  hovered,
  onHover,
  onUnhover,
}: {
  zone: Zone;
  hovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={zone.position}>
      {/* Zone ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        <ringGeometry args={[zone.radius - 0.5, zone.radius, 32]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={hovered ? 0.8 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Zone center marker */}
      <mesh position={[0, 0.1, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Zone name */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.6}
        color={zone.color}
        anchorX="center"
      >
        {zone.name}
      </Text>

      {/* Info popup */}
      {hovered && (
        <group position={[0, 5, 0]}>
          <mesh>
            <planeGeometry args={[4, 2]} />
            <meshBasicMaterial color="#1a1a2e" transparent opacity={0.9} />
          </mesh>
          <Text
            position={[0, 0.3, 0.1]}
            fontSize={0.25}
            color="#fff"
            anchorX="center"
          >
            {zone.description}
          </Text>
          <Text
            position={[0, -0.3, 0.1]}
            fontSize={0.2}
            color={zone.unlocked ? '#22c55e' : '#ef4444'}
            anchorX="center"
          >
            {zone.unlocked ? '✓ Unlocked' : '🔒 Locked'}
          </Text>
        </group>
      )}

      {/* Zone light */}
      <pointLight
        color={zone.color}
        intensity={hovered ? 2 : 0.5}
        distance={zone.radius * 2}
      />
    </group>
  );
}

// Interactive object component
function InteractiveObjectItem({
  id,
  name,
  type,
  position,
  interacted,
  reward,
}: InteractiveObject) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const icon = {
    chest: '📦',
    npc: '🤖',
    sign: '🪧',
    lever: '🕹️',
    portal: '🌀',
  }[type];

  useFrame((state) => {
    if (meshRef.current && type === 'lever') {
      meshRef.current.rotation.x = interacted ? -0.5 : 0;
    }
  });

  return (
    <group
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setShowPopup(true)}
    >
      <mesh ref={meshRef}>
        {type === 'chest' && <boxGeometry args={[1, 0.8, 0.8]} />}
        {type === 'npc' && <sphereGeometry args={[0.5, 16, 16]} />}
        {type === 'sign' && <boxGeometry args={[0.1, 2, 1]} />}
        {type === 'lever' && <boxGeometry args={[0.3, 0.3, 1]} />}
        {type === 'portal' && <torusGeometry args={[0.8, 0.2, 16, 32]} />}
        <meshStandardMaterial
          color={interacted ? '#22c55e' : hovered ? '#fbbf24' : '#3b82f6'}
          emissive={interacted ? '#22c55e' : hovered ? '#fbbf24' : '#3b82f6'}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.25}
        color="#fff"
        anchorX="center"
      >
        {icon} {name}
      </Text>

      {/* Interaction indicator */}
      {hovered && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="#22c55e"
          anchorX="center"
        >
          [Click to interact]
        </Text>
      )}

      {/* Popup */}
      {showPopup && (
        <group position={[0, 3, 0]}>
          <mesh>
            <planeGeometry args={[3, 1.5]} />
            <meshBasicMaterial color="#1a1a2e" transparent opacity={0.95} />
          </mesh>
          <Text
            position={[0, 0.4, 0.1]}
            fontSize={0.25}
            color="#fff"
            anchorX="center"
          >
            {name}
          </Text>
          <Text
            position={[0, -0.1, 0.1]}
            fontSize={0.18}
            color="#888"
            anchorX="center"
          >
            {type === 'chest' && `Contains: ${reward}`}
            {type === 'npc' && 'Ask me about Moltiverse!'}
            {type === 'sign' && 'World Map Station'}
            {type === 'lever' && `${interacted ? 'Active' : 'Inactive'}`}
            {type === 'portal' && 'Teleport Hub'}
          </Text>
          <Text
            position={[0, -0.5, 0.1]}
            fontSize={0.15}
            color="#888"
            anchorX="center"
          >
            [Click to close]
          </Text>
        </group>
      )}
    </group>
  );
}

// World exploration stats
export function ExplorationStats() {
  const [stats] = useState({
    zonesDiscovered: 3,
    totalZones: 6,
    collectiblesFound: 5,
    totalCollectibles: 8,
    secretsFound: 0,
    totalSecrets: 2,
  });

  return (
    <div className="exploration-stats">
      <h4>Exploration</h4>
      
      <div className="stat-row">
        <span>🗺️ Zones</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(stats.zonesDiscovered / stats.totalZones) * 100}%` }}
          />
        </div>
        <span>{stats.zonesDiscovered}/{stats.totalZones}</span>
      </div>

      <div className="stat-row">
        <span>💎 Collectibles</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(stats.collectiblesFound / stats.totalCollectibles) * 100}%` }}
          />
        </div>
        <span>{stats.collectiblesFound}/{stats.totalCollectibles}</span>
      </div>

      <div className="stat-row">
        <span>🔐 Secrets</span>
        <div className="progress-bar">
          <div
            className="progress-fill secret"
            style={{ width: `${(stats.secretsFound / stats.totalSecrets) * 100}%` }}
          />
        </div>
        <span>{stats.secretsFound}/{stats.totalSecrets}</span>
      </div>

      <style jsx>{`
        .exploration-stats {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        .exploration-stats h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .stat-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .stat-row span {
          min-width: 100px;
          font-size: 13px;
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
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 4px;
          transition: width 0.3s;
        }
        .progress-fill.secret {
          background: linear-gradient(90deg, #a855f7, #ec4899);
        }
        .stat-row span:last-child {
          min-width: 50px;
          text-align: right;
          font-size: 12px;
          color: #888;
        }
      `}</style>
    </div>
  );
}
