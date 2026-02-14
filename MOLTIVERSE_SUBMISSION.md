# Moltiverse - Celo Hackathon Submission Summary

## Project Overview

**Name:** Moltiverse  
**Tagline:** 3D AI Agent World - Explore, play games, and interact with autonomous agents  
**Demo:** https://moltiverse-final-snel.vercel.app  
**Repository:** https://github.com/sneldao/moltiverse-agent

## Hackathon Details

- **Deadline:** February 15, 2026
- **Platform:** Celo AI Partner Catalyst Hackathon  
- **Prize Pool:** $200K (16 x $10K + $40K liquidity boost)
- **Focus:** AI agents with money rails on Monad blockchain

## Project Stats

- **Completion:** 45%
- **Build Size:** 342 kB (home), 430 kB First Load JS
- **Tech Stack:** Next.js 14, Three.js, viem, wagmi, ERC-8004, Nad.fun

## Core Features

### 🌍 3D World Exploration
- First-person exploration with WASD controls
- Multiple zones: Hub, Tetris Arena, Racing Track, Battle Arena
- Meet autonomous AI agents at various locations
- Visual portals to enter mini-games

### 🎮 Mini-Games
| Game | Status | Description |
|------|--------|-------------|
| Tetris Arena | ✅ Live | Classic Tetris with token rewards |
| Agent Racing | 🔒 Locked | 3D races against AI agents |
| Battle Arena | 🔒 Locked | PvP combat with stakes |
| Daily Quests | ✅ Live | Complete objectives for rewards |

### 🤖 ERC-8004 Agent Identity
- On-chain agent registration
- Specialty tracking (trading, gaming, social, etc.)
- Rate limiting per minute
- Reputation system

### 💰 Token Economy (Nad.fun)
- Play games to earn $MV tokens
- Agents can hold and trade tokens
- Tournaments with prize pools
- Fair pricing via bonding curves

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript |
| 3D Engine | Three.js + React Three Fiber |
| Styling | Tailwind CSS |
| Blockchain | Monad (EVM-compatible) |
| Wallet | wagmi + viem |
| Agent Identity | ERC-8004 |
| Tokenization | Nad.fun bonding curves |

## Submission Checklist

- [x] Project structure (Next.js + TypeScript)
- [x] Wallet connection (wagmi + viem)
- [x] Monad chain configuration
- [x] ERC-8004 Agent Service
- [x] Nad.fun Token Service
- [x] AgentPanel & TokenLaunch components
- [x] Tailwind CSS styling
- [x] 3D World with Three.js (WASD exploration)
- [x] Tetris game (playable)
- [x] Racing game (3D races vs AI)
- [x] Build & test successful
- [x] Deployed to Vercel production
- [ ] Deploy smart contracts (ERC-8004 on Monad)
- [ ] Token deployed on Nad.fun
- [ ] Demo video (optional)

## What's Missing

- Token deployment on Nad.fun bonding curve
- Full agent-token integration
- Demo video (optional but recommended)

## Environment Variables
```env
NEXT_PUBLIC_RPC_URL=https://testnet.rpc.monad.xyz
NEXT_PUBLIC_IDENTITY_ADDRESS=0x...  # After deployment
NEXT_PUBLIC_DELEGATION_ADDRESS=0x...
NEXT_PUBLIC_NADFUN_ADDRESS=0x...
```

## Resources

- **Demo:** https://moltiverse-final-snel.vercel.app
- **Repository:** https://github.com/sneldao/moltiverse-agent
- **Token Deployment:** See DEPLOY_TOKEN.md
- **Nad.fun:** https://nad.fun/create.md
- **Monad RPC:** https://testnet.rpc.monad.xyz

## Contact

- GitHub: https://github.com/sneldao/moltiverse-agent
- Demo: https://moltiverse-final-snel.vercel.app

---

**Submitted:** [DATE]  
**Project ID:** [TO BE ASSIGNED]
