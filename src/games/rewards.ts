// Token reward types and configuration
import { Address } from 'viem';

// Reward tiers based on performance
export interface RewardTier {
  rank: number;
  multiplier: number; // % of entry fee pool
  badge: string;
  title: string;
}

export const REWARD_TIERS: RewardTier[] = [
  { rank: 1, multiplier: 50, badge: '🥇', title: 'Champion' },
  { rank: 2, multiplier: 25, badge: '🥈', title: 'Runner Up' },
  { rank: 3, multiplier: 15, badge: '🥉', title: 'Third Place' },
  { rank: 4, multiplier: 7, badge: '⭐', title: 'Top 4' },
  { rank: 5, multiplier: 3, badge: '⭐', title: 'Top 5' },
];

// Game reward configuration
export interface GameRewardConfig {
  gameType: string;
  entryFee: bigint; // in wei
  baseRewardPool: bigint;
  minPlayers: number;
  maxPlayers: number;
  rewards: RewardTier[];
}

export const GAME_REWARDS: Record<string, GameRewardConfig> = {
  tetris: {
    gameType: 'tetris',
    entryFee: BigInt('10000000000000000'), // 0.01 MON
    baseRewardPool: BigInt('50000000000000000'), // 0.05 MON
    minPlayers: 1,
    maxPlayers: 50,
    rewards: REWARD_TIERS,
  },
  racing: {
    gameType: 'racing',
    entryFee: BigInt('100000000000000000'), // 0.1 MON
    baseRewardPool: BigInt('500000000000000000'), // 0.5 MON
    minPlayers: 1,
    maxPlayers: 10,
    rewards: REWARD_TIERS,
  },
  battle: {
    gameType: 'battle',
    entryFee: BigInt('500000000000000000'), // 0.5 MON
    baseRewardPool: BigInt('2000000000000000000'), // 2 MON
    minPlayers: 2,
    maxPlayers: 4,
    rewards: [
      { rank: 1, multiplier: 70, badge: '⚔️', title: 'Victor' },
      { rank: 2, multiplier: 30, badge: '🛡️', title: 'Challenger' },
    ],
  },
  quest: {
    gameType: 'quest',
    entryFee: BigInt(0),
    baseRewardPool: BigInt('10000000000000000'), // 0.01 MON
    minPlayers: 1,
    maxPlayers: 1,
    rewards: [
      { rank: 1, multiplier: 100, badge: '✅', title: 'Complete' },
    ],
  },
};

// Calculate rewards for a game
export function calculateRewards(
  gameConfig: GameRewardConfig,
  playerCount: number,
  ranks: Map<Address, number>
): Map<Address, bigint> {
  const totalPool = gameConfig.baseRewardPool + (gameConfig.entryFee * BigInt(playerCount));
  const rewards = new Map<Address, bigint>();

  ranks.forEach((rank, address) => {
    const tier = gameConfig.rewards.find(t => t.rank === rank);
    if (tier) {
      const reward = (totalPool * BigInt(tier.multiplier)) / BigInt(100);
      rewards.set(address, reward);
    }
  });

  return rewards;
}

// Calculate leaderboard points
export function calculateLeaderboardPoints(
  gameType: string,
  rank: number,
  score: number
): number {
  const basePoints: Record<string, number> = {
    tetris: 100,
    racing: 150,
    battle: 200,
    quest: 50,
  };

  const base = basePoints[gameType] || 50;
  const rankBonus = Math.max(0, (10 - rank) * 10);
  const scoreBonus = Math.floor(score / 100);

  return base + rankBonus + scoreBonus;
}

// Leaderboard entry
export interface LeaderboardEntry {
  address: Address;
  totalPoints: number;
  gamesPlayed: number;
  wins: number;
  topRank: number;
  lastPlayed: number;
}

// Global leaderboard (would be stored on-chain in production)
export const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [];

// Update leaderboard
export function updateLeaderboard(
  address: Address,
  gameType: string,
  rank: number,
  score: number
): LeaderboardEntry {
  const existing = GLOBAL_LEADERBOARD.find(e => e.address === address);
  const points = calculateLeaderboardPoints(gameType, rank, score);

  if (existing) {
    existing.totalPoints += points;
    existing.gamesPlayed += 1;
    if (rank === 1) existing.wins += 1;
    existing.topRank = Math.min(existing.topRank, rank);
    existing.lastPlayed = Date.now();
    return existing;
  }

  const newEntry: LeaderboardEntry = {
    address,
    totalPoints: points,
    gamesPlayed: 1,
    wins: rank === 1 ? 1 : 0,
    topRank: rank,
    lastPlayed: Date.now(),
  };

  GLOBAL_LEADERBOARD.push(newEntry);
  return newEntry;
}

// Get top players
export function getTopPlayers(limit: number = 10): LeaderboardEntry[] {
  return [...GLOBAL_LEADERBOARD]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit);
}
