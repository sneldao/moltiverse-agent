// Post-Processing Effects for Moltiverse 3D World
// Bloom, color grading, and visual enhancements

'use client';

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useRef, useState, useEffect, ReactElement } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector2 } from 'three';

interface PostProcessingProps {
  bloom?: boolean;
  chromaticAberration?: boolean;
  vignette?: boolean;
  noise?: boolean;
  intensity?: number;
}

export function WorldPostProcessing({
  bloom = true,
  chromaticAberration = true,
  vignette = true,
  noise = false,
  intensity = 1,
}: PostProcessingProps) {
  const effects: ReactElement[] = [];
  
  if (bloom) {
    effects.push(<Bloom
      key="bloom"
      intensity={intensity * 1.5}
      kernelSize={KernelSize.LARGE}
      luminanceThreshold={0.2}
      luminanceSmoothing={0.9}
      mipmapBlur
    />);
  }
  
  if (chromaticAberration) {
    effects.push(<ChromaticAberration
      key="ca"
      blendFunction={BlendFunction.NORMAL}
      offset={new Vector2(0.002 * intensity, 0.002 * intensity)}
    />);
  }
  
  if (vignette) {
    effects.push(<Vignette
      key="vignette"
      offset={0.3}
      darkness={0.6}
    />);
  }
  
  if (noise) {
    effects.push(<Noise
      key="noise"
      premultiply
      blendFunction={BlendFunction.OVERLAY}
      opacity={0.05}
    />);
  }
  
  return (
    <EffectComposer>
      {effects}
    </EffectComposer>
  );
}

// Interactive bloom that responds to player position
export function DynamicBloom({ intensity = 1 }: { intensity?: number }) {
  const [glowIntensity, setGlowIntensity] = useState(1);
  
  useEffect(() => {
    // Pulse the glow intensity
    const interval = setInterval(() => {
      setGlowIntensity(1 + Math.sin(Date.now() / 1000) * 0.2);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <EffectComposer>
      <Bloom
        intensity={intensity * glowIntensity}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

// Dramatic effect for special moments
export function DramaticEffect({ active = false }: { active?: boolean }) {
  return (
    <EffectComposer>
      <Bloom
        intensity={active ? 3 : 1}
        kernelSize={active ? KernelSize.VERY_LARGE : KernelSize.LARGE}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={active ? new Vector2(0.005, 0.005) : new Vector2(0.001, 0.001)}
      />
      <Vignette
        offset={active ? 0.4 : 0.3}
        darkness={active ? 0.8 : 0.6}
      />
    </EffectComposer>
  );
}

// Night vision effect
export function NightVision({ active = false }: { active?: boolean }) {
  return (
    <EffectComposer>
      <Bloom
        intensity={active ? 2 : 1}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={active ? 0.5 : 0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={active ? new Vector2(0.003, 0.003) : new Vector2(0.001, 0.001)}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.OVERLAY}
        opacity={active ? 0.15 : 0.02}
      />
    </EffectComposer>
  );
}
