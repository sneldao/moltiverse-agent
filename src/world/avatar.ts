// Avatar types and customization
export type AvatarType = 'human' | 'robot' | 'crystal' | 'spirit';
export type AvatarColor = 'cyan' | 'purple' | 'green' | 'orange' | 'pink';

export interface AvatarConfig {
  type: AvatarType;
  color: AvatarColor;
  name: string;
}

export const AVATAR_COLORS: Record<AvatarColor, string> = {
  cyan: '#06b6d4',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f59e0b',
  pink: '#ec4899',
};

export const AVATAR_TYPES: Record<AvatarType, { icon: string; description: string }> = {
  human: { icon: '👤', description: 'Balanced stats' },
  robot: { icon: '🤖', description: '+20% speed' },
  crystal: { icon: '💎', description: '+15% jump' },
  spirit: { icon: '👻', description: '+25% collect range' },
};

export const DEFAULT_AVATAR: AvatarConfig = {
  type: 'human',
  color: 'cyan',
  name: 'Explorer',
};

// Avatar stats
export function getAvatarStats(avatar: AvatarConfig) {
  const baseStats = {
    speed: 0.2,
    jumpForce: 0.3,
    collectRange: 3,
  };

  switch (avatar.type) {
    case 'robot':
      return { ...baseStats, speed: baseStats.speed * 1.2 };
    case 'crystal':
      return { ...baseStats, jumpForce: baseStats.jumpForce * 1.15 };
    case 'spirit':
      return { ...baseStats, collectRange: baseStats.collectRange * 1.25 };
    default:
      return baseStats;
  }
}
