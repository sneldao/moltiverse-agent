// Optimistic UI Update System - Faster user experience

import { useState, useCallback, useRef } from 'react';

interface OptimisticState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
}

interface OptimisticAction<T> {
  type: 'PENDING' | 'SUCCESS' | 'ERROR' | 'ROLLBACK';
  payload?: T;
  error?: string;
}

// Optimistic update hook
export function useOptimisticUpdate<T>(
  initialValue: T,
  asyncAction: (newValue: T) => Promise<T>
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialValue,
    isLoading: false,
    error: null,
  });

  const previousData = useRef<T>(initialValue);

  const update = useCallback(async (newValue: T) => {
    // Store previous value for rollback
    previousData.current = state.data;

    // Optimistically update UI
    setState(prev => ({
      ...prev,
      data: newValue,
      isLoading: true,
      error: null,
    }));

    try {
      // Perform actual async action
      const result = await asyncAction(newValue);
      
      // Success - update with actual result
      setState({
        data: result,
        isLoading: false,
        error: null,
      });
      
      return result;
    } catch (error: any) {
      // Error - rollback to previous value
      setState({
        data: previousData.current,
        isLoading: false,
        error: error.message || 'Action failed',
      });
      
      throw error;
    }
  }, [state.data, asyncAction]);

  const reset = useCallback(() => {
    setState({
      data: initialValue,
      isLoading: false,
      error: null,
    });
  }, [initialValue]);

  return {
    ...state,
    update,
    reset,
    isPending: state.isLoading,
  };
}

// Token balance with optimistic updates
export function useTokenBalance(initialBalance: bigint) {
  const updateBalance = useCallback(async (newBalance: bigint) => {
    // Simulate async action (in real app, this would be a blockchain transaction)
    return new Promise<bigint>((resolve) => {
      setTimeout(() => resolve(newBalance), 1000);
    });
  }, []);

  return useOptimisticUpdate(initialBalance, updateBalance);
}

// Transaction with optimistic updates
interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'reward' | 'purchase';
  amount: bigint;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export function useTransactionQueue() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = useCallback((type: Transaction['type'], amount: bigint): Transaction => {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      status: 'pending',
      timestamp: Date.now(),
    };

    // Optimistically add transaction
    setTransactions(prev => [tx, ...prev]);

    // Simulate confirmation
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(t => 
          t.id === tx.id ? { ...t, status: 'confirmed' } : t
        )
      );
    }, 2000);

    return tx;
  }, []);

  const getRecentTransactions = useCallback((limit: number = 5) => {
    return transactions.slice(0, limit);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    getRecentTransactions,
  };
}

// Cache management for performance
class CacheManager<T> {
  private cache: Map<string, { data: T; expiry: number }> = new Map();

  set(key: string, data: T, ttlMs: number = 60000) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

// Create singleton cache instance
export const chainDataCache = new CacheManager<any>();
export const tokenCache = new CacheManager<bigint>();
export const userCache = new CacheManager<any>();
