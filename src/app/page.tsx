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

// Sound Controls Component
function SoundControls() {
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  
  return (
    <div className="absolute top-20 right-4 glass px-3 py-2 rounded-xl flex gap-2 mt-2">
      <button
        onClick={() => setMuted(!muted)}
        className={`p-2 rounded-lg transition-colors ${muted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button
        onClick={() => setMusicOn(!musicOn)}
        className={`p-2 rounded-lg transition-colors ${musicOn ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-600/20 text-gray-500'}`}
        title={musicOn ? 'Music On' : 'Music Off'}
      >
        🎵
      </button>
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

// Achievement Popup Component
function AchievementPopup() {
  const [achievement, setAchievement] = useState<{title: string; desc: string; icon: string} | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setAchievement({ title: 'First Steps', desc: 'Explore the world', icon: '👣' }), 5000);
    const timer2 = setTimeout(() => setAchievement(null), 8000);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, []);
  
  if (!achievement) return null;
  
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
      <div className="glass border-2 border-yellow-500/50 bg-yellow-900/20 px-6 py-4 rounded-2xl text-center">
        <div className="text-4xl mb-2">{achievement.icon}</div>
        <p className="text-yellow-400 font-bold text-lg">Achievement Unlocked!</p>
        <p className="text-white font-semibold">{achievement.title}</p>
        <p className="text-gray-400 text-sm">{achievement.desc}</p>
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
  const [dailyBonus, setDailyBonus] = useState<{day: number; claimed: boolean} | null>(null);
  
  // Token Utility Panel States
  const [showP2E, setShowP2E] = useState(false);
  const [showStaking, setShowStaking] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTokenEconomy, setShowTokenEconomy] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{name: string; specialty: string; rate: string} | null>(null);
  const [showFriends, setShowFriends] = useState(false);
  
  const { isConnected, address } = useWalletState();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Daily Bonus Popup
  useEffect(() => {
    const timer = setTimeout(() => setDailyBonus({ day: 3, claimed: false }), 3000);
    return () => clearTimeout(timer);
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
      {/* Current Objectives Widget */}
      <div className="fixed top-24 left-4 z-30 glass border-l-2 border-yellow-500/50 px-3 py-2 rounded-r-lg">
        <p className="text-[10px] text-yellow-400 uppercase tracking-wider mb-1">Current Objective</p>
        <p className="text-sm text-white">🤝 Talk to an agent</p>
        <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 w-1/3 rounded-full"></div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">0/3 completed</p>
      </div>

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

      {/* Achievement Popup */}
      <AchievementPopup />

      {/* Daily Bonus Popup */}
      {dailyBonus && !dailyBonus.claimed && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="glass border-2 border-orange-500/50 bg-gradient-to-b from-orange-900/40 to-purple-900/40 px-8 py-6 rounded-2xl text-center animate-pulse">
            <div className="text-5xl mb-3">🎁</div>
            <p className="text-orange-400 font-bold text-xl mb-1">Daily Bonus!</p>
            <p className="text-gray-300 mb-4">Day {dailyBonus.day} • 100 $MV</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => { setTokenBalance(prev => prev + BigInt(100000000000000000000n)); setShowMessage({ type: 'success', text: '+100 $MV claimed!' }); setDailyBonus({ ...dailyBonus, claimed: true }); }}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-xl transition-colors"
              >
                Claim Now
              </button>
              <button
                onClick={() => setDailyBonus({ ...dailyBonus, claimed: true })}
                className="glass text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-colors"
              >
                Later
              </button>
            </div>
          </div>
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
                onClick={() => setSelectedAgent({ name: 'DeFi Agent', specialty: 'Yield Farming Expert', rate: '0.5 $MV' })}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Test Agent Chat
              </button>
              <button
                onClick={() => setAvatar(null)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Change Avatar
              </button>
              <button
                onClick={() => setShowFriends(!showFriends)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>👥</span> Friends (3)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Friends List Popup */}
      {showFriends && (
        <div className="fixed top-24 right-4 z-40">
          <div className="glass border border-cyan-500/30 bg-black/80 px-4 py-3 rounded-xl min-w-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">Friends Online</h3>
              <button onClick={() => setShowFriends(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-300">CryptoKing</span>
                <span className="text-xs text-gray-500 ml-auto">🟢 Online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-300">DeFiDegen</span>
                <span className="text-xs text-gray-500 ml-auto">🟢 Online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-300">NFTCollector</span>
                <span className="text-xs text-gray-500 ml-auto">🟡 Away</span>
              </div>
            </div>
            <button className="w-full mt-3 text-xs bg-cyan-600/50 hover:bg-cyan-600 py-2 rounded-lg transition-colors text-cyan-300">
              + Invite Friend
            </button>
          </div>
        </div>
      )}

      {/* Event Banner */}
      <div className="fixed top-16 left-0 right-0 z-35 flex justify-center pointer-events-none">
        <div className="glass bg-gradient-to-r from-purple-900/80 to-cyan-900/80 border-y border-purple-500/30 px-6 py-2 flex items-center gap-4 animate-pulse">
          <span className="text-lg">🎉</span>
          <span className="text-sm font-medium">Weekly Tournament starts in 2 days!</span>
          <span className="text-xs text-purple-300">• Prize Pool: 10,000 $MV</span>
          <button className="pointer-events-auto text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-lg transition-colors">Join Now</button>
        </div>
      </div>

      {/* Agent Interaction Panel */}
      {selectedAgent && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="glass border border-cyan-500/30 bg-black/80 px-5 py-4 rounded-2xl min-w-[280px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{selectedAgent.name}</h3>
                  <button onClick={() => setSelectedAgent(null)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <p className="text-cyan-400 text-sm">{selectedAgent.specialty}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">Rate: {selectedAgent.rate}/min</span>
                  <button className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded-lg transition-colors">Chat</button>
                  <button className="text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-lg transition-colors">Trade</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {!activeGame && <SoundControls />}
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
