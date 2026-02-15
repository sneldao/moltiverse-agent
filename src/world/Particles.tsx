// Immersive Particle Effects for Moltiverse
// Ambient particles, sparkles, and environmental effects

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  type?: 'ambient' | 'sparkle' | 'dust' | 'fireflies' | 'aurora';
  position?: [number, number, number];
  spread?: number;
}

export function AmbientParticles({
  count = 200,
  color = '#a855f7',
  speed = 0.1,
  size = 0.05,
  position = [0, 0, 0],
  spread = 50,
}: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.01 + 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      sizes[i] = Math.random() * size + size * 0.5;
    }
    
    return { positions, velocities, sizes };
  }, [count, size, spread]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      // Update position with velocity
      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1] + Math.sin(time + i) * 0.002;
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
      
      // Reset particles that go too high
      if (positions[i * 3 + 1] > 20) {
        positions[i * 3 + 1] = 0;
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      
      // Gentle wave motion
      positions[i * 3] += Math.sin(time * 0.5 + i * 0.1) * 0.01;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Sparkle particles for special effects
export function SparkleParticles({
  count = 50,
  color = '#fbbf24',
  position = [0, 5, 0],
}: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 2 + 1;
    }
    
    return { positions, phases, speeds };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      // Upward floating with sparkle
      positions[i * 3 + 1] += particles.speeds[i] * 0.02;
      positions[i * 3] += Math.sin(time * 2 + particles.phases[i]) * 0.01;
      
      // Reset when too high
      if (positions[i * 3 + 1] > 10) {
        positions[i * 3 + 1] = 0;
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.15}
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Fireflies for ambient night effect
export function Fireflies({
  count = 30,
  position = [0, 0, 0],
}: ParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const fireflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        Math.random() * 5 + 1,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
      radius: Math.random() * 3 + 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    fireflies.forEach((firefly, i) => {
      const mesh = groupRef.current?.children[i] as THREE.Mesh;
      if (!mesh) return;
      
      // Circular movement
      const angle = time * firefly.speed + firefly.offset;
      mesh.position.x = firefly.position[0] + Math.cos(angle) * firefly.radius * 0.3;
      mesh.position.y = firefly.position[1] + Math.sin(angle * 2) * 0.5;
      mesh.position.z = firefly.position[2] + Math.sin(angle) * firefly.radius * 0.3;
      
      // Pulsing glow
      const scale = 1 + Math.sin(time * 3 + firefly.offset) * 0.5;
      mesh.scale.setScalar(scale * 0.15);
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {fireflies.map((firefly, i) => (
        <mesh key={i} position={firefly.position}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
          <pointLight color="#fbbf24" intensity={0.3} distance={3} />
        </mesh>
      ))}
    </group>
  );
}

// Portal particles
export function PortalParticles({
  position = [0, 0, 0],
  color = '#06b6d4',
}: {
  position?: [number, number, number];
  color?: string;
}) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    const angles = new Float32Array(100);
    const radii = new Float32Array(100);
    const speeds = new Float32Array(100);
    
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      angles[i] = angle;
      radii[i] = Math.random() * 2 + 1;
      speeds[i] = Math.random() * 0.5 + 0.5;
      
      positions[i * 3] = Math.cos(angle) * radii[i];
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = Math.sin(angle) * radii[i];
    }
    
    return { positions, angles, radii, speeds };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < 100; i++) {
      // Spiral inward motion
      const angle = particles.angles[i] + time * particles.speeds[i];
      const radius = particles.radii[i] * (1 - (time * 0.2 % 1) * 0.5);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(time * 2 + i) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.08}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Victory/celebration particles
export function CelebrationParticles({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    const velocities = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 5;
      positions[i * 3 + 2] = 0;
      
      // Explosion velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * 0.5 + 0.2;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed + 0.3;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }
    
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < 500; i++) {
      // Apply gravity
      particles.velocities[i * 3 + 1] -= 0.01;
      
      // Update position
      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
      
      // Floor collision
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 0;
        particles.velocities[i * 3 + 1] *= -0.5;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Rain effect
export function RainParticles({
  count = 250,  // Optimized: reduced from 1000 for 60+ FPS
  position = [0, 20, 0],
}: {
  count?: number;
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = -0.5 - Math.random() * 0.3;
      velocities[i * 3 + 2] = 0;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Fall down
      particles.velocities[i * 3 + 1] = -0.5 - Math.random() * 0.3;
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      
      // Reset when hits ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 40;
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#06b6d4"
        size={0.05}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
