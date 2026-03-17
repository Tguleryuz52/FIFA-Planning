// FIFA Life Design System - Colors
// Ported from web's globals.css CSS variables

export const colors = {
  // Background colors
  bg: {
    primary: '#050508',
    secondary: '#0a0a10',
    card: 'rgba(15, 15, 25, 0.85)',
    cardHover: 'rgba(25, 25, 40, 0.9)',
  },

  // Accent colors
  accent: {
    gold: '#FFD700',
    goldDim: '#C9A227',
    neon: '#00FF88',
    blue: '#00D4FF',
    purple: '#A855F7',
    danger: '#FF4444',
    warning: '#FFAA00',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.4)',
  },

  // Stat colors (for CircularStat and StatCard)
  stat: {
    low: '#FF4444',      // 0-49
    mid: '#FFAA00',      // 50-69
    high: '#00FF88',     // 70-79
    elite: '#FFD700',    // 80+
  },

  // Glass effect
  glass: {
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
  },

  // Kondisyon bar colors
  kondisyon: {
    high: ['#00FF88', '#00CC6A'],   // 70+
    mid: ['#FFAA00', '#CC8800'],    // 40-69
    low: ['#FF4444', '#CC3333'],    // 0-39
  },

  // Quest type colors
  quest: {
    main: '#FFD700',      // Gold
    side: '#00D4FF',      // Blue
    special: '#A855F7',   // Purple/Legendary
  },

  // Rarity colors
  rarity: {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#FFD700',
  },
};

// Get stat color based on value
export const getStatColor = (value: number): string => {
  if (value >= 80) return colors.stat.elite;
  if (value >= 70) return colors.stat.high;
  if (value >= 50) return colors.stat.mid;
  return colors.stat.low;
};

// Get kondisyon color based on value
export const getKondisyonColors = (value: number): string[] => {
  if (value >= 70) return colors.kondisyon.high;
  if (value >= 40) return colors.kondisyon.mid;
  return colors.kondisyon.low;
};

// Gradient definitions for LinearGradient component
export const gradients = {
  gold: ['#FFD700', '#FFA500', '#FFD700'],
  neon: ['#00FF88', '#00CC6A'],
  blue: ['#00D4FF', '#0066FF'],
  purple: ['#A855F7', '#7C3AED'],
  danger: ['#FF4444', '#CC2222'],
  warning: ['#FFAA00', '#FF8800'],
  premium: ['#FFD700', '#FFA500', '#A855F7'],
  dark: ['#0a0a10', '#050508'],
  glass: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'],
};

export default colors;
