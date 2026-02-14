// Agent Interaction System - Talk to AI agents in the world

'use client';

import { useState } from 'react';

export interface Agent {
  id: string;
  name: string;
  type: 'trader' | 'gamer' | 'guide' | 'quest' | 'merchant';
  position: [number, number, number];
  color: string;
  description: string;
  services: AgentService[];
}

export interface AgentService {
  name: string;
  description: string;
  cost: bigint; // in $MV
  action: string;
}

export const WORLD_AGENTS: Agent[] = [
  {
    id: 'agent_1',
    name: 'CryptoTrader',
    type: 'trader',
    position: [10, 0, 15],
    color: '#fbbf24',
    description: 'Expert in token trading and DeFi strategies',
    services: [
      { name: 'Trading Tips', description: 'Get personalized trading advice', cost: BigInt('1000000000000000000'), action: 'tip' },
      { name: 'Market Analysis', description: 'Daily market insights', cost: BigInt('5000000000000000000'), action: 'analysis' },
    ],
  },
  {
    id: 'agent_2',
    name: 'TetrisMaster',
    type: 'gamer',
    position: [-15, 0, 20],
    color: '#22c55e',
    description: ' undefeated Tetris champion of Moltiverse',
    services: [
      { name: 'Challenge to Game', description: 'Race against the master', cost: BigInt('1000000000000000000'), action: 'challenge' },
      { name: 'Get Tips', description: 'Learn advanced Tetris strategies', cost: BigInt('500000000000000000'), action: 'teach' },
    ],
  },
  {
    id: 'agent_3',
    name: 'WorldGuide',
    type: 'guide',
    position: [0, 0, -10],
    color: '#3b82f6',
    description: 'Knows all the secrets of Moltiverse',
    services: [
      { name: 'World Tour', description: 'Guided tour of all zones', cost: BigInt('2000000000000000000'), action: 'tour' },
      { name: 'Secret Locations', description: 'Discover hidden areas', cost: BigInt('1000000000000000000'), action: 'secrets' },
    ],
  },
  {
    id: 'agent_4',
    name: 'QuestGiver',
    type: 'quest',
    position: [20, 0, 0],
    color: '#a855f7',
    description: 'Has important missions for brave adventurers',
    services: [
      { name: 'Daily Quest', description: 'Get today\'s quest', cost: BigInt(0), action: 'daily_quest' },
      { name: 'Bounty Hunt', description: 'Find rare items for rewards', cost: BigInt('5000000000000000000'), action: 'bounty' },
    ],
  },
  {
    id: 'agent_5',
    name: 'AvatarShop',
    type: 'merchant',
    position: [-20, 0, -15],
    color: '#ef4444',
    description: 'Sells exclusive skins and accessories',
    services: [
      { name: 'Browse Items', description: 'View available cosmetics', cost: BigInt(0), action: 'shop' },
      { name: 'Custom Design', description: 'Commission a unique skin', cost: BigInt('50000000000000000000'), action: 'custom' },
    ],
  },
];

interface AgentChatProps {
  agent: Agent;
  onClose: () => void;
  onPurchase: (service: AgentService) => void;
}

export function AgentChat({ agent, onClose, onPurchase }: AgentChatProps) {
  const [selectedService, setSelectedService] = useState<AgentService | null>(null);
  const [chatLog, setChatLog] = useState<{ from: string; text: string }[]>([
    { from: agent.name, text: `Greetings! I'm ${agent.name}. ${agent.description}` },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setChatLog(prev => [...prev, { from: 'You', text: input }]);

    // Simple response logic
    setTimeout(() => {
      let response = `Interesting! How can I help you with ${agent.type} matters?`;
      
      if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
        response = `Hello there! Welcome to Moltiverse. I can help you with various services - just browse my offerings!`;
      } else if (input.toLowerCase().includes('help')) {
        response = `I offer ${agent.services.length} services. Click on any service to learn more!`;
      } else if (input.toLowerCase().includes('buy') || input.toLowerCase().includes('purchase')) {
        response = `Great choice! Click on a service to purchase it. I'll execute the action immediately.`;
      }
      
      setChatLog(prev => [...prev, { from: agent.name, text: response }]);
    }, 500);

    setInput('');
  };

  return (
    <div className="agent-chat">
      <div className="chat-header">
        <div className="agent-info">
          <div className="agent-avatar" style={{ background: agent.color }}>
            {agent.name[0]}
          </div>
          <div>
            <h3>{agent.name}</h3>
            <span className="agent-type">{agent.type}</span>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="chat-messages">
        {chatLog.map((msg, i) => (
          <div key={i} className={`message ${msg.from === agent.name ? 'agent' : 'user'}`}>
            <span className="sender">{msg.from}</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-services">
        <h4>Services</h4>
        <div className="services-grid">
          {agent.services.map((service, i) => (
            <button
              key={i}
              className={`service-btn ${selectedService === service ? 'selected' : ''}`}
              onClick={() => setSelectedService(service)}
            >
              <span className="service-name">{service.name}</span>
              <span className="service-cost">
                {service.cost === BigInt(0) ? 'FREE' : `${Number(service.cost) / 1e18} $MV`}
              </span>
            </button>
          ))}
        </div>
        {selectedService && (
          <div className="purchase-section">
            <p>{selectedService.description}</p>
            <button 
              className="purchase-btn"
              onClick={() => onPurchase(selectedService)}
            >
              Purchase {selectedService.cost === BigInt(0) ? '(Free)' : `(${Number(selectedService.cost) / 1e18} $MV)`}
            </button>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <style jsx>{`
        .agent-chat {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 360px;
          height: 500px;
          background: rgba(10, 10, 30, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          z-index: 200;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .agent-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .agent-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }
        .agent-info h3 {
          margin: 0;
          font-size: 16px;
        }
        .agent-type {
          font-size: 12px;
          color: #888;
          text-transform: capitalize;
        }
        .close-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .message {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 12px;
        }
        .message.agent {
          background: rgba(139, 92, 246, 0.2);
          align-self: flex-start;
        }
        .message.user {
          background: rgba(34, 197, 94, 0.2);
          align-self: flex-end;
        }
        .sender {
          font-size: 11px;
          color: #888;
          display: block;
          margin-bottom: 4px;
        }
        .message p {
          margin: 0;
          font-size: 14px;
        }
        .chat-services {
          padding: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          max-height: 150px;
          overflow-y: auto;
        }
        .chat-services h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #888;
        }
        .services-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .service-btn {
          display: flex;
          flex-direction: column;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .service-btn:hover, .service-btn.selected {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }
        .service-name {
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .service-cost {
          font-size: 10px;
          color: #4ade80;
        }
        .purchase-section {
          margin-top: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }
        .purchase-section p {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #aaa;
        }
        .purchase-btn {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
        .chat-input {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .chat-input input {
          flex: 1;
          padding: 10px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          outline: none;
        }
        .chat-input button {
          padding: 10px 16px;
          background: #8b5cf6;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
