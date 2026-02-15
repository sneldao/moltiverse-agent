'use client';

import { useState, useEffect } from 'react';
import World3D from '@/world/World3D';
import { AvatarSelection } from '@/components/AvatarSelection';
import { AvatarConfig, DEFAULT_AVATAR } from '@/world/avatar';
import { GameType } from '@/games/types';
import { useWalletState, connectWallet } from '@/hooks/useWallet';

// Token Utility imports
import { TokenProvider } from '@/games/TokenContext';
import { PlayToEarnHUD } from '@/games/PlayToEarnHUD';
import { StakingPanel } from '@/games/StakingPanel';
import { Leaderboard } from '@/games/Leaderboard';
import { TokenEconomy } from '@/games/TokenEconomy';
import { QuestSystem } from '@/games/QuestSystem';

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

// Token balance display
function TokenBalance({ balance }: { balance: bigint }) {
  const formattedBalance = Number(balance) / 1e18;
  return (
    <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
        <span className="text-sm">💎</span>
      </div>
      <div>
        <p className="text-xs text-gray-400">$MV Balance</p>
        <p className="text-lg font-mono text-white">{formattedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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

// Mini-map showing nearby agents
function MiniMap() {
  const agents = [
    { name: 'DeFi', x: -25, z: -20, c: '#22c55e' },
    { name: 'Quest', x: 25, z: -20, c: '#f59e0b' },
    { name: 'Trader', x: 0, z: 30, c: '#a855f7' },
    { name: 'Arena', x: -30, z: 10, c: '#ef4444' },
  ];
  return (
    <div className="absolute top-20 left-4 glass px-3 py-2 rounded-xl pointer-events-none">
      <p className="text-[10px] text-gray-400 mb-2">Map</p>
      <div className="relative w-20 h-20 rounded-full bg-black/50 overflow-hidden border border-gray-600">
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
        {agents.map((a, i) => (
          <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.c, left: `${50 + a.x * 1.2}%`, top: `${50 + a.z * 1.2}%`, transform: 'translate(-50%, -50%)' }} />
        ))}
      </div>
    </div>
  );
}

// Inner App component that uses TokenProvider
function MoltiverseApp() {
  const [mounted, setMounted] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);
  const [worldEnabled, setWorldEnabled] = useState(true);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [tokenBalance, setTokenBalance] = useState(BigInt(0));
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);
  
  // Token Utility Panel States
  const [showP2E, setShowP2E] = useState(false);
  const [showStaking, setShowStaking] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTokenEconomy, setShowTokenEconomy] = useState(false);
  
  const { isConnected, address } = useWalletState();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address && tokenAddress) {
      loadTokenBalance();
    }
  }, [isConnected, address, tokenAddress]);

  async function loadTokenBalance() {
    // Token balance is now managed by TokenProvider
    // This is a placeholder for future real contract integration
    if (!tokenAddress || !address) return;
    try {
      // const balance = await getTokenBalance(tokenAddress, address);
      // setTokenBalance(balance);
    } catch (error) {
      console.error('Error loading token balance:', error);
    }
  }

  const handleAvatarComplete = (selected: AvatarConfig) => {
    setAvatar(selected);
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

  if (!avatar) {
    return <AvatarSelection onComplete={handleAvatarComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Quest System - Always visible */}
      <QuestSystem />

      {/* Token Utility Modals */}
      {showP2E && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowP2E(false)}>
          <div className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <PlayToEarnHUD />
          </div>
        </div>
      )}
      {showStaking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowStaking(false)}>
          <div className="max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <StakingPanel />
          </div>
        </div>
      )}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowLeaderboard(false)}>
          <div className="max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <Leaderboard />
          </div>
        </div>
      )}
      {showTokenEconomy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowTokenEconomy(false)}>
          <div className="max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <TokenEconomy />
          </div>
        </div>
      )}

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
              {/* Token Utility Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowP2E(true); setShowStaking(false); setShowLeaderboard(false); setShowTokenEconomy(false); }}
                  className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors flex items-center gap-1"
                >
                  <span>🎮</span> P2E
                </button>
                <button
                  onClick={() => { setShowStaking(true); setShowP2E(false); setShowLeaderboard(false); setShowTokenEconomy(false); }}
                  className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors flex items-center gap-1"
                >
                  <span>🔒</span> Stake
                </button>
                <button
                  onClick={() => { setShowLeaderboard(true); setShowP2E(false); setShowStaking(false); setShowTokenEconomy(false); }}
                  className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition-colors flex items-center gap-1"
                >
                  <span>🏆</span> Rankings
                </button>
                <button
                  onClick={() => { setShowTokenEconomy(true); setShowP2E(false); setShowStaking(false); setShowLeaderboard(false); }}
                  className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center gap-1"
                >
                  <span>📈</span> Trade
                </button>
              </div>
              <TokenBalance balance={tokenBalance} />
              {/* Player XP & Level */}
              <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-xl">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase">Level</p>
                  <p className="text-sm font-bold text-yellow-400">🔥 12</p>
                </div>
                <div className="w-px h-6 bg-gray-600" />
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase">XP</p>
                  <p className="text-sm font-bold text-cyan-400">⭐ 4,850</p>
                </div>
                <div className="w-px h-6 bg-gray-600" />
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase">Rank</p>
                  <p className="text-sm font-bold text-purple-400">#247</p>
                </div>
              </div>
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
            setTokenBalance(prev => prev + BigInt(points));
            setShowMessage({ type: 'success', text: `+${points} $MV earned!` });
            setTimeout(() => setShowMessage(null), 2000);
          }}
        />

        {/* Control Hints */}
        {!activeGame && <ControlHints />}
        {!activeGame && <MiniMap />}

        {/* Game Selector Floating Button */}
        {!activeGame && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <button
                onClick={() => setActiveGame('tetris')}
                className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors"
              >
                🧱 Tetris
              </button>
              <button
                onClick={() => setActiveGame('racing')}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
              >
                🏎 Racing
              </button>
              <button
                onClick={() => setActiveGame('battle')}
                className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/30 transition-colors"
              >
                ⚔️ Battle
              </button>
            </div>
          </div>
        )}

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
            <div className="flex items-center gap-6">
              <p>Explore • Chat Agents • Play Games • Earn $MV</p>
              <div className="flex items-center gap-2">
                <span className="text-green-400">●</span>
                <span>1,247 Agents Online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">●</span>
                <span>89 Active Players</span>
              </div>
            </div>
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

// Export default wrapped in TokenProvider
export default function Home() {
  return (
    <TokenProvider>
      <MoltiverseApp />
    </TokenProvider>
  );
}
