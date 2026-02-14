'use client';

import { ethers } from 'ethers';
import { ERC8004_ABI } from '@/contracts/erc8004';

// Monad testnet config
const MONAD_TESTNET = {
  chainId: 0x279F, // 10141
  rpcUrl: 'https://testnet.rpc.monad.xyz',
  explorer: 'https://testnet.monadexplorer.com',
};

// ERC-8004 contract address (would be deployed to Monad)
export const ERC8004_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

// Agent registration types
export interface AgentRegistration {
  name: string;
  description: string;
  agentURI: string; // IPFS hash with agent metadata
  tokenAddress: string; // Nad.fun token address
}

export interface AgentInfo {
  name: string;
  description: string;
  agentURI: string;
  tokenAddress: string;
  creator: `0x${string}`;
  timestamp: bigint;
}

/**
 * Register an agent on ERC-8004 contract
 */
export async function registerAgentOnChain(
  registration: AgentRegistration,
  signer: ethers.Signer
): Promise<{ success: boolean; agentId?: bigint; error?: string }> {
  try {
    if (!(window as any).ethereum) {
      return { success: false, error: 'No wallet connected' };
    }

    // Create contract instance
    const contract = new ethers.Contract(
      ERC8004_ADDRESS,
      ERC8004_ABI,
      signer
    );

    // Register agent
    const tx = await contract.registerAgent(
      registration.name,
      registration.description,
      registration.agentURI,
      registration.tokenAddress
    );

    console.log('Registration transaction:', tx.hash);
    const receipt = await tx.wait();
    
    // Parse agent ID from logs (simplified)
    const agentId = receipt.logs[0]?.topics[1] ? BigInt(receipt.logs[0].topics[1]) : BigInt(0);

    return { success: true, agentId };
  } catch (error) {
    console.error('Agent registration error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get agent info from blockchain
 */
export async function getAgentInfo(agentId: bigint): Promise<AgentInfo | null> {
  try {
    if (!(window as any).ethereum) {
      return null;
    }

    const provider = new ethers.JsonRpcProvider(MONAD_TESTNET.rpcUrl);
    const contract = new ethers.Contract(
      ERC8004_ADDRESS,
      ERC8004_ABI,
      provider
    );

    const info = await contract.getAgent(agentId);
    
    return {
      name: info[0],
      description: info[1],
      agentURI: info[2],
      tokenAddress: info[3],
      creator: info[4],
      timestamp: info[5],
    };
  } catch (error) {
    console.error('Error getting agent info:', error);
    return null;
  }
}

/**
 * Get agent ID by address
 */
export async function getAgentIdByAddress(address: `0x${string}`): Promise<bigint | null> {
  try {
    if (!(window as any).ethereum) {
      return null;
    }

    const provider = new ethers.JsonRpcProvider(MONAD_TESTNET.rpcUrl);
    const contract = new ethers.Contract(
      ERC8004_ADDRESS,
      ERC8004_ABI,
      provider
    );

    const agentId = await contract.getAgentByAddress(address);
    return agentId;
  } catch (error) {
    console.error('Error getting agent ID:', error);
    return null;
  }
}

/**
 * Upload agent metadata to IPFS (placeholder - would use actual IPFS service)
 */
export async function uploadAgentMetadata(metadata: {
  name: string;
  description: string;
  avatarType: string;
  avatarColor: string;
  abilities: string[];
}): Promise<string> {
  // Placeholder: In production, use Pinata, nft.storage, or Web3.Storage
  const cid = 'QmAgent' + Math.random().toString(36).substring(7);
  return `ipfs://${cid}`;
}
