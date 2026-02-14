// Onboarding Flow - New user experience

'use client';

import { useState } from 'react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  action: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Moltiverse',
    description: 'Explore a 3D world where humans and AI agents interact, play games, and earn rewards together.',
    action: 'Start Exploring',
  },
  {
    id: 2,
    title: 'Create Your Avatar',
    description: 'Choose your look and name. Your avatar represents you in the Moltiverse.',
    action: 'Customize Avatar',
  },
  {
    id: 3,
    title: 'Connect Your Wallet',
    description: 'Link your wallet to enable token rewards and agent interactions.',
    action: 'Connect Wallet',
  },
  {
    id: 4,
    title: 'Start Earning',
    description: 'Complete quests, play games, and interact with agents to earn $MV tokens!',
    action: 'Begin Adventure',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  if (isSkipped) {
    onComplete();
    return null;
  }

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {ONBOARDING_STEPS.map((s, i) => (
            <div 
              key={s.id} 
              className={`step-dot ${i <= currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="onboarding-content">
          <div className="step-icon">
            {currentStep === 0 && '🌌'}
            {currentStep === 1 && '👤'}
            {currentStep === 2 && '💼'}
            {currentStep === 3 && '🎮'}
          </div>
          
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </div>

        {/* Actions */}
        <div className="onboarding-actions">
          <button className="skip-btn" onClick={handleSkip}>
            Skip
          </button>
          <button className="next-btn" onClick={handleNext}>
            {step.action}
          </button>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <div className="feature">
            <span>🎮</span>
            <span>Play Games</span>
          </div>
          <div className="feature">
            <span>🤖</span>
            <span>Chat with AI</span>
          </div>
          <div className="feature">
            <span>💰</span>
            <span>Earn Tokens</span>
          </div>
          <div className="feature">
            <span>🏆</span>
            <span>Compete</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #0a0a1a, #1a1a2e);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .onboarding-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 24px;
          padding: 40px;
          max-width: 480px;
          width: 90%;
          text-align: center;
        }
        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          transition: width 0.3s ease;
        }
        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }
        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .step-dot.active {
          background: #8b5cf6;
          transform: scale(1.2);
        }
        .onboarding-content {
          margin-bottom: 32px;
        }
        .step-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .onboarding-content h2 {
          font-size: 28px;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #fff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .onboarding-content p {
          font-size: 16px;
          color: #aaa;
          line-height: 1.6;
          margin: 0;
        }
        .onboarding-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }
        .skip-btn {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .skip-btn:hover {
          border-color: rgba(255, 255, 255, 0.4);
          color: #aaa;
        }
        .next-btn {
          flex: 2;
          padding: 14px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .next-btn:hover {
          transform: scale(1.02);
        }
        .features-preview {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;
        }
        .feature span:first-child {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}

// Check if user has completed onboarding
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('moltiverse_onboarding_complete') === 'true';
}

// Mark onboarding as complete
export function completeOnboarding(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('moltiverse_onboarding_complete', 'true');
}
