'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { AvatarType, AvatarColor, AVATAR_COLORS } from './avatar';

// Avatar 3D models
export function AvatarModel({
  type,
  color,
  position,
  isPlayer = false,
}: {
  type: AvatarType;
  color: AvatarColor;
  position: [number, number, number];
  isPlayer?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const primaryColor = AVATAR_COLORS[color];

  return (
    <group ref={groupRef} position={position}>
      {/* Each avatar type has a different body structure */}
      {type === 'human' && (
        <>
          {/* Body */}
          <mesh castShadow>
            <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={isPlayer ? 0.5 : 0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
          </mesh>
          {/* Direction indicator for player */}
          {isPlayer && (
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.08, 0.15, 8]} />
              <meshStandardMaterial color="#ffffff" emissive={primaryColor} emissiveIntensity={0.5} />
            </mesh>
          )}
        </>
      )}

      {type === 'robot' && (
        <>
          {/* Body block */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.7, 0.5]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={isPlayer ? 0.6 : 0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Eyes */}
          {[[-0.1, 0.6, 0.2], [0.1, 0.6, 0.2]].map((pos, i) => (
            <mesh key={`eye-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} />
            </mesh>
          ))}
          {/* Antenna */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
          </mesh>
        </>
      )}

      {type === 'crystal' && (
        <>
          {/* Crystal body - octahedron */}
          <mesh castShadow>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={isPlayer ? 0.7 : 0.5}
              metalness={0.3}
              roughness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Inner glow */}
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Floating shards */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos(i * 2.09) * 0.6,
                Math.sin(i * 2.09) * 0.3,
                Math.sin(i * 2.09) * 0.6,
              ]}
              rotation={[i, i, i]}
            >
              <tetrahedronGeometry args={[0.1]} />
              <meshStandardMaterial
                color={primaryColor}
                emissive={primaryColor}
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </>
      )}

      {type === 'spirit' && (
        <>
          {/* Spirit body - sphere with particles */}
          <mesh castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={isPlayer ? 0.8 : 0.6}
              metalness={0.1}
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Halo ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
            <torusGeometry args={[0.5, 0.05, 8, 32]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Glow effect */}
          <pointLight color={primaryColor} intensity={isPlayer ? 3 : 1.5} distance={5} />
        </>
      )}

      {/* Player marker */}
      {isPlayer && (
        <pointLight color={primaryColor} intensity={2} distance={8} position={[0, 0.5, 0]} />
      )}
    </group>
  );
}
