'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Environment, 
  Float, 
  MeshReflectorMaterial,
  PerspectiveCamera,
} from '@react-three/drei';
import { AvatarModel } from './AvatarModel';
import { AvatarConfig, getAvatarStats, DEFAULT_AVATAR } from './avatar';
import { GameType } from '@/games/types';

// World constants
const WORLD_SIZE = 100;
const GROUND_SIZE = 120;

// Portal at a game location
function GamePortal({ 
  position, 
  color, 
  gameType, 
  label,
  isUnlocked,
  tokenRequired,
  onEnter 
}: { 
  position: [number, number, number];
  color: string;
  gameType: GameType;
  label: string;
  isUnlocked: boolean;
  tokenRequired?: number;
  onEnter: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -time * 0.5;
      innerRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    }
    if (hovered && meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Outer spinning ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color={isUnlocked ? color : '#333'}
          emissive={isUnlocked ? color : '#111'}
          emissiveIntensity={hovered ? 1 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Portal surface */}
      <mesh 
        ref={meshRef}
        rotation={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={isUnlocked ? onEnter : undefined}
      >
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial 
          color={isUnlocked ? color : '#1a1a1a'}
          transparent 
          opacity={0.7}
          side={THREE.DoubleSide}
          emissive={isUnlocked ? color : '#000'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Inner decorative spiral */}
      <mesh ref={innerRef}>
        <circleGeometry args={[1.5, 3]} />
        <meshStandardMaterial 
          color={isUnlocked ? color : '#333'}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color={isUnlocked ? '#fff' : '#666'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Token requirement */}
      {!isUnlocked && tokenRequired && (
        <Text
          position={[0, -3.5, 0]}
          fontSize={0.35}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          {tokenRequired} $MV Required
        </Text>
      )}

      {/* Lock indicator */}
      {!isUnlocked && (
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[1, 1.4, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      )}

      {/* Glow effect */}
      <pointLight 
        color={isUnlocked ? color : '#333'} 
        intensity={hovered ? 4 : 2} 
        distance={12} 
      />
    </group>
  );
}

// Token gate/barrier
function TokenGate({ 
  position, 
  width = 6,
  tokenRequired = 100,
  isUnlocked,
  onUnlock 
}: { 
  position: [number, number, number];
  width?: number;
  tokenRequired?: number;
  isUnlocked: boolean;
  onUnlock: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {!isUnlocked && (
        <>
          {/* Gate posts */}
          {[-width/2, width/2].map((x, i) => (
            <group key={`post-${i}`} position={[x, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Glow on top */}
              <pointLight color="#f59e0b" intensity={1} distance={3} position={[0, 1.8, 0]} />
            </group>
          ))}

          {/* Energy barrier */}
          <mesh 
            position={[0, 1.2, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onUnlock}
          >
            <planeGeometry args={[width, 2.2]} />
            <meshStandardMaterial 
              color="#f59e0b"
              transparent
              opacity={hovered ? 0.4 : 0.7}
              emissive="#f59e0b"
              emissiveIntensity={hovered ? 1 : 0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Token requirement text */}
          <Text
            position={[0, 1.2, 0.2]}
            fontSize={0.4}
            color="#fff"
            anchorX="center"
            anchorY="middle"
          >
            🔒 {tokenRequired} $MV
          </Text>
        </>
      )}
    </group>
  );
}

// Floating agent NPC with chat interaction
function AgentNPC({ 
  position, 
  color, 
  name, 
  specialty,
  onInteract 
}: { 
  position: [number, number, number];
  color: string;
  name: string;
  specialty: string;
  onInteract?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.08;
      // Subtle rotation
      groupRef.current.rotation.y += 0.003;
    }
  });

  const handleClick = () => {
    setShowChat(true);
    setTimeout(() => setShowChat(false), 3000);
    onInteract?.();
  };

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
      <group 
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Agent body */}
        <mesh castShadow>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Agent ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.03, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>

        {/* Name tag */}
        {(hovered || showChat) && (
          <Text
            position={[0, 1.1, 0]}
            fontSize={0.25}
            color="#fff"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        )}

        {/* Specialty badge */}
        <Text position={[0, -0.9, 0]} fontSize={0.14} color={color}>
          {specialty}
        </Text>

        {/* Interaction hint */}
        {hovered && (
          <Text
            position={[0, 1.4, 0]}
            fontSize={0.18}
            color="#22c55e"
            anchorX="center"
            anchorY="middle"
          >
            [Click to chat]
          </Text>
        )}

        {/* Chat bubble */}
        {showChat && (
          <group position={[0, 2, 0]}>
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#1a1a2e" transparent opacity={0.9} />
            </mesh>
            <Text
              position={[0, 0, 0.35]}
              fontSize={0.16}
              color="#fff"
              anchorX="center"
              anchorY="middle"
            >
              "Hello! Ask me about {specialty}!"
            </Text>
          </group>
        )}

        {/* Glow */}
        <pointLight color={color} intensity={hovered ? 2 : 0.8} distance={6} />
      </group>
    </Float>
  );
}

// Player avatar
function PlayerAvatar({ 
  avatar,
  onMove 
}: { 
  avatar: AvatarConfig;
  onMove?: (pos: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0.5, 0]);
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const isGrounded = useRef(true);
  const keys = useRef<Set<string>>(new Set());

  const stats = getAvatarStats(avatar);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'e') {
        // Interaction key
        window.dispatchEvent(new CustomEvent('moltiverse:interact', { detail: { position } }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const limit = WORLD_SIZE / 2 - 3;
    const newPos = [...position] as [number, number, number];

    // Movement
    if (keys.current.has('w') || keys.current.has('arrowup')) {
      newPos[2] = Math.max(-limit, newPos[2] - stats.speed);
    }
    if (keys.current.has('s') || keys.current.has('arrowdown')) {
      newPos[2] = Math.min(limit, newPos[2] + stats.speed);
    }
    if (keys.current.has('a') || keys.current.has('arrowleft')) {
      newPos[0] = Math.max(-limit, newPos[0] - stats.speed);
    }
    if (keys.current.has('d') || keys.current.has('arrowright')) {
      newPos[0] = Math.min(limit, newPos[0] + stats.speed);
    }

    // Jump
    if (keys.current.has(' ') && isGrounded.current) {
      velocity.current[1] = stats.jumpForce;
      isGrounded.current = false;
    }

    // Apply gravity
    velocity.current[1] -= 0.015;
    newPos[1] += velocity.current[1];

    // Ground collision
    if (newPos[1] <= 0.5) {
      newPos[1] = 0.5;
      velocity.current[1] = 0;
      isGrounded.current = true;
    }

    setPosition(newPos);
    meshRef.current.position.set(...newPos);
    onMove?.(newPos);
  });

  return (
    <group ref={meshRef}>
      <AvatarModel type={avatar.type} color={avatar.color} position={[0, 0, 0]} isPlayer={true} />
    </group>
  );
}

// Ground plane with reflective surface
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE, 128, 128]} />
      <MeshReflectorMaterial
        mirror={0.25}
        blur={[400, 400]}
        resolution={1024}
        mixBlur={1}
        mixStrength={25}
        depthScale={1}
        minDepthThreshold={0.85}
        color="#050508"
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

// Grid overlay
function GridLines() {
  const lines = useMemo(() => {
    const result: JSX.Element[] = [];
    const step = 5;
    const halfSize = GROUND_SIZE / 2;
    for (let i = -halfSize; i <= halfSize; i += step) {
      // Horizontal lines
      result.push(
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-halfSize, 0.01, i, halfSize, 0.01, i])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1a1a2e" transparent opacity={0.25} />
        </line>
      );
      // Vertical lines
      result.push(
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i, 0.01, -halfSize, i, 0.01, halfSize])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1a1a2e" transparent opacity={0.25} />
        </line>
      );
    }
    return result;
  }, []);

  return <>{lines}</>;
}

// Zone boundaries
function ZoneBoundaries() {
  return (
    <>
      {/* Central hub zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0, 20, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Path markers */}
      {[
        [0, 20, 'cyan'],
        [0, -20, 'purple'],
        [20, 0, 'green'],
        [-20, 0, 'orange'],
      ].map(([x, z, color], i) => (
        <group key={`path-${i}`} position={[x as number, 0.01, z as number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2, 4, 32]} />
            <meshBasicMaterial color={color as string} transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Decorative elements - monoliths and structures
function Decorations() {
  const monolithPositions: [number, number, number][] = [
    [-35, 0, -35], [35, 0, -35], [-35, 0, 35], [35, 0, 35],
    [-40, 0, 0], [40, 0, 0], [0, 0, -40], [0, 0, 40],
  ];

  return (
    <>
      {/* Corner monoliths */}
      {monolithPositions.map((pos, i) => (
        <group key={`monolith-${i}`} position={pos}>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[1, 8, 1]} />
            <meshStandardMaterial 
              color="#1a1a2e" 
              metalness={0.6} 
              roughness={0.4 
              } />
          </mesh>
          {/* Glowing top */}
          <mesh position={[0, 8.3, 0]}>
            <coneGeometry args={[0.3, 0.6, 4]} />
            <meshStandardMaterial 
              color="#06b6d4" 
              emissive="#06b6d4" 
              emissiveIntensity={0.8} 
            />
          </mesh>
          <pointLight color="#06b6d4" intensity={1.5} distance={8} position={[0, 8, 0]} />
        </group>
      ))}

      {/* Floating crystals scattered around */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 25 + Math.random() * 15;
        return (
          <Float key={`crystal-${i}`} speed={1 + Math.random()} rotationIntensity={0.2}>
            <group
              position={[
                Math.cos(angle) * radius,
                1 + Math.random() * 2,
                Math.sin(angle) * radius,
              ]}
            >
              <mesh castShadow>
                <octahedronGeometry args={[0.3 + Math.random() * 0.4, 0]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? '#a855f7' : '#22c55e'}
                  emissive={i % 2 === 0 ? '#a855f7' : '#22c55e'}
                  emissiveIntensity={0.6}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <pointLight 
                color={i % 2 === 0 ? '#a855f7' : '#22c55e'} 
                intensity={0.5} 
                distance={3} 
              />
            </group>
          </Float>
        );
      })}
    </>
  );
}

// Main world scene
export default function WorldScene({
  avatar = DEFAULT_AVATAR,
  onEnterGame,
  onUnlockZone,
}: {
  avatar?: AvatarConfig;
  onEnterGame?: (gameType: GameType) => void;
  onUnlockZone?: (zoneId: string, cost: number) => void;
}) {
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0.5, 0]);

  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 50, 120]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[30, 50, 30]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <hemisphereLight args={['#050508', '#1a1a2e', 0.4]} />

      {/* Environment */}
      <Environment preset="night" />

      {/* World */}
      <Ground />
      <GridLines />
      <ZoneBoundaries />
      <Decorations />

      {/* Player */}
      <PlayerAvatar avatar={avatar} onMove={setPlayerPosition} />

      {/* Central hub - Token exchange */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2, 0]}>
          <dodecahedronGeometry args={[2]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text position={[0, 4.5, 0]} fontSize={0.6} color="#f59e0b" anchorX="center">
          $MV Exchange Hub
        </Text>
        <pointLight color="#f59e0b" intensity={3} distance={15} />
      </group>

      {/* Game portals */}
      <GamePortal
        position={[-25, 0, -20]}
        color="#22c55e"
        gameType="tetris"
        label="Tetris Arena"
        isUnlocked={true}
        onEnter={() => onEnterGame?.('tetris')}
      />
      <GamePortal
        position={[25, 0, -20]}
        color="#f59e0b"
        gameType="racing"
        label="Racing Track"
        isUnlocked={false}
        tokenRequired={50}
        onEnter={() => onEnterGame?.('racing')}
      />
      <GamePortal
        position={[0, 0, 30]}
        color="#a855f7"
        gameType="battle"
        label="Battle Arena"
        isUnlocked={false}
        tokenRequired={100}
        onEnter={() => onEnterGame?.('battle')}
      />
      <GamePortal
        position={[30, 0, 20]}
        color="#ec4899"
        gameType="quest"
        label="Quest Board"
        isUnlocked={true}
        onEnter={() => onEnterGame?.('quest')}
      />

      {/* Token gate to premium zone */}
      <TokenGate
        position={[0, 0, -35]}
        width={10}
        tokenRequired={200}
        isUnlocked={false}
        onUnlock={() => onUnlockZone?.('premium', 200)}
      />

      {/* Agent NPCs scattered around */}
      <AgentNPC
        position={[-15, 1.5, 15]}
        color="#22c55e"
        name="DeFi Agent"
        specialty="DeFi Trading"
      />
      <AgentNPC
        position={[15, 1.5, 15]}
        color="#a855f7"
        name="Gaming Bot"
        specialty="Game Strategy"
      />
      <AgentNPC
        position={[0, 1.5, -15]}
        color="#f59e0b"
        name="Social AI"
        specialty="Community"
      />
      <AgentNPC
        position={[-8, 1.5, 8]}
        color="#06b6d4"
        name="Researcher"
        specialty="Data Analysis"
      />
      <AgentNPC
        position={[12, 1.5, -8]}
        color="#ec4899"
        name="Creator"
        specialty="NFT Art"
      />
      <AgentNPC
        position={[-20, 1.5, -10]}
        color="#ef4444"
        name="Trader"
        specialty="Token Swaps"
      />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={60}
        target={playerPosition}
      />
    </>
  );
}
