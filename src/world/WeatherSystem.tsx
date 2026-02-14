// Weather System for Moltiverse
// Dynamic weather with rain, snow, and atmospheric effects

'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeatherProps {
  type?: 'clear' | 'rain' | 'snow' | 'storm';
  intensity?: number;
  position?: [number, number, number];
}

interface ParticleProps {
  intensity?: number;
  position?: [number, number, number];
}

interface FogProps {
  density?: number;
}

// Rain particles
function RainParticles({ intensity = 1, position = [0, 50, 0] }: ParticleProps) {
  const count = 2000 * intensity;
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = -1.5 - Math.random() * 0.5;
      velocities[i * 3 + 2] = 0;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      particles.velocities[i * 3 + 1] = -1.5 - Math.random() * 0.3;
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      
      // Reset when hits ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 50;
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
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
        color="#4fc3f7"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Snow particles
function SnowParticles({ intensity = 1, position = [0, 50, 0] }: ParticleProps) {
  const count = 1500 * intensity;
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const drifts = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -0.1 - Math.random() * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      drifts[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, velocities, drifts };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const drift = Math.sin(time * 0.5 + particles.drifts[i]) * 0.02;
      
      positions[i * 3] += particles.velocities[i * 3] + drift;
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
      
      // Reset when hits ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 40;
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
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
        color="#ffffff"
        size={0.15}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Storm with lightning
function StormEffect({ intensity = 1, position = [0, 80, 0] }: ParticleProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const [lightning, setLightning] = useState(false);
  
  useFrame(() => {
    if (Math.random() < 0.005 * intensity) {
      setLightning(true);
      if (lightRef.current) {
        lightRef.current.intensity = 3;
      }
      setTimeout(() => {
        setLightning(false);
        if (lightRef.current) {
          lightRef.current.intensity = 0.3;
        }
      }, 100 + Math.random() * 200);
    }
  });

  return (
    <group>
      <pointLight
        ref={lightRef}
        position={position}
        color="#6b5bff"
        intensity={0.3}
        distance={200}
      />
      <RainParticles intensity={intensity * 1.5} position={position} />
    </group>
  );
}

// Fog overlay for rainy/stormy weather
function FogOverlay({ density = 0.005 }: { density: number }) {
  return (
    <fog attach="fog" args={['#1a1a2e', 20, 100]} />
  );
}

// Lightning bolt effect
function LightningEffect() {
  const boltRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);
  
  useFrame(() => {
    if (!visible && Math.random() < 0.01) {
      setVisible(true);
      setTimeout(() => setVisible(false), 100 + Math.random() * 150);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={boltRef} position={[0, 50, -50]}>
      <cylinderGeometry args={[0.5, 2, 60, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </mesh>
  );
}

// Cloud layer
export function CloudLayer() {
  const clouds = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 200,
        40 + Math.random() * 20,
        (Math.random() - 0.5) * 200,
      ] as [number, number, number],
      scale: 20 + Math.random() * 30,
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position} scale={[cloud.scale, cloud.scale * 0.4, cloud.scale]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#4a5568"
            transparent
            opacity={0.8}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Weather UI control
export function WeatherControl() {
  const [weather, setWeather] = useState<'clear' | 'rain' | 'snow' | 'storm'>('clear');
  const [intensity, setIntensity] = useState(1);

  return (
    <div className="weather-control">
      <h4>Weather</h4>
      <div className="weather-buttons">
        {(['clear', 'rain', 'snow', 'storm'] as const).map((w) => (
          <button
            key={w}
            className={`weather-btn ${weather === w ? 'active' : ''}`}
            onClick={() => setWeather(w)}
          >
            {w === 'clear' && '☀️'}
            {w === 'rain' && '🌧️'}
            {w === 'snow' && '❄️'}
            {w === 'storm' && '⛈️'}
          </button>
        ))}
      </div>
      {weather !== 'clear' && (
        <div className="intensity-slider">
          <label>Intensity</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
          <span>{Math.round(intensity * 100)}%</span>
        </div>
      )}

      <style jsx>{`
        .weather-control {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        .weather-control h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #888;
        }
        .weather-buttons {
          display: flex;
          gap: 8px;
        }
        .weather-btn {
          flex: 1;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .weather-btn:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .weather-btn.active {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }
        .intensity-slider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
        }
        .intensity-slider label {
          font-size: 12px;
          color: #888;
        }
        .intensity-slider input {
          flex: 1;
          accent-color: #8b5cf6;
        }
        .intensity-slider span {
          font-size: 12px;
          color: #8b5cf6;
          min-width: 40px;
        }
      `}</style>
    </div>
  );
}
