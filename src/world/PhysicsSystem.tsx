// Physics and Interactions System for Moltiverse
// Collision detection, gravity, and interactive physics

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PhysicsObject {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  mass: number;
  friction: number;
  restitution: number;
  type: 'static' | 'dynamic' | 'kinematic';
  collider: 'box' | 'sphere' | 'capsule';
  size: [number, number, number];
}

interface JumpPad {
  id: string;
  position: [number, number, number];
  strength: number;
  radius: number;
}

interface MovingPlatform {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  speed: number;
  offset: number;
}

export function PhysicsSystem() {
  const [physicsObjects] = useState<PhysicsObject[]>([
    { id: 'ground', position: [0, -0.5, 0], velocity: [0, 0, 0], mass: 0, friction: 0.8, restitution: 0.3, type: 'static', collider: 'box', size: [120, 1, 120] },
    { id: 'platform-1', position: [-10, 2, 10], velocity: [0, 0, 0], mass: 0, friction: 0.6, restitution: 0.2, type: 'static', collider: 'box', size: [6, 0.5, 6] },
    { id: 'platform-2', position: [10, 4, 10], velocity: [0, 0, 0], mass: 0, friction: 0.6, restitution: 0.2, type: 'static', collider: 'box', size: [6, 0.5, 6] },
    { id: 'platform-3', position: [0, 6, 20], velocity: [0, 0, 0], mass: 0, friction: 0.6, restitution: 0.2, type: 'static', collider: 'box', size: [8, 0.5, 8] },
  ]);

  const [jumpPads] = useState<JumpPad[]>([
    { id: 'jump-1', position: [-15, 0.5, -15], strength: 15, radius: 3 },
    { id: 'jump-2', position: [15, 0.5, -15], strength: 20, radius: 3 },
    { id: 'jump-3', position: [0, 0.5, -25], strength: 25, radius: 4 },
  ]);

  const [movingPlatforms] = useState<MovingPlatform[]>([
    { id: 'elevator-1', start: [-30, 2, 0], end: [-30, 15, 0], speed: 2, offset: 0 },
    { id: 'platform-moving', start: [30, 3, 30], end: [30, 8, 30], speed: 1.5, offset: 0 },
  ]);

  const playerRef = useRef<THREE.Group>(null);
  const playerVelocity = useRef<[number, number, number]>([0, 0, 0]);
  const isGrounded = useRef(true);
  const keys = useRef<Set<string>>(new Set());

  // Initialize physics
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Physics update loop
  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const GRAVITY = -30;
    const MOVE_SPEED = 10;
    const JUMP_FORCE = 12;
    const AIR_CONTROL = 0.3;

    // Get current position
    const pos = playerRef.current.position;
    
    // Apply movement
    let moveX = 0;
    let moveZ = 0;

    if (keys.current.has('w') || keys.current.has('arrowup')) moveZ = -1;
    if (keys.current.has('s') || keys.current.has('arrowdown')) moveZ = 1;
    if (keys.current.has('a') || keys.current.has('arrowleft')) moveX = -1;
    if (keys.current.has('d') || keys.current.has('arrowright')) moveX = 1;

    // Apply gravity
    if (!isGrounded.current) {
      playerVelocity.current[1] += GRAVITY * delta;
    }

    // Apply movement
    const controlFactor = isGrounded.current ? 1 : AIR_CONTROL;
    playerVelocity.current[0] = moveX * MOVE_SPEED * controlFactor;
    playerVelocity.current[2] = moveZ * MOVE_SPEED * controlFactor;

    // Jump
    if (keys.current.has(' ') && isGrounded.current) {
      playerVelocity.current[1] = JUMP_FORCE;
      isGrounded.current = false;
    }

    // Update position
    pos.x += playerVelocity.current[0] * delta;
    pos.y += playerVelocity.current[1] * delta;
    pos.z += playerVelocity.current[2] * delta;

    // Ground collision
    if (pos.y <= 1) {
      pos.y = 1;
      playerVelocity.current[1] = 0;
      isGrounded.current = true;
    }

    // Platform collision
    physicsObjects.forEach((obj) => {
      if (obj.type !== 'static') return;

      const halfSize = obj.size[0] / 2;
      const platformHeight = obj.size[1] / 2;

      if (
        pos.x >= obj.position[0] - halfSize &&
        pos.x <= obj.position[0] + halfSize &&
        pos.z >= obj.position[2] - halfSize &&
        pos.z <= obj.position[2] + halfSize
      ) {
        if (pos.y >= obj.position[1] + platformHeight && pos.y <= obj.position[1] + platformHeight + 1) {
          pos.y = obj.position[1] + platformHeight;
          playerVelocity.current[1] = 0;
          isGrounded.current = true;
        }
      }
    });

    // Jump pad detection
    jumpPads.forEach((pad) => {
      const dx = pos.x - pad.position[0];
      const dz = pos.z - pad.position[2];
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < pad.radius && isGrounded.current) {
        playerVelocity.current[1] = pad.strength;
        isGrounded.current = false;
      }
    });

    // Update moving platforms
    movingPlatforms.forEach((platform) => {
      const time = state.clock.elapsedTime;
      const t = ((time * platform.speed + platform.offset) % (Math.PI * 2)) / (Math.PI * 2);
      const newY = platform.start[1] + (platform.end[1] - platform.start[1]) * t;

      platform.start[1] = newY;

      // Check if player is on platform
      const dx = pos.x - platform.start[0];
      const dz = pos.z - platform.start[2];
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 4 && pos.y <= platform.start[1] + 1.5) {
        pos.y = platform.start[1] + 1;
        isGrounded.current = true;
      }
    });

    // Apply to player mesh
    playerRef.current.position.set(pos.x, pos.y, pos.z);
  });

  return (
    <group>
      {/* Physics-enabled platforms */}
      {physicsObjects.map((obj) => (
        obj.type === 'static' && (
          <PhysicsPlatform key={obj.id} {...obj} />
        )
      ))}

      {/* Jump pads */}
      {jumpPads.map((pad) => (
        <JumpPadComponent key={pad.id} {...pad} />
      ))}

      {/* Moving platforms */}
      {movingPlatforms.map((platform) => (
        <MovingPlatformComponent key={platform.id} {...platform} />
      ))}

      {/* Player with physics */}
      <group ref={playerRef} position={[0, 1, 0]}>
        <PlayerMesh />
      </group>
    </group>
  );
}

function PhysicsPlatform({ position, size, collider }: PhysicsObject) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function JumpPadComponent({ position, strength, radius }: JumpPad) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[radius, radius, 0.3, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
      </mesh>

      {/* Glowing ring */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.5, radius, 32]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
      </mesh>

      {/* Arrow indicator */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>

      {/* Glow effect */}
      <pointLight color="#22c55e" intensity={1} distance={5} />
    </group>
  );
}

function MovingPlatformComponent({ start, end, speed }: MovingPlatform) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = ((state.clock.elapsedTime * speed) % (Math.PI * 2)) / (Math.PI * 2);
      meshRef.current.position.y = start[1] + (end[1] - start[1]) * t;
    }
  });

  return (
    <group ref={meshRef} position={start}>
      <mesh>
        <boxGeometry args={[4, 0.5, 4]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
      <pointLight color="#f59e0b" intensity={0.5} distance={5} />
    </group>
  );
}

function PlayerMesh() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slight bobbing animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color="#22c55e" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Glow */}
      <pointLight color="#22c55e" intensity={1} distance={3} />
    </group>
  );
}

// Physics stats UI
export function PhysicsStats() {
  const [stats] = useState({
    velocity: { x: 0, y: 0, z: 0 },
    grounded: true,
    jumpCount: 0,
    platformsLanded: 5,
    distanceTraveled: 234.5,
  });

  return (
    <div className="physics-stats">
      <h4>Physics</h4>
      
      <div className="stat-row">
        <span>Velocity</span>
        <div className="velocity-indicator">
          <div className="velocity-bar x" style={{ width: `${Math.abs(stats.velocity.x) * 5}%` }} />
          <div className="velocity-bar y" style={{ width: `${Math.abs(stats.velocity.y) * 5}%` }} />
          <div className="velocity-bar z" style={{ width: `${Math.abs(stats.velocity.z) * 5}%` }} />
        </div>
      </div>

      <div className="stat-row">
        <span>Grounded</span>
        <span className={stats.grounded ? 'status-on' : 'status-off'}>
          {stats.grounded ? '● Yes' : '○ No'}
        </span>
      </div>

      <div className="stat-row">
        <span>Jumps</span>
        <span>{stats.jumpCount}</span>
      </div>

      <div className="stat-row">
        <span>Platforms</span>
        <span>{stats.platformsLanded}</span>
      </div>

      <div className="stat-row">
        <span>Distance</span>
        <span>{stats.distanceTraveled}m</span>
      </div>

      <style jsx>{`
        .physics-stats {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        .physics-stats h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .velocity-indicator {
          display: flex;
          gap: 4px;
        }
        .velocity-bar {
          width: 30px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .velocity-bar.x { background: #ef4444; }
        .velocity-bar.y { background: #22c55e; }
        .velocity-bar.z { background: #3b82f6; }
        .status-on { color: #22c55e; }
        .status-off { color: #888; }
      `}</style>
    </div>
  );
}

// Interaction system
export function InteractionSystem() {
  const [interactions, setInteractions] = useState([
    { type: 'jump', label: 'Space', active: false },
    { type: 'dash', label: 'Shift', active: false },
    { type: 'interact', label: 'E', active: false },
  ]);

  return (
    <div className="interaction-system">
      <h4>Controls</h4>
      <div className="controls-grid">
        {interactions.map((control) => (
          <div key={control.type} className={`control-item ${control.active ? 'active' : ''}`}>
            <span className="control-key">{control.label}</span>
            <span className="control-type">{control.type}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .interaction-system {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        .interaction-system h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .controls-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .control-item {
          text-align: center;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        .control-item.active {
          background: rgba(34, 197, 94, 0.2);
        }
        .control-key {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 4px;
        }
        .control-type {
          font-size: 11px;
          color: #888;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}
