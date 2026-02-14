// Dynamic Sky and Environment for Moltiverse
// Dynamic skybox, stars, aurora borealis, and environmental effects

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkyProps {
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  aurora?: boolean;
  stars?: boolean;
}

export function DynamicSky({
  timeOfDay = 'night',
  aurora = true,
  stars = true,
}: SkyProps) {
  const skyRef = useRef<THREE.Mesh>(null);
  const auroraRef = useRef<THREE.Group>(null);
  
  // Color schemes for different times of day
  const colors = useMemo(() => ({
    dawn: {
      top: '#1a1a3e',
      bottom: '#ff7b54',
      horizon: '#ffb47a',
    },
    day: {
      top: '#4a90d9',
      bottom: '#87ceeb',
      horizon: '#b0e0e6',
    },
    dusk: {
      top: '#0f0c29',
      bottom: '#ff6b6b',
      horizon: '#ffd93d',
    },
    night: {
      top: '#0a0a1a',
      bottom: '#1a1a2e',
      horizon: '#16213e',
    },
  }), []);
  
  const currentColors = colors[timeOfDay];
  
  useFrame((state) => {
    if (skyRef.current) {
      // Subtle sky color shift based on time
      const time = state.clock.elapsedTime;
      const mesh = skyRef.current as THREE.Mesh;
      const material = mesh.material as THREE.ShaderMaterial;
      
      // Gentle color animation
      if (material.uniforms) {
        material.uniforms.uTime.value = time;
      }
    }
    
    if (auroraRef.current) {
      // Aurora animation
      const time = state.clock.elapsedTime;
      auroraRef.current.children.forEach((child, i) => {
        child.position.x = Math.sin(time * 0.3 + i * 0.5) * 20;
        child.scale.x = 1 + Math.sin(time * 0.5 + i) * 0.2;
      });
    }
  });

  return (
    <>
      {/* Sky dome */}
      <mesh ref={skyRef} scale={[500, 500, 500]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          uniforms={{
            uTopColor: { value: new THREE.Color(currentColors.top) },
            uBottomColor: { value: new THREE.Color(currentColors.bottom) },
            uHorizonColor: { value: new THREE.Color(currentColors.horizon) },
            uTime: { value: 0 },
          }}
          vertexShader={`
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uTopColor;
            uniform vec3 uBottomColor;
            uniform vec3 uHorizonColor;
            uniform float uTime;
            varying vec3 vWorldPosition;
            
            void main() {
              vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
              float elevation = viewDirection.y;
              
              float horizonBlend = smoothstep(-0.1, 0.1, elevation);
              float topBlend = 1.0 - horizonBlend;
              
              vec3 skyColor = mix(uHorizonColor, uTopColor, topBlend);
              skyColor = mix(skyColor, uBottomColor, 1.0 - horizonBlend);
              
              // Add subtle twinkling
              float noise = fract(sin(dot(vWorldPosition.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
              skyColor += noise * 0.02;
              
              gl_FragColor = vec4(skyColor, 1.0);
            }
          `}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Stars */}
      {stars && timeOfDay === 'night' && <Stars />}
      
      {/* Aurora Borealis */}
      {aurora && timeOfDay === 'night' && <AuroraBorealis />}
      
      {/* Clouds */}
      {timeOfDay !== 'night' && <Clouds />}
    </>
  );
}

// Star field
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starData = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkle = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = 400 * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 400 * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = 400 * Math.cos(phi);
      
      sizes[i] = Math.random() * 2 + 0.5;
      twinkle[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, sizes, twinkle };
  }, []);
  
  useFrame((state) => {
    if (starsRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const sizes = starsRef.current.geometry.attributes.size.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < 2000; i++) {
        // Gentle twinkle
        sizes[i] = starData.sizes[i] * (0.8 + Math.sin(time * 2 + starData.twinkle[i]) * 0.2);
      }
      
      starsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={starData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={2000}
          array={starData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Aurora Borealis effect
function AuroraBorealis() {
  const groupRef = useRef<THREE.Group>(null);
  
  const auroraData = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [0, 30 + i * 5, -100 + i * 15] as [number, number, number],
      scale: [30 + i * 10, 10, 5] as [number, number, number],
      color: i % 2 === 0 ? '#22c55e' : '#a855f7',
      speed: 0.5 + i * 0.1,
      offset: i * Math.PI * 0.4,
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        const material = child as THREE.Mesh;
        if (material.material instanceof THREE.ShaderMaterial) {
          material.material.uniforms.uTime.value = time * auroraData[i].speed + auroraData[i].offset;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {auroraData.map((data, i) => (
        <mesh key={i} position={data.position} scale={data.scale} rotation={[Math.PI / 6, 0, 0]}>
          <planeGeometry args={[1, 1, 64, 16]} />
          <shaderMaterial
            uniforms={{
              uTime: { value: 0 },
              uColor: { value: new THREE.Color(data.color) },
            }}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform float uTime;
              uniform vec3 uColor;
              varying vec2 vUv;
              
              void main() {
                float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
                float falloff = smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
                float alpha = wave * falloff * 0.6;
                
                gl_FragColor = vec4(uColor, alpha);
              }
            `}
            transparent
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Simple clouds
function Clouds() {
  const groupRef = useRef<THREE.Group>(null);
  
  const clouds = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 300,
        50 + Math.random() * 30,
        (Math.random() - 0.5) * 300,
      ] as [number, number, number],
      scale: 20 + Math.random() * 30,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position} scale={[cloud.scale, cloud.scale * 0.4, cloud.scale]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Moon
export function Moon({ phase = 0.5 }: { phase?: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group position={[100, 80, -100]}>
      <mesh ref={moonRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshStandardMaterial
          color="#f5f5dc"
          emissive="#f5f5dc"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Moon glow */}
      <pointLight color="#f5f5dc" intensity={2} distance={200} />
    </group>
  );
}

// Sun for day time
export function Sun() {
  return (
    <group position={[100, 100, 50]}>
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      {/* Sun glow */}
      <pointLight color="#ffd700" intensity={3} distance={300} />
    </group>
  );
}
