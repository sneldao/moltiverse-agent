// Mobile Responsive Utilities

// Responsive breakpoint hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Mobile-first responsive classes
export const mobileStyles = `
  /* Base mobile styles */
  .mobile-hidden { display: none; }
  
  @media (min-width: 768px) {
    .mobile-hidden { display: inherit; }
    .desktop-only { display: none; }
  }
  
  /* Touch-friendly tap targets */
  .tap-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Swipe gestures */
  .swipe-container {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  
  .swipe-item {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  
  /* Bottom navigation for mobile */
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
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .bottom-nav-item.active {
    color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
  }
  
  .bottom-nav-item:active {
    transform: scale(0.95);
  }
  
  /* Pull to refresh indicator */
  .pull-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #888;
    font-size: 14px;
  }
  
  /* Pinch to zoom container */
  .pinch-zoom {
    touch-action: pan-x pan-y pinch-zoom;
  }
  
  /* Safe area padding */
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
  
  .safe-top {
    padding-top: env(safe-area-inset-top, 20px);
  }
  
  /* Responsive grid */
  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  
  @media (min-width: 640px) {
    .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  
  @media (min-width: 768px) {
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  
  @media (min-width: 1024px) {
    .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  
  /* Responsive text */
  .text-responsive {
    font-size: clamp(14px, 2vw, 18px);
  }
  
  /* Responsive padding */
  .p-responsive {
    padding: clamp(12px, 3vw, 24px);
  }
  
  /* Hide scrollbar but keep functionality */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Landscape mode adjustments */
  @media (max-height: 500px) and (orientation: landscape) {
    .landscape-stacked {
      flex-direction: row !important;
    }
  }
`;

// Orientation-aware component
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return orientation;
}

// Touch gesture hook
export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return;
      
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart.current - touchEnd;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0 && onSwipeLeft) onSwipeLeft();
        else if (diff < 0 && onSwipeRight) onSwipeRight();
      }
      
      touchStart.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
}

import { useState, useEffect, useRef } from 'react';
