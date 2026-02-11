# Moltiverse - 3D AI Agent World

Explore a 3D world where humans and AI agents interact, play games, and earn rewards together.

## 🎮 What Is This?

**Moltiverse** is a 3D immersive world built with Next.js and Three.js where:

- **Humans** explore, play mini-games, and earn token rewards
- **AI Agents** (ERC-8004) live autonomously, interact with players, and build reputation
- **Mini-games** like Tetris unlock at different world locations
- **Real economy** via Nad.fun bonding curves and token rewards

## ✨ Features

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

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
moltiverse-agent/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── world/                  # 3D World
│   │   ├── World3D.tsx         # Canvas wrapper
│   │   └── WorldScene.tsx      # 3D environment
│   ├── games/                  # Mini-games
│   │   ├── Tetris.tsx          # Tetris game
│   │   ├── types.ts            # Game types
│   │   └── GameContext.tsx     # Game state
│   ├── services/               # Blockchain services
│   │   ├── agent.ts            # ERC-8004 operations
│   │   └── token.ts            # Nad.fun integration
│   ├── hooks/                  # React hooks
│   │   └── useWallet.ts        # Wallet connection
│   ├── contracts/              # Contract ABIs
│   │   └── abis.ts
│   └── config/                 # Configuration
│       └── chain.ts            # Chain config
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_RPC_URL=https://testnet.rpc.monad.xyz
NEXT_PUBLIC_IDENTITY_ADDRESS=0x...  # After deployment
NEXT_PUBLIC_DELEGATION_ADDRESS=0x...
NEXT_PUBLIC_NADFUN_ADDRESS=0x...
```

## 🎮 Controls

| Key | Action |
|-----|--------|
| W/↑ | Move forward |
| S/↓ | Move backward |
| A/← | Move left |
| D/→ | Move right |
| Space | Jump |
| Click | Interact |

## 🔗 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript |
| 3D Engine | Three.js + React Three Fiber |
| Styling | Tailwind CSS |
| Blockchain | Monad (EVM-compatible) |
| Wallet | wagmi + viem |
| Agent Identity | ERC-8004 |
| Tokenization | Nad.fun |

## 🏗️ Architecture

### World System
```
WorldScene (Canvas)
├── Player (WASD + jump)
├── AgentNPC × 5 (autonomous wandering)
├── GamePortal × 4 (enter games)
├── Ground + Grid (environment)
└── Lighting + Environment
```

### Game System
```
GameContext
├── GameConfig[] (definitions)
├── GameInstance[] (active games)
└── GameState (player balance, unlocked games)
```

### Wallet Flow
```
useWallet
├── connectWallet() → MetaMask
├── disconnectWallet()
├── getWalletClient()
└── getPublicClient()
```

## 🎯 Hackathon Goals

1. ✅ 3D world with exploration
2. ✅ Tetris mini-game (playable)
3. ✅ ERC-8004 agent registration UI
4. 🔄 Real contract integration
5. 🔄 Token economy with rewards
6. 🔄 Additional mini-games

## 📅 Timeline

| Phase | Status |
|-------|--------|
| Setup & Architecture | ✅ Complete |
| 3D World & Controls | ✅ Complete |
| Tetris Game | ✅ Complete |
| Agent Integration | 🔄 In Progress |
| Token Economy | 🔄 Planned |
| Additional Games | 🔄 Planned |
| **Submission** | 📅 Feb 15 |

## 🏆 Prize Pool

**$200,000** - 16 × $10K grants + $40K liquidity boost

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit PR

## 📄 License

MIT License

---

Built for **Moltiverse Hackathon** 🦾
