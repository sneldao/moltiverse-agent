import { Address } from 'viem';

// Game types
export type GameType = 'tetris' | 'racing' | 'puzzle' | 'battle' | 'quest';

export interface GameConfig {
  id: GameType;
  name: string;
  description: string;
  unlockCost: bigint; // Tokens required to unlock
  minPlayers: number;
  maxPlayers: number;
  rewardMultiplier: number; // % of entry fee returned to winners
  duration: number; // seconds
  isUnlocked: boolean;
}

export interface GameInstance {
  id: string;
  gameType: GameType;
  players: PlayerInfo[];
  status: 'waiting' | 'active' | 'completed';
  startedAt: number;
  endedAt?: number;
  entryFee: bigint;
  totalPool: bigint;
  winner?: Address;
}

export interface PlayerInfo {
  address: Address;
  score: number;
  isAlive: boolean;
  rank?: number;
  reward?: bigint;
}

// Available games
export const GAMES: GameConfig[] = [
  {
    id: 'tetris',
    name: 'Tetris Arena',
    description: 'Classic block stacking with crypto rewards',
    unlockCost: BigInt(0), // Free to play
    minPlayers: 1,
    maxPlayers: 50,
    rewardMultiplier: 90,
    duration: 180,
    isUnlocked: true,
  },
  {
    id: 'racing',
    name: 'Agent Racing',
    description: '3D races against AI agents for tokens',
    unlockCost: BigInt('100000000000000000'), // 0.1 tokens
    minPlayers: 1,
    maxPlayers: 10,
    rewardMultiplier: 85,
    duration: 120,
    isUnlocked: false,
  },
  {
    id: 'puzzle',
    name: 'Puzzle Challenge',
    description: 'Solve puzzles to earn reputation',
    unlockCost: BigInt('50000000000000000'), // 0.05 tokens
    minPlayers: 1,
    maxPlayers: 20,
    rewardMultiplier: 80,
    duration: 300,
    isUnlocked: false,
  },
  {
    id: 'battle',
    name: 'Agent Battle',
    description: 'PvP combat with token stakes',
    unlockCost: BigInt('500000000000000000'), // 0.5 tokens
    minPlayers: 2,
    maxPlayers: 4,
    rewardMultiplier: 95,
    duration: 60,
    isUnlocked: false,
  },
  {
    id: 'quest',
    name: 'Daily Quests',
    description: 'Complete daily objectives for rewards',
    unlockCost: BigInt(0),
    minPlayers: 1,
    maxPlayers: 1,
    rewardMultiplier: 100,
    duration: 86400,
    isUnlocked: true,
  },
];

// Get unlocked games for a user based on their token holdings
export function getUnlockedGames(userBalance: bigint): GameConfig[] {
  return GAMES.map(game => ({
    ...game,
    isUnlocked: userBalance >= game.unlockCost,
  }));
}

// Create game instance
export function createGameInstance(gameType: GameType, entryFee: bigint): GameInstance {
  const game = GAMES.find(g => g.id === gameType);
  if (!game) throw new Error('Game not found');

  return {
    id: crypto.randomUUID(),
    gameType,
    players: [],
    status: 'waiting',
    startedAt: Date.now(),
    entryFee,
    totalPool: BigInt(0),
  };
}

// Join game
export function joinGame(instance: GameInstance, player: Address): GameInstance {
  if (instance.status !== 'waiting') {
    throw new Error('Game already started');
  }

  const game = GAMES.find(g => g.id === instance.gameType);
  if (!game) throw new Error('Game not found');

  if (instance.players.length >= game.maxPlayers) {
    throw new Error('Game is full');
  }

  return {
    ...instance,
    players: [
      ...instance.players,
      { address: player, score: 0, isAlive: true },
    ],
  };
}
