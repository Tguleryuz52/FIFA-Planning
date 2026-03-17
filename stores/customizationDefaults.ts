// Types defined inline to avoid circular dependency with playerStore
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Avatar {
    id: string;
    emoji: string;
    name: string;
    rarity: Rarity;
    unlocked: boolean;
    unlockRequirement?: {
        type: 'achievement' | 'stat' | 'streak' | 'quest_count' | 'gen';
        description: string;
        value: string | number;
    };
}

export interface Outfit {
    id: string;
    name: string;
    type: 'badge' | 'frame' | 'background' | 'effect';
    visual: string;
    rarity: Rarity;
    unlocked: boolean;
    unlockRequirement?: {
        type: 'quest_count' | 'gen' | 'stat' | 'streak';
        description: string;
        value: number;
    };
}

export interface CardTheme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    gradient?: string;
    unlocked: boolean;
    unlockRequirement?: {
        type: 'achievement' | 'gen' | 'stat' | 'streak' | 'quest_count';
        description: string;
        value: number | string;
    };
}

// Default Avatars (20 total)
export const defaultAvatars: Avatar[] = [
    // Common - Always Unlocked (5)
    { id: 'avatar-soccer', emoji: '⚽', name: 'Soccer Ball', rarity: 'common', unlocked: true },
    { id: 'avatar-player', emoji: '👤', name: 'Player', rarity: 'common', unlocked: true },
    { id: 'avatar-gamer', emoji: '🎮', name: 'Gamer', rarity: 'common', unlocked: true },
    { id: 'avatar-professional', emoji: '💼', name: 'Professional', rarity: 'common', unlocked: true },
    { id: 'avatar-runner', emoji: '🏃', name: 'Runner', rarity: 'common', unlocked: true },

    // Rare - Unlock Requirements (7)
    {
        id: 'avatar-trophy',
        emoji: '🏆',
        name: 'Trophy',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'quest_count', description: 'Complete 10 quests', value: 10 }
    },
    {
        id: 'avatar-fire',
        emoji: '🔥',
        name: 'Fire',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'streak', description: '7-day streak', value: 7 }
    },
    {
        id: 'avatar-star',
        emoji: '⭐',
        name: 'Star',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 70+', value: 70 }
    },
    {
        id: 'avatar-strong',
        emoji: '💪',
        name: 'Strong',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'stat', description: 'PHY 70+', value: 'PHY:70' }
    },
    {
        id: 'avatar-brain',
        emoji: '🧠',
        name: 'Brain',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'stat', description: 'MEN 70+', value: 'MEN:70' }
    },
    {
        id: 'avatar-target',
        emoji: '🎯',
        name: 'Target',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'stat', description: 'DIS 70+', value: 'DIS:70' }
    },
    {
        id: 'avatar-coder',
        emoji: '💻',
        name: 'Coder',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'stat', description: 'PRO 75+', value: 'PRO:75' }
    },

    // Epic - Hard to unlock (5)
    {
        id: 'avatar-crown',
        emoji: '👑',
        name: 'Crown',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 80+', value: 80 }
    },
    {
        id: 'avatar-diamond',
        emoji: '💎',
        name: 'Diamond',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'streak', description: '30-day streak', value: 30 }
    },
    {
        id: 'avatar-rocket',
        emoji: '🚀',
        name: 'Rocket',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'All stats 70+', value: 'ALL:70' }
    },
    {
        id: 'avatar-lightning',
        emoji: '⚡',
        name: 'Lightning',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'quest_count', description: 'Complete 50 quests', value: 50 }
    },
    {
        id: 'avatar-shining-star',
        emoji: '🌟',
        name: 'Shining Star',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'achievement', description: '5 PlayStyles unlocked', value: 5 }
    },

    // Legendary - Very Hard (3)
    {
        id: 'avatar-medal',
        emoji: '🏅',
        name: 'Medal',
        rarity: 'legendary',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 90+', value: 90 }
    },
    {
        id: 'avatar-trident',
        emoji: '🔱',
        name: 'Trident',
        rarity: 'legendary',
        unlocked: false,
        unlockRequirement: { type: 'streak', description: '100-day streak', value: 100 }
    },
    {
        id: 'avatar-alien',
        emoji: '👾',
        name: 'Alien',
        rarity: 'legendary',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'All stats 85+', value: 'ALL:85' }
    },
];

// Default Card Themes (8 total)
export const defaultCardThemes: CardTheme[] = [
    // Always Unlocked (3)
    {
        id: 'theme-classic',
        name: 'Classic',
        colors: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#34d399',
            background: 'rgba(16, 185, 129, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        unlocked: true,
    },
    {
        id: 'theme-dark',
        name: 'Dark Mode',
        colors: {
            primary: '#1e40af',
            secondary: '#1e3a8a',
            accent: '#3b82f6',
            background: 'rgba(30, 64, 175, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #1e40af 0%, #000000 100%)',
        unlocked: true,
    },
    {
        id: 'theme-sunset',
        name: 'Sunset',
        colors: {
            primary: '#f97316',
            secondary: '#c2410c',
            accent: '#fb923c',
            background: 'rgba(249, 115, 22, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #f97316 0%, #a855f7 100%)',
        unlocked: true,
    },

    // Unlockable (5)
    {
        id: 'theme-gold',
        name: 'Gold',
        colors: {
            primary: '#eab308',
            secondary: '#ca8a04',
            accent: '#fde047',
            background: 'rgba(234, 179, 8, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 80+', value: 80 },
    },
    {
        id: 'theme-neon',
        name: 'Neon',
        colors: {
            primary: '#ec4899',
            secondary: '#db2777',
            accent: '#f472b6',
            background: 'rgba(236, 72, 153, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
        unlocked: false,
        unlockRequirement: { type: 'streak', description: '30-day streak', value: 30 },
    },
    {
        id: 'theme-royal',
        name: 'Royal',
        colors: {
            primary: '#7c3aed',
            secondary: '#6d28d9',
            accent: '#a78bfa',
            background: 'rgba(124, 58, 237, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #eab308 100%)',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'All stats 75+', value: 'ALL:75' },
    },
    {
        id: 'theme-ice',
        name: 'Ice',
        colors: {
            primary: '#06b6d4',
            secondary: '#0891b2',
            accent: '#22d3ee',
            background: 'rgba(6, 182, 212, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #ffffff 100%)',
        unlocked: false,
        unlockRequirement: { type: 'stat', description: 'PHY 85+', value: 85 },
    },
    {
        id: 'theme-fire',
        name: 'Fire',
        colors: {
            primary: '#ef4444',
            secondary: '#dc2626',
            accent: '#f87171',
            background: 'rgba(239, 68, 68, 0.1)',
        },
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        unlocked: false,
        unlockRequirement: { type: 'quest_count', description: 'Complete 50 quests', value: 50 },
    },
];

// Default Outfits (10 total)
export const defaultOutfits: Outfit[] = [
    // Badges
    {
        id: 'badge-bronze',
        name: 'Bronze Badge',
        type: 'badge',
        visual: '🥉',
        rarity: 'common',
        unlocked: false,
        unlockRequirement: { type: 'quest_count', description: 'Complete 10 quests', value: 10 },
    },
    {
        id: 'badge-silver',
        name: 'Silver Badge',
        type: 'badge',
        visual: '🥈',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'quest_count', description: 'Complete 25 quests', value: 25 },
    },
    {
        id: 'badge-gold',
        name: 'Gold Badge',
        type: 'badge',
        visual: '🥇',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'quest_count', description: 'Complete 50 quests', value: 50 },
    },
    {
        id: 'badge-diamond',
        name: 'Diamond Badge',
        type: 'badge',
        visual: '💠',
        rarity: 'legendary',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 85+', value: 85 },
    },

    // Frames
    {
        id: 'frame-simple',
        name: 'Simple Border',
        type: 'frame',
        visual: 'border-2 border-white/20',
        rarity: 'common',
        unlocked: true,
    },
    {
        id: 'frame-glowing',
        name: 'Glowing Border',
        type: 'frame',
        visual: 'border-2 border-blue-500 shadow-lg shadow-blue-500/50',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 70+', value: 70 },
    },
    {
        id: 'frame-rainbow',
        name: 'Animated Rainbow',
        type: 'frame',
        visual: 'border-4 border-gradient-animated',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'streak', description: '30-day streak', value: 30 },
    },
    {
        id: 'frame-legendary',
        name: 'Legendary Frame',
        type: 'frame',
        visual: 'border-4 border-yellow-500 shadow-2xl shadow-yellow-500/70',
        rarity: 'legendary',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 90+', value: 90 },
    },

    // Backgrounds
    {
        id: 'bg-stars',
        name: 'Starry Background',
        type: 'background',
        visual: 'bg-stars',
        rarity: 'rare',
        unlocked: false,
        unlockRequirement: { type: 'streak', description: '14-day streak', value: 14 },
    },
    {
        id: 'bg-particles',
        name: 'Particle Effect',
        type: 'background',
        visual: 'particles-enabled',
        rarity: 'epic',
        unlocked: false,
        unlockRequirement: { type: 'gen', description: 'Reach GEN 80+', value: 80 },
    },
];
