// Animation utilities - CSS classes for smooth transitions

// These are utility classes to be used with global CSS or Tailwind

export const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

export const slideIn = `
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up {
    animation: slideInUp 0.4s ease-out forwards;
  }
`;

export const pulse = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .animate-pulse {
    animation: pulse 2s infinite;
  }
`;

export const bounce = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce {
    animation: bounce 1s infinite;
  }
`;

export const spin = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

export const glow = `
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px #8b5cf6, 0 0 10px #8b5cf6; }
    50% { box-shadow: 0 0 20px #8b5cf6, 0 0 30px #8b5cf6; }
  }
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
`;

export const shimmer = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.1),
      transparent
    );
    animation: shimmer 2s infinite;
  }
`;

export const float = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

// Add all animations to CSS
export const allAnimations = `
  ${fadeIn}
  ${slideIn}
  ${pulse}
  ${bounce}
  ${spin}
  ${glow}
  ${shimmer}
  ${float}
  
  .transition-all {
    transition: all 0.2s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.02);
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  
  .duration-300 {
    transition-duration: 300ms;
  }
  
  .ease-out {
    transition-timing-function: ease-out;
  }
`;

// Stagger animation delays
export const staggerDelay = (index: number, base: number = 0.05) => ({
  animationDelay: `${index * base}s`,
});
