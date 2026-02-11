'use client';

import { useState, useEffect } from 'react';
import World3D from '@/world/World3D';
import { AvatarSelection } from '@/components/AvatarSelection';
import { AvatarConfig, DEFAULT_AVATAR } from '@/world/avatar';
import { GameType } from '@/games/types';

// Components
function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'cyan' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' }) {
  const colors = {
    gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass card p-6 ${className}`}>
      {children}
    </div>
  );
}

// Token balance display
function TokenBalance({ balance }: { balance: number }) {
  return (
    <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
        <span className="text-sm">💎</span>
      </div>
      <div>
        <p className="text-xs text-gray-400">$MV Balance</p>
        <p className="text-lg font-mono text-white">{balance.toLocaleString()}</p>
      </div>
    </div>
  );
}

// Control hint overlay
function ControlHints() {
  return (
    <div className="absolute top-20 right-4 glass px-4 py-3 rounded-xl pointer-events-none">
      <p className="text-xs text-gray-400 mb-2">Controls</p>
      <div className="space-y-1 text-xs text-gray-300">
        <p><kbd className="px-1.5 py-0.5 bg-gray-700 rounded">W</kbd> <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">A</kbd> <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">S</kbd> <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">D</kbd> Move</p>
        <p><kbd className="px-1.5 py-0.5 bg-gray-700 rounded">Space</kbd> Jump</p>
        <p><kbd className="px-1.5 py-0.5 bg-gray-700 rounded">E</kbd> Interact</p>
      </div>
    </div>
  );
}

// Main App
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);
  const [worldEnabled, setWorldEnabled] = useState(true);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle avatar selection completion
  const handleAvatarComplete = (selectedAvatar: AvatarConfig) => {
    setAvatar(selectedAvatar);
    setWorldEnabled(true);
    // Welcome bonus
    setTokenBalance(50);
    setShowMessage({ type: 'success', text: `Welcome to Moltiverse, ${selectedAvatar.name}! +50 $MV bonus 🎉` });
    setTimeout(() => setShowMessage(null), 5000);
  };

  // Handle entering a game
  const handleEnterGame = (gameType: GameType) => {
    setActiveGame(gameType);
    setShowMessage({ type: 'success', text: `Entering ${gameType}...` });
    setTimeout(() => setShowMessage(null), 2000);
  };

  // Handle zone unlock
  const handleUnlockZone = (zoneId: string, cost: number) => {
    if (tokenBalance >= cost) {
      setTokenBalance(tokenBalance - cost);
      setShowMessage({ type: 'success', text: `Zone ${zoneId} unlocked! -${cost} $MV` });
      setTimeout(() => setShowMessage(null), 3000);
    } else {
      setShowMessage({ type: 'error', text: `Not enough $MV! Need ${cost} $MV` });
      setTimeout(() => setShowMessage(null), 3000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 animate-pulse flex items-center justify-center mx-auto">
              <span className="text-3xl">🌌</span>
            </div>
          </div>
          <p className="text-gray-400 text-lg">Loading Moltiverse...</p>
        </div>
      </div>
    );
  }

  // Avatar selection screen
  if (!avatar) {
    return <AvatarSelection onComplete={handleAvatarComplete} />;
  }

  // Main world view
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Toast Messages */}
      {showMessage && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl glass ${
          showMessage.type === 'success' ? 'border-green-500/30' : 'border-red-500/30'
        }`}>
          {showMessage.text}
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-xl">🌌</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Moltiverse</h1>
                <p className="text-xs text-gray-500">Avatar World</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <TokenBalance balance={tokenBalance} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Playing as:</span>
                <Badge color="cyan">{avatar.name}</Badge>
              </div>
              <button
                onClick={() => setAvatar(null)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Change Avatar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main 3D World */}
      <main className="relative z-10 pt-20">
        <World3D
          enabled={worldEnabled}
          gameType={activeGame}
          onScore={(points) => {
            setTokenBalance(tokenBalance + points);
            setShowMessage({ type: 'success', text: `+${points} $MV earned!` });
            setTimeout(() => setShowMessage(null), 2000);
          }}
        />

        {/* Control Hints */}
        {!activeGame && <ControlHints />}

        {/* Game overlay when playing */}
        {activeGame && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <button
              onClick={() => setActiveGame(null)}
              className="glass px-4 py-2 rounded-xl text-sm text-cyan-400 hover:text-cyan-300 pointer-events-auto transition-colors"
            >
              ← Back to World
            </button>
            <div className="glass px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-400">Playing</p>
              <p className="text-sm font-semibold text-white capitalize">{activeGame}</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-gray-800/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>Explore the world • Talk to agents • Unlock games • Earn tokens</p>
            <div className="flex items-center gap-3">
              <Badge color="cyan">ERC-8004</Badge>
              <Badge color="purple">Monad</Badge>
              <Badge color="green">Nad.fun</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
