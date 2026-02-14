// API Service Layer - Unified API for multi-chain operations

import { Chain } from '@/config/chains';
import { chainDataCache, tokenCache, userCache } from '@/lib/optimisticUpdates';

const API_BASE = '/api'; // In production, this would be your backend

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic fetch with caching
async function fetchWithCache<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTtl: number = 60000
): Promise<ApiResponse<T>> {
  // Check cache first
  if (cacheKey && chainDataCache.has(cacheKey)) {
    return { success: true, data: chainDataCache.get(cacheKey) as T };
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }

    // Cache successful response
    if (cacheKey && data) {
      chainDataCache.set(cacheKey, data, cacheTtl);
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// Token API
export const tokenApi = {
  // Get token balance on any chain
  async getBalance(address: string, chain: Chain): Promise<ApiResponse<{ balance: string }>> {
    const cacheKey = `token_balance_${chain}_${address}`;
    return fetchWithCache(`/token/balance?address=${address}&chain=${chain}`, {}, cacheKey);
  },

  // Get token info
  async getTokenInfo(chain: Chain): Promise<ApiResponse<{
    name: string;
    symbol: string;
    supply: string;
    holders: number;
  }>> {
    const cacheKey = `token_info_${chain}`;
    return fetchWithCache(`/token/info?chain=${chain}`, {}, cacheKey, 300000);
  },

  // Stake tokens
  async stake(amount: bigint, chain: Chain): Promise<ApiResponse<{ txHash: string }>> {
    return fetchWithCache('/token/stake', {
      method: 'POST',
      body: JSON.stringify({ amount: amount.toString(), chain }),
    });
  },

  // Unstake tokens
  async unstake(amount: bigint, chain: Chain): Promise<ApiResponse<{ txHash: string }>> {
    return fetchWithCache('/token/unstake', {
      method: 'POST',
      body: JSON.stringify({ amount: amount.toString(), chain }),
    });
  },
};

// Game API
export const gameApi = {
  // Submit game score
  async submitScore(
    gameType: string,
    score: number,
    chain: Chain
  ): Promise<ApiResponse<{ rank: number; reward: string }>> {
    return fetchWithCache('/game/submit', {
      method: 'POST',
      body: JSON.stringify({ gameType, score, chain }),
    });
  },

  // Get game leaderboard
  async getLeaderboard(
    gameType: string,
    limit: number = 10
  ): Promise<ApiResponse<{ entries: Array<{
    rank: number;
    address: string;
    score: number;
  }>}>> {
    const cacheKey = `leaderboard_${gameType}_${limit}`;
    return fetchWithCache(`/game/leaderboard?type=${gameType}&limit=${limit}`, {}, cacheKey);
  },
};

// Agent API
export const agentApi = {
  // Get agent info
  async getAgent(agentId: string): Promise<ApiResponse<{
    id: string;
    name: string;
    type: string;
    services: Array<{
      name: string;
      cost: string;
    }>;
  }>> {
    const cacheKey = `agent_${agentId}`;
    return fetchWithCache(`/agent/${agentId}`, {}, cacheKey);
  },

  // Interact with agent
  async interact(
    agentId: string,
    action: string,
    chain: Chain
  ): Promise<ApiResponse<{ result: string; reward?: string }>> {
    return fetchWithCache('/agent/interact', {
      method: 'POST',
      body: JSON.stringify({ agentId, action, chain }),
    });
  },

  // Register new agent (ERC-8004)
  async registerAgent(
    metadata: { name: string; description: string },
    chain: Chain
  ): Promise<ApiResponse<{ agentId: string; txHash: string }>> {
    return fetchWithCache('/agent/register', {
      method: 'POST',
      body: JSON.stringify({ ...metadata, chain }),
    });
  },
};

// User API
export const userApi = {
  // Get user profile
  async getProfile(address: string): Promise<ApiResponse<{
    address: string;
    totalEarned: string;
    questsCompleted: number;
    gamesPlayed: number;
  }>> {
    const cacheKey = `user_${address}`;
    return fetchWithCache(`/user/${address}`, {}, cacheKey);
  },

  // Update user preferences
  async updatePreferences(
    address: string,
    preferences: Record<string, any>
  ): Promise<ApiResponse<{ success: boolean }>> {
    return fetchWithCache('/user/preferences', {
      method: 'POST',
      body: JSON.stringify({ address, preferences }),
    });
  },
};

// Quest API
export const questApi = {
  // Get daily quests
  async getDailyQuests(address: string, chain: Chain): Promise<ApiResponse<{
    quests: Array<{
      id: string;
      title: string;
      progress: number;
      reward: string;
    }>;
  }>> {
    const cacheKey = `quests_${address}_${chain}_${new Date().toDateString()}`;
    return fetchWithCache(`/quests/daily?address=${address}&chain=${chain}`, {}, cacheKey, 3600000);
  },

  // Claim quest reward
  async claimReward(questId: string, chain: Chain): Promise<ApiResponse<{ txHash: string }>> {
    return fetchWithCache('/quests/claim', {
      method: 'POST',
      body: JSON.stringify({ questId, chain }),
    });
  },
};

// Chain API
export const chainApi = {
  // Get chain status
  async getChainStatus(chain: Chain): Promise<ApiResponse<{
    blockNumber: number;
    gasPrice: string;
    synced: boolean;
  }>> {
    const cacheKey = `chain_status_${chain}`;
    return fetchWithCache(`/chain/status?chain=${chain}`, {}, cacheKey, 15000);
  },

  // Get bridge quotes
  async getBridgeQuote(
    fromChain: Chain,
    toChain: Chain,
    amount: bigint
  ): Promise<ApiResponse<{
    estimate: string;
    fee: string;
    duration: number;
  }>> {
    return fetchWithCache('/chain/bridge/quote', {
      method: 'POST',
      body: JSON.stringify({ fromChain, toChain, amount: amount.toString() }),
    });
  },
};
