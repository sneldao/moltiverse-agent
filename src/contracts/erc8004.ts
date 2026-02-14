// ERC-8004 Agent Registration Contract ABI
export const ERC8004_ABI = [
  // Register agent
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "agentURI", "type": "string"},
      {"internalType": "address", "name": "tokenAddress", "type": "address"}
    ],
    "name": "registerAgent",
    "outputs": [{"internalType": "uint256", "name": "agentId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get agent info
  {
    "inputs": [{"internalType": "uint256", "name": "agentId", "type": "uint256"}],
    "name": "getAgent",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "agentURI", "type": "string"},
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get agent by address
  {
    "inputs": [{"internalType": "address", "name": "agentAddress", "type": "address"}],
    "name": "getAgentByAddress",
    "outputs": [{"internalType": "uint256", "name": "agentId", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

// ERC-8004 Contract bytecode (placeholder - actual deployment would compile)
export const ERC8004_BYTECODE = "0x608060405234801561000a165680a03f1622a1";
