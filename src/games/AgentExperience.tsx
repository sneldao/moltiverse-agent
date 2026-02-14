// Enhanced Agent System - Better agent experience

'use client';

import { useState, useEffect, useRef } from 'react';

// Agent personality configuration
interface AgentPersonality {
  greeting: string[];
  farewell: string[];
  interests: string[];
  quirks: string[];
}

const PERSONALITIES: Record<string, AgentPersonality> = {
  trader: {
    greeting: ['Welcome, trader!', 'Ready to make some moves?', 'The markets are volatile today...'],
    farewell: ['May the profits be with you!', 'Trade smart!', 'Remember: HODL!'],
    interests: ['DeFi', 'yield farming', 'arbitrage', 'altcoins'],
    quirks: ['Always mentions market caps', 'Speaks in trading terms', 'Skeptical of NFTs'],
  },
  gamer: {
    greeting: ['Game on!', 'Ready to lose?', 'Let\'s see what you\'ve got!'],
    farewell: ['GG!', 'Rematch anytime!', 'You\'ll need more practice!'],
    interests: ['speedrunning', 'high scores', 'pro strategies', 'esports'],
    quirks: ['Uses gaming slang', 'Always competitive', 'Mentions their high scores'],
  },
  guide: {
    greeting: ['Welcome, traveler!', 'I know this world like the back of my hand.', 'Ask me anything!'],
    farewell: ['Safe travels!', 'Explore every corner!', 'There\'s always more to discover!'],
    interests: ['lore', 'secrets', 'history', 'hidden zones'],
    quirks: ['Speaks cryptically', 'Loves riddles', 'Knows more than they say'],
  },
  quest: {
    greeting: ['Adventurer!', 'I have work for you!', 'Looking for purpose?'],
    farewell: ['May fortune favor you!', 'Complete your quest!', 'Return when done!'],
    interests: ['bounties', 'legends', 'ancient artifacts', 'heroics'],
    quirks: ['Always has a task', 'Rewards-based', 'Very formal'],
  },
  merchant: {
    greeting: ['Welcome, customer!', 'Take a look!', 'Quality goods, fair prices!'],
    farewell: ['Come back anytime!', 'New stock soon!', 'Tell your friends!'],
    interests: ['fashion', 'cosmetics', 'limited editions', 'deals'],
    quirks: ['Always selling', 'Mentions sales', 'Competitive pricing'],
  },
};

// Agent memory - remembers player interactions
interface AgentMemory {
  playerName: string;
  lastVisit: number;
  totalVisits: number;
  questionsAsked: string[];
  servicesUsed: string[];
  notes: string[];
}

// Persistent agent memory (localStorage)
const MEMORY_KEY = 'moltiverse_agent_memory_';

export function useAgentMemory(agentId: string) {
  const [memory, setMemory] = useState<AgentMemory | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(MEMORY_KEY + agentId);
    if (stored) {
      setMemory(JSON.parse(stored));
    } else {
      setMemory({
        playerName: '',
        lastVisit: Date.now(),
        totalVisits: 1,
        questionsAsked: [],
        servicesUsed: [],
        notes: [],
      });
    }
  }, [agentId]);

  const saveMemory = (newMemory: AgentMemory) => {
    localStorage.setItem(MEMORY_KEY + agentId, JSON.stringify(newMemory));
    setMemory(newMemory);
  };

  const addVisit = () => {
    if (!memory) return;
    saveMemory({ ...memory, lastVisit: Date.now(), totalVisits: memory.totalVisits + 1 });
  };

  const addQuestion = (question: string) => {
    if (!memory) return;
    saveMemory({
      ...memory,
      questionsAsked: [...memory.questionsAsked.slice(-9), question],
    });
  };

  const addServiceUsed = (service: string) => {
    if (!memory) return;
    saveMemory({
      ...memory,
      servicesUsed: [...memory.servicesUsed.slice(-4), service],
    });
  };

  const addNote = (note: string) => {
    if (!memory) return;
    saveMemory({
      ...memory,
      notes: [...memory.notes.slice(-2), note],
    });
  };

  return { memory, addVisit, addQuestion, addServiceUsed, addNote };
}

// Contextual agent responses based on personality
export function getAgentResponse(agentType: string, context: 'greeting' | 'farewell'): string {
  const personality = PERSONALITIES[agentType];
  if (!personality) return 'Hello!';

  const responses = personality[context];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Agent activity status
type AgentStatus = 'idle' | 'busy' | 'thinking' | 'away';

interface AgentActivityProps {
  agentId: string;
  agentName: string;
  agentType: string;
  status: AgentStatus;
}

export function AgentActivityIndicator({ agentName, agentType, status }: AgentActivityProps) {
  const statusConfig = {
    idle: { color: '#4ade80', label: 'Online', icon: '●' },
    busy: { color: '#f59e0b', label: 'In Game', icon: '🎮' },
    thinking: { color: '#8b5cf6', label: 'Thinking...', icon: '💭' },
    away: { color: '#6b7280', label: 'Away', icon: '○' },
  };

  const config = statusConfig[status];

  return (
    <div className="agent-activity">
      <span className="status-icon" style={{ color: config.color }}>{config.icon}</span>
      <div className="status-info">
        <span className="agent-name">{agentName}</span>
        <span className="status-label">{config.label}</span>
      </div>
      <style jsx>{`
        .agent-activity {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0,0,0,0.5);
          border-radius: 20px;
        }
        .status-icon {
          font-size: 10px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .status-info {
          display: flex;
          flex-direction: column;
        }
        .agent-name {
          font-size: 11px;
          font-weight: 600;
          color: white;
        }
        .status-label {
          font-size: 9px;
          color: #888;
        }
      `}</style>
    </div>
  );
}

// Personalized greeting based on memory
export function getPersonalizedGreeting(agentType: string, memory: AgentMemory | null): string {
  const baseGreeting = getAgentResponse(agentType, 'greeting');
  
  if (!memory) return baseGreeting;
  
  if (memory.totalVisits > 5) {
    return `Welcome back! You've visited ${memory.totalVisits} times now. ${baseGreeting}`;
  }
  
  if (memory.lastVisit > Date.now() - 3600000) {
    return `Back so soon? ${baseGreeting}`;
  }
  
  return baseGreeting;
}
