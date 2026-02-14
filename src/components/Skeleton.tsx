// Loading Skeleton - Polished loading states

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '' }: SkeletonProps) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton height="200px" borderRadius="12px" />
      <div className="content">
        <Skeleton width="60%" height="24px" />
        <Skeleton width="80%" height="16px" />
        <div className="footer">
          <Skeleton width="80px" height="32px" borderRadius="6px" />
          <Skeleton width="80px" height="32px" borderRadius="6px" />
        </div>
      </div>
      <style jsx>{`
        .card-skeleton {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

// Button skeleton
export function ButtonSkeleton({ width = '120px' }: { width?: string }) {
  return <Skeleton width={width} height="44px" borderRadius="10px" />;
}

// Avatar skeleton
export function AvatarSkeleton({ size = '48px' }: { size?: string }) {
  return (
    <Skeleton 
      width={size} 
      height={size} 
      borderRadius="50%" 
    />
  );
}

// Text skeleton with multiple lines
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="text-skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 ? '60%' : '100%'} 
          height="14px" 
        />
      ))}
      <style jsx>{`
        .text-skeleton {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

// Dashboard stats skeleton
export function StatsSkeleton() {
  return (
    <div className="stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="stat-item">
          <Skeleton width="40px" height="40px" borderRadius="8px" />
          <div className="stat-content">
            <Skeleton width="60px" height="28px" />
            <Skeleton width="80px" height="14px" />
          </div>
        </div>
      ))}
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px;
        }
        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}

// Full page loading state
export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="logo">
          <span className="logo-icon">🌌</span>
        </div>
        <Skeleton width="200px" height="32px" />
        <TextSkeleton lines={2} />
        <div className="loader-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
      <style jsx>{`
        .page-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #020617;
        }
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .logo {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border-radius: 20px;
          animation: pulse 2s infinite;
        }
        .logo-icon {
          font-size: 40px;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .loader-dots {
          display: flex;
          gap: 4px;
          font-size: 24px;
          color: #8b5cf6;
        }
        .loader-dots span {
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .loader-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loader-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
