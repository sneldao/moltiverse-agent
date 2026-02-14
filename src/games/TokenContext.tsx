// Token Utility Context - React Context for token state management

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  TokenState,
  DEFAULT_TOKEN_STATE,
  TokenActions,
  createTokenActions,
  calculateMultiplier,
  getCurrentTier,
  StakeTier,
  STAKE_TIERS,
  formatTokens,
  INITIAL_BALANCE,
} from './tokenUtility';

interface TokenContextValue {
  tokenState: TokenState;
  actions: TokenActions;
  tier: StakeTier;
  nextTier: StakeTier | null;
  tokensToNextTier: bigint;
  isLoading: boolean;
  resetDemo: () => void;
}

const TokenContext = createContext<TokenContextValue | null>(null);

// Provider component
export function TokenProvider({ children }: { children: ReactNode }) {
  const [tokenState, setTokenState] = useState<TokenState>({
    ...DEFAULT_TOKEN_STATE,
    balance: INITIAL_BALANCE, // Start with 100 $MV for demo
  });
  const [isLoading, setIsLoading] = useState(false);

  const getState = useCallback(() => tokenState, [tokenState]);
  
  const actions = createTokenActions(getState, setTokenState);

  const tier = getCurrentTier(tokenState.staked);
  
  // Find next tier
  const nextTierIndex = STAKE_TIERS.findIndex(t => t.staked > tokenState.staked);
  const nextTier = nextTierIndex >= 0 ? STAKE_TIERS[nextTierIndex] : null;
  
  const tokensToNextTier = nextTier ? nextTier.staked - tokenState.staked : BigInt(0);

  const resetDemo = useCallback(() => {
    setTokenState({
      ...DEFAULT_TOKEN_STATE,
      balance: INITIAL_BALANCE,
    });
  }, []);

  return (
    <TokenContext.Provider
      value={{
        tokenState,
        actions,
        tier,
        nextTier,
        tokensToNextTier,
        isLoading,
        resetDemo,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

// Hook to use token context
export function useTokenUtility() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenUtility must be used within TokenProvider');
  }
  return context;
}

// Export for convenience
export { formatTokens };
