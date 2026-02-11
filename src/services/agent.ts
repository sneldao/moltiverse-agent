'use client';

import { createPublicClient, createWalletClient, type Address, type Hex, http } from 'viem';
import { CONTRACTS } from '@/config/chain';
import { IDENTITY_ABI } from '@/contracts';

// Monad RPC
const MONAD_RPC = 'https://testnet.rpc.monad.xyz';

// Get viem client for direct contract calls
function getPublicClient() {
  return createPublicClient({
    chain: {
      id: 10141,
      name: 'Monad Testnet',
      nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
      rpcUrls: { default: { http: [MONAD_RPC] } },
    },
    transport: http(MONAD_RPC),
  });
}

// Get wallet client for signing
function getWalletClient() {
  // This would need the connected account
  // For now, return null and handle in the caller
  return null;
}

// Agent specialty types
export type AgentSpecialty = 
  | 'trading'
  | 'gaming'
  | 'social'
  | 'creative'
  | 'research'
  | 'defi';

const SPECIALTY_MAP: Record<AgentSpecialty, Hex> = {
  trading: '0x74726164696e6700000000000000000000000000000000000000000000000000',
  gaming: '0x67616d696e670000000000000000000000000000000000000000000000000000',
  social: '0x736f6369616c0000000000000000000000000000000000000000000000000000',
  creative: '0x6372656174697665000000000000000000000000000000000000000000000000',
  research: '0x7265736561726368000000000000000000000000000000000000000000000000',
  defi: '0x6465666900000000000000000000000000000000000000000000000000000000',
};

export interface AgentInfo {
  tokenId: bigint;
  owner: Address;
  agentURI: string;
  rateLimitPerMinute: bigint;
  specialty: AgentSpecialty;
  reputation: bigint;
  isVerified: boolean;
}

export interface RegisterAgentParams {
  agentURI: string;
  rateLimitPerMinute: bigint;
  specialty: AgentSpecialty;
}

// Register a new agent (placeholder - would need connected wallet)
export async function registerAgent(params: RegisterAgentParams): Promise<{ success: boolean; tokenId?: bigint; error?: string }> {
  return { success: false, error: 'Wallet connection required' };
}

// Get agent info by tokenId
export async function getAgent(tokenId: bigint): Promise<AgentInfo | null> {
  try {
    const publicClient = getPublicClient();
    const [owner, agentURI, rateLimitPerMinute, specialtyHex, reputation, isVerified] = 
      await publicClient.readContract({
        address: CONTRACTS.identity as Address,
        abi: IDENTITY_ABI,
        functionName: 'getAgent',
        args: [tokenId],
      });

    // Convert specialty hex to string
    const specialtyEntry = Object.entries(SPECIALTY_MAP).find(
      ([_, hex]) => hex === specialtyHex
    );
    const specialty = specialtyEntry?.[0] as AgentSpecialty || 'trading';

    return {
      tokenId,
      owner,
      agentURI,
      rateLimitPerMinute,
      specialty,
      reputation,
      isVerified,
    };
  } catch {
    return null;
  }
}

// Get agent URI
export async function getAgentURI(tokenId: bigint): Promise<string | null> {
  try {
    const publicClient = getPublicClient();
    return await publicClient.readContract({
      address: CONTRACTS.identity as Address,
      abi: IDENTITY_ABI,
      functionName: 'getAgentURI',
      args: [tokenId],
    });
  } catch {
    return null;
  }
}
