// Bottom Navigation - Mobile-friendly navigation

'use client';

import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

interface BottomNavProps {
  items: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
}

export function BottomNav({ items, active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding: 12px 8px;
          background: rgba(10, 10, 30, 0.95);
          border-top: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          z-index: 100;
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 12px;
          color: #888;
          font-size: 11px;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bottom-nav-item.active {
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }
        .bottom-nav-item:active {
          transform: scale(0.95);
        }
        .nav-icon {
          font-size: 20px;
        }
        .nav-label {
          font-weight: 500;
        }
      `}</style>
    </nav>
  );
}

// Tab bar for desktop
export function TabBar({ tabs, activeTab, onChange }: { 
  tabs: { id: string; label: string }[]; 
  activeTab: string; 
  onChange: (id: string) => void;
}) {
  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      <style jsx>{`
        .tab-bar {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
        }
        .tab {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab:hover {
          color: #aaa;
        }
        .tab.active {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }
      `}</style>
    </div>
  );
}

// Breadcrumb navigation
export function Breadcrumbs({ items, onNavigate }: {
  items: { id: string; label: string }[];
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.id} className="breadcrumb-item">
          {i > 0 && <span className="separator">/</span>}
          <button onClick={() => onNavigate(item.id)}>
            {item.label}
          </button>
        </span>
      ))}
      <style jsx>{`
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        .separator {
          color: #666;
        }
        .breadcrumb-item button {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .breadcrumb-item button:hover {
          color: #aaa;
          background: rgba(255,255,255,0.05);
        }
        .breadcrumb-item:last-child button {
          color: #8b5cf6;
          cursor: default;
        }
      `}</style>
    </nav>
  );
}
