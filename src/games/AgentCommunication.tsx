// Agent Communication System - Voice & Text

'use client';

import { useState, useEffect, useRef } from 'react';

// Agent voice/speech synthesis
export function useAgentVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string, rate = 1) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Select a good voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking, voiceEnabled, setVoiceEnabled };
}

// Agent message with typing indicator
interface AgentMessageProps {
  agentName: string;
  agentIcon: string;
  message: string;
  isTyping?: boolean;
  timestamp?: Date;
  onComplete?: () => void;
}

export function AgentMessage({ agentName, agentIcon, message, isTyping, timestamp }: AgentMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedText(message.slice(0, i + 1));
        i++;
      } else {
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="agent-message">
      <div className="agent-avatar">
        <span className="avatar-icon">{agentIcon}</span>
        <span className="status-dot" />
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="agent-name">{agentName}</span>
          {timestamp && (
            <span className="timestamp">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className="message-text">
          {displayedText}
          {isTyping && <span className="typing-indicator">|</span>}
        </div>
      </div>
      <style jsx>{`
        .agent-message {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }
        .agent-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border-radius: 50%;
        }
        .avatar-icon {
          font-size: 20px;
        }
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border: 2px solid #1a1a2e;
          border-radius: 50%;
        }
        .message-content {
          flex: 1;
        }
        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .agent-name {
          font-size: 14px;
          font-weight: 600;
          color: #8b5cf6;
        }
        .timestamp {
          font-size: 11px;
          color: #666;
        }
        .message-text {
          font-size: 14px;
          color: #ddd;
          line-height: 1.5;
        }
        .typing-indicator {
          animation: blink 0.7s infinite;
          color: #8b5cf6;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Quick reply suggestions
export function QuickReplies({ 
  replies, 
  onSelect 
}: { 
  replies: string[]; 
  onSelect: (reply: string) => void;
}) {
  return (
    <div className="quick-replies">
      {replies.map((reply, i) => (
        <button 
          key={i} 
          className="quick-reply"
          onClick={() => onSelect(reply)}
        >
          {reply}
        </button>
      ))}
      <style jsx>{`
        .quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .quick-reply {
          padding: 8px 16px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          color: #a78bfa;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-reply:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

// Agent command palette
export function CommandPalette({ 
  commands, 
  onSelect,
  isOpen,
  onClose
}: { 
  commands: { id: string; label: string; icon: string; action: string }[];
  onSelect: (command: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelected(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        setSelected(s => (s + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        setSelected(s => (s - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && filtered[selected]) {
        onSelect(filtered[selected].action);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, selected, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Type a command..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        <div className="commands-list">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`command ${i === selected ? 'selected' : ''}`}
              onClick={() => {
                onSelect(cmd.action);
                onClose();
              }}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="icon">{cmd.icon}</span>
              <span className="label">{cmd.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .command-palette-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
          z-index: 9999;
        }
        .command-palette {
          width: 500px;
          max-width: 90vw;
          background: #1a1a2e;
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          overflow: hidden;
        }
        input {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 16px;
          outline: none;
        }
        .commands-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .command {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: white;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
        }
        .command.selected {
          background: rgba(139, 92, 246, 0.2);
        }
        .icon {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
}

// Voice input component
export function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) onTranscript(transcript);
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
    if (transcript) onTranscript(transcript);
  };

  return (
    <button 
      className={`voice-input ${isListening ? 'listening' : ''}`}
      onClick={isListening ? stopListening : startListening}
    >
      <span className="mic-icon">{isListening ? '🔴' : '🎤'}</span>
      {isListening && <span className="pulse-ring" />}
      <style jsx>{`
        .voice-input {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mic-icon {
          font-size: 20px;
        }
        .listening {
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </button>
  );
}
