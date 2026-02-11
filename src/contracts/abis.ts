// ERC-8004 Agent Contract ABI (simplified)
export const IDENTITY_ABI = [
  {
    inputs: [
      { name: 'agentURI', type: 'string' },
      { name: 'rateLimitPerMinute', type: 'uint256' },
      { name: 'specialty', type: 'bytes32' },
    ],
    name: 'registerAgent',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getAgent',
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'agentURI', type: 'string' },
      { name: 'rateLimitPerMinute', type: 'uint256' },
      { name: 'specialty', type: 'bytes32' },
      { name: 'reputation', type: 'uint256' },
      { name: 'isVerified', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getAgentURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const DELEGATION_ABI = [
  {
    inputs: [
      { name: 'agent', type: 'address' },
      { name: 'scope', type: 'bytes32' },
      { name: 'maxAmount', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ],
    name: 'createDelegation',
    outputs: [{ name: 'delegationId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'delegationId', type: 'uint256' }],
    name: 'revokeDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
