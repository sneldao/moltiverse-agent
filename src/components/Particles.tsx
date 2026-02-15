// Particle Effects - Enhanced visual feedback

'use client';

// Performance: RAF may conflict with Three.js - consider disabling during 3D rendering

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'confetti' | 'sparkle' | 'fire' | 'star';
}

interface ParticleSystemProps {
  type: 'confetti' | 'sparkle' | 'fire' | 'star';
  trigger: boolean;
  x?: number;
  y?: number;
  count?: number;
  onComplete?: () => void;
}

export function ParticleSystem({ 
  type, 
  trigger, 
  x = 50, 
  y = 50, 
  count = 50,
  onComplete 
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
    }
  }, [trigger]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();

    const colors = {
      confetti: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'],
      sparkle: ['#ffd700', '#fff', '#ffaa00', '#ffe4b5'],
      fire: ['#ff4500', '#ff6600', '#ff8800', '#ffaa00', '#ffcc00'],
      star: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    };

    // Initialize particles
    particles.current = [];
    for (let i = 0; i < count; i++) {
      particles.current.push({
        id: i,
        x: (x / 100) * canvas.width,
        y: (y / 100) * canvas.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.5,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: 3 + Math.random() * 5,
        type,
      });
    }

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= delta / p.maxLife;
        p.size *= 0.98;

        if (p.life > 0) {
          alive++;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          
          if (p.type === 'star') {
            drawStar(ctx, p.x, p.y, p.size);
          } else if (p.type === 'fire') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
          }
        }
      });

      if (alive > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        setIsActive(false);
        onComplete?.();
      }
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, type, x, y, count, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

// Celebration effects
export function Celebration({ show }: { show: boolean }) {
  return (
    <div className="celebration">
      <ParticleSystem type="confetti" trigger={show} count={100} />
      <ParticleSystem type="star" trigger={show} x={20} y={30} count={30} />
      <ParticleSystem type="star" trigger={show} x={80} y={30} count={30} />
      <style jsx>{`
        .celebration {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}

// Level up effect
export function LevelUpEffect({ level, show }: { level: number; show: boolean }) {
  return (
    <div className={`level-up ${show ? 'active' : ''}`}>
      {show && (
        <>
          <div className="level-text">LEVEL {level}</div>
          <ParticleSystem type="star" trigger={show} count={50} />
        </>
      )}
      <style jsx>{`
        .level-up {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .level-up.active {
          opacity: 1;
        }
        .level-text {
          font-size: 72px;
          font-weight: 900;
          background: linear-gradient(135deg, #ffd700, #ffaa00, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: levelPop 1s ease-out;
        }
        @keyframes levelPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Achievement unlock effect
export function AchievementEffect({ achievement, show }: { achievement: string; show: boolean }) {
  return (
    <div className={`achievement ${show ? 'show' : ''}`}>
      <div className="achievement-card">
        <span className="icon">🏆</span>
        <div className="text">
          <span className="label">Achievement Unlocked!</span>
          <span className="name">{achievement}</span>
        </div>
      </div>
      <style jsx>{`
        .achievement {
          position: fixed;
          top: 20px;
          right: -300px;
          transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 9999;
        }
        .achievement.show {
          right: 20px;
        }
        .achievement-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2));
          border: 2px solid #ffd700;
          border-radius: 16px;
        }
        .icon {
          font-size: 40px;
        }
        .text {
          display: flex;
          flex-direction: column;
        }
        .label {
          font-size: 12px;
          color: #ffd700;
          text-transform: uppercase;
        }
        .name {
          font-size: 18px;
          font-weight: 700;
          color: white;
        }
      `}</style>
    </div>
  );
}
