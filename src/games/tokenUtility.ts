// Moltiverse Token Utility System
// Play-to-earn, staking, and rewards management

import { Address } from 'viem';

// ============================================================================
// TOKEN STATE
// ============================================================================

export interface TokenState {
  balance: bigint;        // $MV tokens held
  staked: bigint;        // $MV staked (locked)
  multiplier: number;     // Current reward multiplier (1x - 5x)
  totalEarned: bigint;    // Lifetime tokens earned
  totalStaked: bigint;   // Lifetime tokens staked
}

export const DEFAULT_TOKEN_STATE: TokenState = {
  balance: BigInt(0),
  staked: BigInt(0),
  multiplier: 1,
  totalEarned: BigInt(0),
  totalStaked: BigInt(0),
};

// ============================================================================
// STAKING CONFIG
// ============================================================================

export interface StakeTier {
  staked: bigint;      // Tokens required
  multiplier: number;  // Reward multiplier
  tierName: string;    // Bronze, Silver, Gold, Platinum, Diamond
  color: string;       // CSS color
}

export const STAKE_TIERS: StakeTier[] = [
  { staked: BigInt(0), multiplier: 1, tierName: 'None', color: '#9ca3af' },
  { staked: BigInt('1000000000000000000'), multiplier: 2, tierName: 'Bronze', color: '#cd7f32' },
  { staked: BigInt('5000000000000000000'), multiplier: 3, tierName: 'Silver', color: '#c0c0c0' },
  { staked: BigInt('10000000000000000000'), multiplier: 4, tierName: 'Gold', color: '#ffd700' },
  { staked: BigInt('50000000000000000000'), multiplier: 5, tierName: 'Diamond', color: '#b9f2ff' },
];

// ============================================================================
// GAME REWARDS
// ============================================================================

export interface GameReward {
  gameType: string;
  entryFee: bigint;
  baseReward: bigint;
  winReward: bigint;
  top3Bonus: bigint;
}

export const GAME_REWARDS: Record<string, GameReward> = {
  tetris: {
    gameType: 'tetris',
    entryFee: BigInt('1000000000000000000'),   // 1 $MV
    baseReward: BigInt('100000000000000000'),  // 0.1 $MV
    winReward: BigInt('5000000000000000000'),   // 5 $MV
    top3Bonus: BigInt('2000000000000000000'),  // 2 $MV
  },
  racing: {
    gameType: 'racing',
    entryFee: BigInt('5000000000000000000'),   // 5 $MV
    baseReward: BigInt('500000000000000000'),  // 0.5 $MV
    winReward: BigInt('25000000000000000000'), // 25 $MV
    top3Bonus: BigInt('10000000000000000000'), // 10 $MV
  },
  battle: {
    gameType: 'battle',
    entryFee: BigInt('10000000000000000000'),   // 10 $MV
    baseReward: BigInt('1000000000000000000'),  // 1 $MV
    winReward: BigInt('50000000000000000000'),  // 50 $MV
    top3Bonus: BigInt('25000000000000000000'),  // 25 $MV
  },
  quest: {
    gameType: 'quest',
    entryFee: BigInt(0),
    baseReward: BigInt('100000000000000000'),   // 0.1 $MV
    winReward: BigInt('1000000000000000000'),   // 1 $MV
    top3Bonus: BigInt(0),
  },
};

// ============================================================================
// TOKEN MATH
// ============================================================================

// Convert wei to readable format (18 decimals)
export function formatTokens(wei: bigint): number {
  return Number(wei) / 1e18;
}

// Convert readable to wei (18 decimals)
export function parseTokens(amount: number): bigint {
  return BigInt(Math.floor(amount * 1e18));
}

// Calculate current multiplier based on staked amount
export function calculateMultiplier(staked: bigint): number {
  for (let i = STAKE_TIERS.length - 1; i >= 0; i--) {
    if (staked >= STAKE_TIERS[i].staked) {
      return STAKE_TIERS[i].multiplier;
    }
  }
  return 1;
}

// Get tier info for current stake
export function getCurrentTier(staked: bigint): StakeTier {
  for (let i = STAKE_TIERS.length - 1; i >= 0; i--) {
    if (staked >= STAKE_TIERS[i].staked) {
      return STAKE_TIERS[i];
    }
  }
  return STAKE_TIERS[0];
}

// Calculate reward with multiplier
export function calculateReward(
  baseReward: bigint,
  multiplier: number,
  rank: number
): bigint {
  let reward = baseReward;
  
  if (rank === 1) {
    // Win bonus
    reward = reward * BigInt(multiplier);
  } else if (rank <= 3) {
    // Top 3 bonus
    reward = reward * BigInt(multiplier) / BigInt(2);
  } else {
    // Participation
    reward = reward * BigInt(multiplier) / BigInt(10);
  }
  
  return reward;
}

// ============================================================================
// INITIAL BALANCES (FOR DEMO)
// ============================================================================

export const INITIAL_BALANCE = BigInt('100000000000000000000'); // 100 $MV for testing

// ============================================================================
// TOKEN ACTIONS (SIMULATED - Replace with contract calls)
// ============================================================================

export interface TokenActions {
  stake: (amount: bigint) => Promise<boolean>;
  unstake: (amount: bigint) => Promise<boolean>;
  awardReward: (amount: bigint, reason: string) => Promise<boolean>;
  payEntryFee: (amount: bigint) => Promise<boolean>;
}

// Simulated token actions (for demo without real contract)
export function createTokenActions(
  getState: () => TokenState,
  setState: (state: TokenState) => void
): TokenActions {
  return {
    async stake(amount: bigint): Promise<boolean> {
      const state = getState();
      if (amount > state.balance) return false;
      
      const newBalance = state.balance - amount;
      const newStaked = state.staked + amount;
      const newMultiplier = calculateMultiplier(newStaked);
      
      setState({
        ...state,
        balance: newBalance,
        staked: newStaked,
        multiplier: newMultiplier,
        totalStaked: state.totalStaked + amount,
      });
      
      return true;
    },
    
    async unstake(amount: bigint): Promise<boolean> {
      const state = getState();
      if (amount > state.staked) return false;
      
      const newStaked = state.staked - amount;
      const newBalance = state.balance + amount;
      const newMultiplier = calculateMultiplier(newStaked);
      
      setState({
        ...state,
        balance: newBalance,
        staked: newStaked,
        multiplier: newMultiplier,
      });
      
      return true;
    },
    
    async awardReward(amount: bigint, reason: string): Promise<boolean> {
      const state = getState();
      const reward = amount * BigInt(state.multiplier);
      
      setState({
        ...state,
        balance: state.balance + reward,
        totalEarned: state.totalEarned + reward,
      });
      
      console.log(`[Token] Awarded ${formatTokens(reward)} $MV for ${reason}`);
      return true;
    },
    
    async payEntryFee(amount: bigint): Promise<boolean> {
      const state = getState();
      if (amount > state.balance) return false;
      
      setState({
        ...state,
        balance: state.balance - amount,
      });
      
      return true;
    },
  };
}
