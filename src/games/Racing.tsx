'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Text, OrbitControls, useKeyboardControls, KeyboardControls, PerspectiveCamera, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Racing constants
const TRACK_LENGTH = 200;
const TRACK_WIDTH = 10;
const PLAYER_SPEED = 0.5;
const AI_COUNT = 5;
const CHECKPOINT_COUNT = 10;

// Controls
const CONTROLS = {
  forward: 'forward',
  backward: 'backward',
  left: 'left',
  right: 'right',
  boost: 'boost',
};

// Checkpoint markers
function Checkpoint({ position, index, isActive }: { position: [number, number, number]; index: number; isActive: boolean }) {
  return (
    <group position={position}>
      {/* Checkpoint arch */}
      <mesh position={[0, 3, 0]}>
        <torusGeometry args={[5, 0.3, 8, 32, Math.PI]} />
        <meshStandardMaterial
          color={isActive ? '#22c55e' : '#444'}
          emissive={isActive ? '#22c55e' : '#222'}
          emissiveIntensity={isActive ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Checkpoint number */}
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color={isActive ? '#22c55e' : '#666'}
        anchorX="center"
        anchorY="middle"
      >
        {index + 1}
      </Text>
    </group>
  );
}

// AI Racer
function AIRacer({ 
  position, 
  color, 
  name, 
  speed,
  progress,
  onUpdate 
}: { 
  position: [number, number, number]; 
  color: string; 
  name: string;
  speed: number;
  progress: number;
  onUpdate: (newPos: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    if (!meshRef.current) return;

    // Simple AI: move forward with slight wobble
    const wobble = Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.02;
    targetPos.current.set(
      position[0] + wobble,
      0.5,
      position[2] + speed * 0.1
    );

    meshRef.current.position.lerp(targetPos.current, 0.1);
    meshRef.current.rotation.y = Math.atan2(wobble, 0.1);

    onUpdate([meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]);
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
      <group position={position}>
        {/* Car body */}
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Driver */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Name */}
        <Text position={[0, 1.5, 0]} fontSize={0.3} color={color} anchorX="center">
          {name}
        </Text>
      </group>
    </Float>
  );
}

// Player car
function PlayerCar({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.rotation.y = rotation;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Car body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[[-0.6, -0.3, 0.7], [0.6, -0.3, 0.7], [-0.6, -0.3, -0.7], [0.6, -0.3, -0.7]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}

      {/* Boost effect */}
      <pointLight position={[0, 0.3, 1.2]} color="#06b6d4" intensity={2} distance={5} />
    </group>
  );
}

// Track segments
function Track() {
  const trackSegments = useMemo(() => {
    const segments = [];
    for (let i = 0; i < TRACK_LENGTH; i += 10) {
      segments.push(
        <mesh key={i} position={[0, -0.1, -i]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[TRACK_WIDTH, 10]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      );
    }
    return segments;
  }, []);

  return <>{trackSegments}</>;
}

// Start/Finish line
function StartLine() {
  return (
    <group position={[0, 0.01, 2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_WIDTH, 2]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <Text position={[0, 3, 0]} fontSize={1} color="#22c55e" anchorX="center">
        🏁 START
      </Text>
    </group>
  );
}

// Main racing scene
function RacingScene() {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0.5, 2]);
  const [playerRotation, setPlayerRotation] = useState(0);
  const [playerSpeed, setPlayerSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lap, setLap] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  
  const aiRacers = useRef<{ id: number; pos: [number, number, number]; speed: number; name: string }[]>(
    Array.from({ length: AI_COUNT }, (_, i) => ({
      id: i,
      pos: [(Math.random() - 0.5) * 8, 0.5, 5 + i * 3],
      speed: 0.3 + Math.random() * 0.2,
      name: ['Speedster', 'Turbo', 'Blaze', 'Rocket', 'Flash'][i],
    }))
  );

  const keys = useRef<Set<string>>(new Set());

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

  useFrame((state) => {
    if (gameOver) return;

    // Player movement
    let speed = 0;
    let rotation = playerRotation;

    if (keys.current.has('w') || keys.current.has('arrowup')) speed = PLAYER_SPEED;
    if (keys.current.has('s') || keys.current.has('arrowdown')) speed = -PLAYER_SPEED * 0.5;
    if (keys.current.has('a') || keys.current.has('arrowleft')) rotation += 0.05;
    if (keys.current.has('d') || keys.current.has('arrowright')) rotation -= 0.05;

    // Boost
    if (keys.current.has(' ') && speed > 0) speed *= 1.5;

    // Apply movement
    const newX = playerPos[0] - Math.sin(rotation) * speed;
    const newZ = playerPos[2] - Math.cos(rotation) * speed;

    // Track boundaries
    const clampedX = Math.max(-TRACK_WIDTH / 2 + 0.5, Math.min(TRACK_WIDTH / 2 - 0.5, newX));
    const clampedZ = Math.max(-TRACK_LENGTH, Math.min(2, newZ));

    setPlayerPos([clampedX, 0.5, clampedZ]);
    setPlayerRotation(rotation);
    setPlayerSpeed(speed);

    // Update progress
    const newProgress = Math.max(0, 2 - clampedZ);
    setProgress(newProgress);

    // Update AI racers
    aiRacers.current = aiRacers.current.map(ai => ({
      ...ai,
      pos: [ai.pos[0] + Math.sin(state.clock.elapsedTime + ai.id) * 0.02, 0.5, ai.pos[2] + ai.speed],
    }));

    // Check for finish
    if (newProgress >= TRACK_LENGTH - 5) {
      setGameOver(true);
      setWinner('Player');
    }
  });

  // Check AI wins
  useEffect(() => {
    const maxAiProgress = Math.max(...aiRacers.current.map(ai => ai.pos[2]));
    if (maxAiProgress >= TRACK_LENGTH - 5 && !winner) {
      setGameOver(true);
      setWinner(aiRacers.current.find(ai => ai.pos[2] >= TRACK_LENGTH - 5)?.name || 'AI');
    }
  }, [aiRacers.current, winner]);

  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 50, 200]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 40, 20]} intensity={1} castShadow />
      <hemisphereLight args={['#050508', '#1a1a2e', 0.3]} />

      {/* Environment */}
      <Environment preset="night" />

      {/* Track */}
      <Track />
      <StartLine />

      {/* Player */}
      <PlayerCar position={playerPos} rotation={playerRotation} />

      {/* AI Racers */}
      {aiRacers.current.map(ai => (
        <AIRacer
          key={ai.id}
          position={ai.pos}
          color={['#ef4444', '#f59e0b', '#a855f7', '#ec4899', '#22c55e'][ai.id]}
          name={ai.name}
          speed={ai.speed}
          progress={ai.pos[2]}
          onUpdate={(newPos) => {
            aiRacers.current[ai.id].pos = newPos;
          }}
        />
      ))}

      {/* Checkpoints */}
      {Array.from({ length: CHECKPOINT_COUNT }, (_, i) => (
        <Checkpoint
          key={i}
          position={[0, 0, -20 - i * 20]}
          index={i}
          isActive={progress > i * 20 && progress < (i + 1) * 20}
        />
      ))}

      {/* HUD */}
      <group position={[0, 5, playerPos[2] - 10]}>
        <Text position={[0, 2, 0]} fontSize={0.5} color="white" anchorX="center">
          {`Speed: ${(playerSpeed * 100).toFixed(0)} km/h`}
        </Text>
        <Text position={[0, 1, 0]} fontSize={0.5} color="#06b6d4" anchorX="center">
          {`Lap: ${lap}/3`}
        </Text>
      </group>

      {/* Game Over */}
      {gameOver && (
        <group position={[0, 3, playerPos[2] - 5]}>
          <Text fontSize={2} color={winner === 'Player' ? '#22c55e' : '#ef4444'} anchorX="center">
            {winner === 'Player' ? '🏆 YOU WIN!' : `${winner} WINS!`}
          </Text>
          <Text position={[0, -1, 0]} fontSize={0.8} color="#888" anchorX="center">
            Press R to restart
          </Text>
        </group>
      )}

      {/* Camera follow */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 3} minPolarAngle={Math.PI / 6} />
    </>
  );
}

export default function RacingGame() {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <RacingScene />
    </Canvas>
  );
}
