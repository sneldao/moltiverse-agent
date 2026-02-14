// Toast Notification System - Better user feedback

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
          max-width: 360px;
        }
      `}</style>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
  };

  return (
    <div 
      className="toast-item"
      style={{ 
        borderLeftColor: colors[toast.type],
        background: `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,40,0.95))`,
      }}
    >
      <span className="toast-icon" style={{ color: colors[toast.type] }}>
        {icons[toast.type]}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
      
      <style jsx>{`
        .toast-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          border-left: 4px solid;
          backdrop-filter: blur(10px);
          animation: slideIn 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .toast-icon {
          font-size: 18px;
          font-weight: bold;
        }
        .toast-message {
          flex: 1;
          font-size: 14px;
          color: white;
          line-height: 1.4;
        }
        .toast-close {
          background: none;
          border: none;
          color: #888;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .toast-close:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
