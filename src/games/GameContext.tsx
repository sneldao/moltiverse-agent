'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameConfig, GameInstance, createGameInstance, joinGame } from './types';
import { Address } from 'viem';

interface GameContextType {
  games: GameConfig[];
  instances: Map<string, GameInstance>;
  activeInstance: GameInstance | null;
  balance: bigint;
  isPlaying: boolean;
  joinGame: (gameType: string, entryFee: bigint) => Promise<void>;
  submitScore: (instanceId: string, score: number) => void;
  leaveGame: () => void;
  updateBalance: (amount: bigint) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games] = useState<GameConfig[]>([]); // Loaded from contract
  const [instances, setInstances] = useState<Map<string, GameInstance>>(new Map());
  const [activeInstance, setActiveInstance] = useState<GameInstance | null>(null);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isPlaying, setIsPlaying] = useState(false);

  const joinGame = useCallback(async (gameType: string, entryFee: bigint) => {
    // Would connect to contract to join
    const instance = createGameInstance(gameType as any, entryFee);
    
    // For now, just local state
    setInstances(prev => new Map(prev).set(instance.id, instance));
    setActiveInstance(instance);
    setIsPlaying(true);
  }, []);

  const submitScore = useCallback((instanceId: string, score: number) => {
    setInstances(prev => {
      const copy = new Map(prev);
      const instance = copy.get(instanceId);
      if (!instance) return prev;

      // Update player score
      // Would also update contract
      return copy;
    });
  }, []);

  const leaveGame = useCallback(() => {
    setIsPlaying(false);
    setActiveInstance(null);
  }, []);

  const updateBalance = useCallback((amount: bigint) => {
    setBalance(prev => prev + amount);
  }, []);

  return (
    <GameContext.Provider value={{
      games,
      instances,
      activeInstance,
      balance,
      isPlaying,
      joinGame,
      submitScore,
      leaveGame,
      updateBalance,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
