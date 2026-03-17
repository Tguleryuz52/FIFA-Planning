import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultAvatars, defaultCardThemes, defaultOutfits } from './customizationDefaults';

// Types
export type StatType = 'PRO' | 'PHY' | 'MEN' | 'DIS';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface PlayStyle {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress: number;
  streakDays: number;
  requiredDays: number;
  effect: {
    type: 'multiplier' | 'bonus' | 'shield';
    stat?: StatType;
    value: number;
  };
  expiresAt?: string;
}

export interface DayRecord {
  date: string;
  stats: Record<StatType, number>;
  tpGained: Record<StatType, number>;
  gen: number;
  marketValue: number;
  kondisyon: number;
  activePlayStyles: string[];
  notes?: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  deadline: string;
  reward: {
    type: 'base_value_increase' | 'playstyle_unlock' | 'tp_bonus';
    value: number;
  };
  progress: number;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'training' | 'personal' | 'work' | 'other';
  createdAt: string;
  updatedAt: string;
}

// Skill Tree Types
export type SkillCategory = 'technical' | 'creative' | 'business' | 'personal' | 'other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  xp: number;
  xpToNextLevel: number;
  icon: string;
  description?: string;
  color: string;
  createdAt: string;
  lastUpdated: string;
}

export const calculateXPForLevel = (level: number): number => {
  return Math.max(100, level * 100);
};

// Sub-Stats System Types
export interface SubStat {
  id: string;
  name: string;
  value: number;
  parentStat: StatType;
  weight: number;
  description?: string;
}

// Vitality System Types
export interface VitalityRecord {
  date: string;
  success: boolean;
  tpAwarded: number;
  streakDay: number;
  note?: string;
}

export interface VitalityTracker {
  id: string;
  name: string;
  description: string;
  icon: string;
  currentStreak: number;
  consecutiveFailures: number;
  customRewards: number[];
  history: VitalityRecord[];
  totalCompletions: number;
  longestStreak: number;
  linkedStat: StatType;
  isActive: boolean;
  createdAt: string;
}

export const getVitalityTPReward = (tracker: VitalityTracker, streakDay: number): number => {
  if (streakDay < 1 || streakDay > 7) return 0;
  return tracker.customRewards[streakDay - 1] || 0;
};

// RPG Quest System Types
export type QuestType = 'MAIN' | 'SIDE' | 'SPECIAL';
export type QuestRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type QuestDifficulty = 1 | 2 | 3 | 4 | 5;

export interface Quest {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  rarity: QuestRarity;
  rewards: { stat: StatType; tp: number }[];
  category?: StatType;
  tpReward?: number;
  bonusRewards?: {
    stats?: Partial<Record<StatType, number>>;
    unlocks?: string[];
  };
  completedToday: boolean;
  totalCompletions: number;
  completedAt?: string;
  prerequisites?: string[];
  isChainQuest?: boolean;
  chainProgress?: number;
  chainTotal?: number;
  isCustom?: boolean;
  expiresAt?: string;
  tags?: string[];
}

export type DailyQuest = Quest;

export interface QuestProgress {
  date: string;
  completedCount: number;
  streak: number;
  lastCompletedDate: string;
  comboMultiplier: number;
}

export interface QuestStats {
  mainCompleted: number;
  sideCompleted: number;
  specialCompleted: number;
  totalCompleted: number;
  currentStreak: number;
  bestStreak: number;
}

export interface QuestCompletionRecord {
  date: string;
  completedQuestIds: string[];
  totalTP: number;
}

export interface RecentTPActivity {
  stat: StatType;
  amount: number;
  timestamp: number;
}

export interface TodaySummary {
  date: string;
  dateFormatted: string;
  completedQuests: Quest[];
  totalQuestsCount: number;
  totalTPEarned: number;
  tpByStats: Record<StatType, number>;
}

export interface Settings {
  theme: 'dark' | 'light';
  notifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
}

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

export interface PlayerCustomization {
  selectedAvatar: string;
  selectedOutfits: {
    badge?: string;
    frame?: string;
    background?: string;
    effect?: string;
  };
  selectedTheme: string;
  unlockedAvatars: string[];
  unlockedOutfits: string[];
  unlockedThemes: string[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  streakFreezes: number;
  streakHistory: string[];
}

export interface EnergyState {
  current: number;
  max: number;
  lastBreak: string;
  breakCount: number;
}

export type MoodType = 'great' | 'ok' | 'tired' | 'bad' | 'stressed';

export interface DailyMood {
  date: string;
  mood: MoodType;
  emoji: string;
  tpModifier: number;
}

// Default PlayStyles
const defaultPlayStyles: PlayStyle[] = [
  {
    id: 'ui-maestro',
    name: 'UI Maestro',
    icon: '🎨',
    description: '7 gün kesintisiz tasarım/kod çalışması',
    unlocked: false,
    progress: 0,
    streakDays: 0,
    requiredDays: 7,
    effect: { type: 'multiplier', stat: 'PRO', value: 1.15 },
  },
  {
    id: 'clean-sheet-king',
    name: 'Clean Sheet King',
    icon: '🛡️',
    description: '7 gün tetikleyicilere yenilmemek',
    unlocked: false,
    progress: 0,
    streakDays: 0,
    requiredDays: 7,
    effect: { type: 'shield', stat: 'DIS', value: 5 },
  },
  {
    id: 'power-header',
    name: 'Power Header',
    icon: '⚡',
    description: '06:00 uyanış + spor',
    unlocked: false,
    progress: 0,
    streakDays: 0,
    requiredDays: 1,
    effect: { type: 'multiplier', value: 1.1 },
  },
];

// Default Contracts
const defaultContracts: Contract[] = [
  {
    id: 'q1-mvp',
    title: 'Feron MVP Launch',
    description: 'Q1 2025 sonuna kadar Feron MVP\'yi yayınla',
    deadline: '2025-03-31',
    reward: { type: 'base_value_increase', value: 1.5 },
    progress: 0,
    completed: false,
  },
];

// Default Quests
const defaultDailyQuests: DailyQuest[] = [
  {
    id: 'focus-block-1',
    title: 'Focus Block I (90 dk Tam Odak)',
    description: 'Kesintisiz 90 dakika derin odaklanma.',
    icon: '⚔️',
    type: 'MAIN',
    difficulty: 4,
    rarity: 'EPIC',
    rewards: [
      { stat: 'PRO', tp: 7 },
      { stat: 'DIS', tp: 3 },
    ],
    completedToday: false,
    totalCompletions: 0,
  },
  {
    id: 'heavy-lifting',
    title: 'Heavy Lifting (Antrenman)',
    description: 'Ağırlık kaldırma veya yoğun fiziksel antrenman.',
    icon: '💪',
    type: 'MAIN',
    difficulty: 4,
    rarity: 'EPIC',
    rewards: [
      { stat: 'PHY', tp: 10 },
      { stat: 'DIS', tp: 5 },
    ],
    completedToday: false,
    totalCompletions: 0,
  },
  {
    id: 'aesthetic-care',
    title: 'Aesthetic Care (Bakım & Hijyen)',
    description: 'Günlük bakım rutini: Duş, tıraş, kişisel bakım.',
    icon: '✨',
    type: 'MAIN',
    difficulty: 1,
    rarity: 'COMMON',
    rewards: [{ stat: 'DIS', tp: 3 }],
    completedToday: false,
    totalCompletions: 0,
  },
  {
    id: 'outdoor-pulse',
    title: 'Outdoor Pulse (Dışarı Çıkma)',
    description: 'Zihin boşaltma için dışarıda vakit geçir.',
    icon: '🌳',
    type: 'MAIN',
    difficulty: 2,
    rarity: 'COMMON',
    rewards: [
      { stat: 'MEN', tp: 3 },
      { stat: 'PHY', tp: 1 },
    ],
    completedToday: false,
    totalCompletions: 0,
  },
  {
    id: 'the-reader',
    title: 'The Reader (25 dk)',
    description: 'Zihnini açacak kitap veya makale okuma.',
    icon: '📚',
    type: 'SIDE',
    difficulty: 2,
    rarity: 'RARE',
    rewards: [{ stat: 'MEN', tp: 5 }],
    completedToday: false,
    totalCompletions: 0,
  },
];

// Default Special Objectives
const defaultSpecialObjectives: DailyQuest[] = [
  {
    id: 'the-grind-mode',
    title: 'The Grind Mode (10 Saat)',
    description: 'EFSANEVI: Tek konuda ara vermeden 10 saat çalışmak.',
    icon: '👑',
    type: 'SPECIAL',
    difficulty: 5,
    rarity: 'LEGENDARY',
    rewards: [
      { stat: 'PRO', tp: 30 },
      { stat: 'DIS', tp: 20 },
    ],
    completedToday: false,
    totalCompletions: 0,
    bonusRewards: { stats: { PRO: 2, DIS: 2 } },
  },
];

// Default Skills
const defaultSkills: Skill[] = [
  {
    id: '3d-art-visualization',
    name: '3D Art & Visualization',
    category: 'technical',
    level: 70,
    xp: 0,
    xpToNextLevel: calculateXPForLevel(70),
    icon: '🎨',
    description: 'Blender yetkinliği, modelleme',
    color: 'purple',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'ui-ux-product-design',
    name: 'UI/UX & Product Design',
    category: 'creative',
    level: 60,
    xp: 0,
    xpToNextLevel: calculateXPForLevel(60),
    icon: '✨',
    description: 'Feron Glassmorphism',
    color: 'blue',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

// Default Sub-Stats
const defaultSubStats: SubStat[] = [
  { id: 'pro-design', name: 'Design', value: 75, parentStat: 'PRO', weight: 0.30, description: 'Blender & UI' },
  { id: 'pro-business', name: 'Business', value: 65, parentStat: 'PRO', weight: 0.25, description: 'Girişim Vizyonu' },
  { id: 'pro-coding', name: 'Coding', value: 55, parentStat: 'PRO', weight: 0.25, description: 'Next.js & C++' },
  { id: 'pro-leadership', name: 'Leadership', value: 60, parentStat: 'PRO', weight: 0.20, description: 'Liderlik' },
  { id: 'phy-strength', name: 'Strength', value: 75, parentStat: 'PHY', weight: 0.30, description: 'Heavy Lifting' },
  { id: 'phy-nutrition', name: 'Nutrition', value: 65, parentStat: 'PHY', weight: 0.25, description: 'Beslenme' },
  { id: 'phy-stamina', name: 'Stamina', value: 62, parentStat: 'PHY', weight: 0.25, description: 'Dayanıklılık' },
  { id: 'phy-vitality', name: 'Sleep/Vitality', value: 60, parentStat: 'PHY', weight: 0.20, description: 'Uyku' },
  { id: 'men-creativity', name: 'Creativity', value: 72, parentStat: 'MEN', weight: 0.30, description: 'Proje Fikirleri' },
  { id: 'men-learning', name: 'Learning', value: 68, parentStat: 'MEN', weight: 0.25, description: 'Hızlı Kavrama' },
  { id: 'men-focus', name: 'Focus', value: 55, parentStat: 'MEN', weight: 0.25, description: 'Focus Block' },
  { id: 'men-stress', name: 'Stress Mgmt', value: 50, parentStat: 'MEN', weight: 0.20, description: 'Stres Yönetimi' },
  { id: 'dis-habits', name: 'Habits', value: 58, parentStat: 'DIS', weight: 0.28, description: 'Alışkanlıklar' },
  { id: 'dis-routine', name: 'Routine', value: 55, parentStat: 'DIS', weight: 0.27, description: 'Günlük Rutin' },
  { id: 'dis-willpower', name: 'Willpower', value: 52, parentStat: 'DIS', weight: 0.25, description: 'İrade' },
  { id: 'dis-consistency', name: 'Consistency', value: 50, parentStat: 'DIS', weight: 0.20, description: 'Tutarlılık' },
];

// Player State Interface
interface PlayerState {
  playerName: string;
  position: string;
  age: number;
  avatarUrl: string;
  stats: Record<StatType, number>;
  previousStats: Record<StatType, number>;
  tpPools: Record<StatType, number>;
  kondisyon: number;
  injury: { active: boolean; type: string; daysRemaining: number } | null;
  baseMarketValue: number;
  history: DayRecord[];
  playStyles: PlayStyle[];
  contracts: Contract[];
  newsItems: string[];
  dailyCommentary: string;
  notes: Note[];
  skills: Skill[];
  subStats: SubStat[];
  vitalityTrackers: VitalityTracker[];
  quests: Quest[];
  dailyQuests: DailyQuest[];
  specialObjectives: DailyQuest[];
  questProgress: QuestProgress;
  questStats: QuestStats;
  questCompletionHistory: QuestCompletionRecord[];
  settings: Settings;
  streakData: StreakData;
  customization: PlayerCustomization;
  avatars: Avatar[];
  outfits: Outfit[];
  cardThemes: CardTheme[];
  energy: EnergyState;
  energyBoostCooldowns: Record<string, number>;
  todaySleep: {
    bedTime: string;
    wakeTime: string;
    quality: number;
    duration: number;
    calculatedEnergy: number;
    recommendations: string[];
    loggedAt: string;
  } | null;
  moodHistory: DailyMood[];
  todayMood?: DailyMood;
  recentTPActivities: Record<StatType, RecentTPActivity | null>;

  // Actions
  addTP: (stat: StatType, amount: number) => void;
  setKondisyon: (value: number) => void;
  setInjury: (injury: PlayerState['injury']) => void;
  updatePlayStyleProgress: (id: string, progress: number) => void;
  unlockPlayStyle: (id: string) => void;
  addNewsItem: (news: string) => void;
  setDailyCommentary: (commentary: string) => void;
  recordDay: () => void;
  addContract: (contract: Omit<Contract, 'id'>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  completeDailyQuest: (id: string) => void;
  uncompleteDailyQuest: (id: string) => void;
  addQuest: (quest: Omit<Quest, 'id' | 'completedToday' | 'totalCompletions'>) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  resetDailyQuests: () => void;
  checkAndResetIfNewDay: () => void;
  getTodaySummary: () => TodaySummary;
  endDay: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addSkill: (skill: Omit<Skill, 'id' | 'xp' | 'xpToNextLevel' | 'createdAt' | 'lastUpdated'>) => void;
  updateSkillXP: (id: string, xpAmount: number) => void;
  deleteSkill: (id: string) => void;
  getSkillsByCategory: (category: SkillCategory) => Skill[];
  addVitalityTracker: (config: Omit<VitalityTracker, 'id' | 'currentStreak' | 'consecutiveFailures' | 'history' | 'totalCompletions' | 'longestStreak' | 'createdAt'>) => void;
  markVitalitySuccess: (trackerId: string) => void;
  markVitalityFailure: (trackerId: string) => void;
  deleteVitalityTracker: (trackerId: string) => void;
  getSubStatsByParent: (stat: StatType) => SubStat[];
  updateSubStat: (id: string, value: number) => void;
  recalculateMainStat: (stat: StatType) => void;
  checkAndUpdateStreak: () => void;
  useStreakFreeze: () => boolean;
  boostEnergy: (amount: number) => void;
  useEnergyBoost: (boostId: string, energyAmount: number, boostName: string) => void;
  getBoostCooldownRemaining: (boostId: string, cooldownHours: number) => number | null;
  logSleep: (bedTime: string, wakeTime: string, quality: number) => void;
  hasSleepLoggedToday: () => boolean;
  clearRecentTPActivity: (stat: StatType) => void;
  getGEN: () => number;
  getMarketValue: () => number;
  getActiveMultipliers: () => Record<StatType, number>;
  getStatChanges: () => Record<StatType, number>;
}

// Zustand Store with AsyncStorage Persistence
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial State
      playerName: 'Talha Güleryüz',
      position: 'CAM',
      age: 22,
      avatarUrl: '',
      stats: { PRO: 64, PHY: 68, MEN: 60, DIS: 55 },
      previousStats: { PRO: 64, PHY: 68, MEN: 60, DIS: 55 },
      tpPools: { PRO: 0, PHY: 0, MEN: 0, DIS: 0 },
      kondisyon: 85,
      injury: null,
      baseMarketValue: 10_000_000,
      history: [],
      playStyles: defaultPlayStyles,
      contracts: defaultContracts,
      newsItems: ['📰 Yeni sezon başladı! Hedeflerine ulaşmak için hazır mısın?'],
      dailyCommentary: '',
      notes: [],
      skills: defaultSkills,
      subStats: defaultSubStats,
      quests: [...defaultDailyQuests, ...defaultSpecialObjectives],
      dailyQuests: defaultDailyQuests,
      specialObjectives: defaultSpecialObjectives,
      questProgress: {
        date: new Date().toISOString().split('T')[0],
        completedCount: 0,
        streak: 0,
        lastCompletedDate: '',
        comboMultiplier: 1.0,
      },
      questStats: {
        mainCompleted: 0,
        sideCompleted: 0,
        specialCompleted: 0,
        totalCompleted: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      questCompletionHistory: [],
      settings: {
        theme: 'dark',
        notifications: true,
        soundEffects: true,
        autoSave: true,
      },
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: '',
        streakFreezes: 2,
        streakHistory: [],
      },
      customization: {
        selectedAvatar: 'avatar-soccer',
        selectedOutfits: { frame: 'frame-simple' },
        selectedTheme: 'theme-classic',
        unlockedAvatars: ['avatar-soccer', 'avatar-player', 'avatar-gamer', 'avatar-professional', 'avatar-runner'],
        unlockedOutfits: ['frame-simple'],
        unlockedThemes: ['theme-classic', 'theme-dark', 'theme-sunset'],
      },
      avatars: defaultAvatars,
      outfits: defaultOutfits,
      cardThemes: defaultCardThemes,
      energy: { current: 100, max: 100, lastBreak: '', breakCount: 0 },
      energyBoostCooldowns: {},
      todaySleep: null,
      moodHistory: [],
      todayMood: undefined,
      vitalityTrackers: [],
      recentTPActivities: { PRO: null, PHY: null, MEN: null, DIS: null },

      // Actions
      addTP: (stat, amount) => {
        set((state) => {
          const multipliers = get().getActiveMultipliers();
          const adjustedAmount = amount > 0 ? Math.floor(amount * (multipliers[stat] || 1)) : amount;
          let newTPPool = state.tpPools[stat] + adjustedAmount;
          const newStats = { ...state.stats };
          const newTPPools = { ...state.tpPools };
          const newPreviousStats = { ...state.previousStats };
          let newNewsItems = [...state.newsItems];

          if (newTPPool >= 10) {
            newPreviousStats[stat] = state.stats[stat];
            const statGain = Math.floor(newTPPool / 10);
            newTPPools[stat] = newTPPool % 10;
            newStats[stat] = Math.min(99, newStats[stat] + statGain);
            newNewsItems = [`🚀 ${stat} +${statGain}! Yeni: ${newStats[stat]}`, ...newNewsItems.slice(0, 4)];
          } else if (newTPPool < 0) {
            newPreviousStats[stat] = state.stats[stat];
            const statLoss = Math.ceil(Math.abs(newTPPool) / 10);
            newTPPools[stat] = 10 + (newTPPool % 10);
            if (newTPPools[stat] === 10) newTPPools[stat] = 0;
            newStats[stat] = Math.max(1, newStats[stat] - statLoss);
            newNewsItems = [`📉 ${stat} -${statLoss}! Yeni: ${newStats[stat]}`, ...newNewsItems.slice(0, 4)];
          } else {
            newTPPools[stat] = newTPPool;
          }

          const newRecentActivities = { ...state.recentTPActivities };
          newRecentActivities[stat] = { stat, amount: adjustedAmount, timestamp: Date.now() };

          return {
            stats: newStats,
            previousStats: newPreviousStats,
            tpPools: newTPPools,
            newsItems: newNewsItems,
            recentTPActivities: newRecentActivities,
          };
        });
      },

      setKondisyon: (value) => set({ kondisyon: Math.max(0, Math.min(100, value)) }),
      setInjury: (injury) => set({ injury }),

      updatePlayStyleProgress: (id, progress) => {
        set((state) => ({
          playStyles: state.playStyles.map((ps) =>
            ps.id === id ? { ...ps, progress: Math.min(100, progress) } : ps
          ),
        }));
      },

      unlockPlayStyle: (id) => {
        set((state) => {
          const newPlayStyles = state.playStyles.map((ps) =>
            ps.id === id ? { ...ps, unlocked: true, progress: 100 } : ps
          );
          const playStyle = newPlayStyles.find((ps) => ps.id === id);
          const newNews = playStyle
            ? [`🏆 ${playStyle.icon} ${playStyle.name} kazanıldı!`, ...state.newsItems.slice(0, 4)]
            : state.newsItems;
          return { playStyles: newPlayStyles, newsItems: newNews };
        });
      },

      addNewsItem: (news) => {
        set((state) => ({ newsItems: [news, ...state.newsItems.slice(0, 4)] }));
      },

      setDailyCommentary: (commentary) => set({ dailyCommentary: commentary }),

      recordDay: () => {
        const state = get();
        const today: DayRecord = {
          date: new Date().toISOString().split('T')[0],
          stats: { ...state.stats },
          tpGained: { ...state.tpPools },
          gen: state.getGEN(),
          marketValue: state.getMarketValue(),
          kondisyon: state.kondisyon,
          activePlayStyles: state.playStyles.filter((ps) => ps.unlocked).map((ps) => ps.id),
        };
        set((s) => ({ history: [...s.history.slice(-29), today] }));
      },

      addContract: (contract) => {
        set((state) => ({
          contracts: [...state.contracts, { ...contract, id: Date.now().toString() }],
          newsItems: [`📜 Yeni sözleşme: ${contract.title}`, ...state.newsItems.slice(0, 4)],
        }));
      },

      addNote: (note) => {
        const now = new Date().toISOString();
        set((state) => ({
          notes: [{ ...note, id: Date.now().toString(), createdAt: now, updatedAt: now }, ...state.notes],
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
      },

      completeDailyQuest: (id: string) => {
        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (!quest || quest.completedToday) return state;

          const QUEST_ENERGY_COST = 10;
          if (state.energy.current < QUEST_ENERGY_COST) return state;

          const today = new Date().toISOString().split('T')[0];
          const moodModifier = state.todayMood?.tpModifier || 1.0;

          const updateQuest = (q: DailyQuest) => {
            if (q.id === id) {
              return { ...q, completedToday: true, completedAt: new Date().toISOString(), totalCompletions: q.totalCompletions + 1 };
            }
            return q;
          };

          const newDailyQuests = state.dailyQuests.map(updateQuest);
          const newSpecialObjectives = state.specialObjectives.map(updateQuest);
          const newQuests = state.quests.map(updateQuest);

          const newCompletedCount = state.questProgress.completedCount + 1;
          const totalDailyCompleted = newDailyQuests.filter((q) => q.completedToday).length;

          let newMultiplier = 1.0;
          if (totalDailyCompleted >= 6) newMultiplier = 1.5;
          else if (totalDailyCompleted >= 5) newMultiplier = 1.2;

          const newQuestStats = { ...state.questStats };
          newQuestStats.totalCompleted += 1;
          if (quest.type === 'MAIN') newQuestStats.mainCompleted += 1;
          else if (quest.type === 'SIDE') newQuestStats.sideCompleted += 1;
          else if (quest.type === 'SPECIAL') newQuestStats.specialCompleted += 1;

          return {
            quests: newQuests,
            dailyQuests: newDailyQuests,
            specialObjectives: newSpecialObjectives,
            energy: { ...state.energy, current: Math.max(0, state.energy.current - QUEST_ENERGY_COST) },
            questProgress: {
              date: today,
              completedCount: newCompletedCount,
              streak: state.questProgress.streak,
              lastCompletedDate: today,
              comboMultiplier: newMultiplier,
            },
            questStats: newQuestStats,
            newsItems: [
              `✅ ${quest.title} tamamlandı! (-10 ⚡)`,
              ...state.newsItems.slice(0, 4),
            ],
          };
        });

        // Award TP
        const quest = get().quests.find((q) => q.id === id);
        if (quest && quest.rewards) {
          const multiplier = get().questProgress.comboMultiplier;
          quest.rewards.forEach(({ stat, tp }) => {
            get().addTP(stat, Math.floor(tp * multiplier));
          });
        }
      },

      uncompleteDailyQuest: (id: string) => {
        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (!quest || !quest.completedToday) return state;

          const updateQuest = (q: DailyQuest) => {
            if (q.id === id) return { ...q, completedToday: false, completedAt: undefined };
            return q;
          };

          const newDailyQuests = state.dailyQuests.map(updateQuest);
          const newSpecialObjectives = state.specialObjectives.map(updateQuest);
          const newQuests = state.quests.map(updateQuest);

          // Refund energy when uncompleting
          const newEnergy = {
            ...state.energy,
            current: Math.min(state.energy.max, state.energy.current + 10),
          };

          return {
            quests: newQuests,
            dailyQuests: newDailyQuests,
            specialObjectives: newSpecialObjectives,
            energy: newEnergy,
            newsItems: [`↩️ ${quest.title} geri alındı. +10 enerji iade!`, ...state.newsItems.slice(0, 4)],
          };
        });

        // Remove TP
        const quest = get().quests.find((q) => q.id === id);
        if (quest && quest.rewards) {
          const multiplier = get().questProgress.comboMultiplier || 1.0;
          quest.rewards.forEach(({ stat, tp }) => {
            get().addTP(stat, -Math.floor(tp * multiplier));
          });
        }
      },

      addQuest: (questData) => {
        const newQuest: Quest = {
          ...questData,
          id: `custom-${Date.now()}`,
          completedToday: false,
          totalCompletions: 0,
          isCustom: true,
        };
        
        set((state) => {
          const newQuests = [...state.quests, newQuest];
          let newDailyQuests = state.dailyQuests;
          let newSpecialObjectives = state.specialObjectives;

          if (newQuest.type === 'SPECIAL') {
            newSpecialObjectives = [...state.specialObjectives, newQuest];
          } else {
            newDailyQuests = [...state.dailyQuests, newQuest];
          }

          return {
            quests: newQuests,
            dailyQuests: newDailyQuests,
            specialObjectives: newSpecialObjectives,
            newsItems: [`➕ Yeni görev eklendi: ${newQuest.title}`, ...state.newsItems.slice(0, 4)],
          };
        });
      },

      updateQuest: (id, updates) => {
        set((state) => {
          const updateQuestFn = (q: Quest) =>
            q.id === id ? { ...q, ...updates } : q;

          return {
            quests: state.quests.map(updateQuestFn),
            dailyQuests: state.dailyQuests.map(updateQuestFn),
            specialObjectives: state.specialObjectives.map(updateQuestFn),
          };
        });
      },

      deleteQuest: (id) => {
        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (!quest) return state;

          return {
            quests: state.quests.filter((q) => q.id !== id),
            dailyQuests: state.dailyQuests.filter((q) => q.id !== id),
            specialObjectives: state.specialObjectives.filter((q) => q.id !== id),
            newsItems: [`🗑️ Görev silindi: ${quest.title}`, ...state.newsItems.slice(0, 4)],
          };
        });
      },

      resetDailyQuests: () => {
        set((state) => ({
          quests: state.quests.map((q) => ({ ...q, completedToday: false, completedAt: undefined })),
          dailyQuests: state.dailyQuests.map((q) => ({ ...q, completedToday: false, completedAt: undefined })),
          specialObjectives: state.specialObjectives.map((q) => ({ ...q, completedToday: false, completedAt: undefined })),
          questProgress: { ...state.questProgress, date: new Date().toISOString().split('T')[0], completedCount: 0, comboMultiplier: 1.0 },
          // Reset previousStats to current stats for new day - clears LEVEL UP badges
          previousStats: { ...state.stats },
          newsItems: ['🌅 Yeni gün! Görevler sıfırlandı.', ...state.newsItems.slice(0, 4)],
        }));
      },

      checkAndResetIfNewDay: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.questProgress.date !== today) {
          get().resetDailyQuests();
        }
      },

      getTodaySummary: (): TodaySummary => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = state.questCompletionHistory.find((r) => r.date === today);
        const completedQuests = state.quests.filter((q) => q.completedToday);
        const tpByStats: Record<StatType, number> = { PRO: 0, PHY: 0, MEN: 0, DIS: 0 };
        completedQuests.forEach((quest) => {
          quest.rewards.forEach((reward) => {
            tpByStats[reward.stat] += reward.tp;
          });
        });
        return {
          date: today,
          dateFormatted: new Date(today).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          completedQuests,
          totalQuestsCount: state.quests.length,
          totalTPEarned: todayRecord?.totalTP || 0,
          tpByStats,
        };
      },

      endDay: () => {
        set((state) => ({ energy: { ...state.energy, current: state.energy.max } }));
        get().resetDailyQuests();
      },

      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }));
      },

      addSkill: (skill) => {
        const now = new Date().toISOString();
        const newSkill: Skill = {
          ...skill,
          id: `skill-${Date.now()}`,
          xp: 0,
          xpToNextLevel: calculateXPForLevel(skill.level),
          createdAt: now,
          lastUpdated: now,
        };
        set((state) => ({
          skills: [...state.skills, newSkill],
          newsItems: [`🌟 Yeni yetenek: ${skill.name} (Lv.${skill.level})`, ...state.newsItems.slice(0, 4)],
        }));
      },

      updateSkillXP: (id, xpAmount) => {
        set((state) => {
          const skill = state.skills.find((s) => s.id === id);
          if (!skill) return state;

          let newXP = skill.xp + xpAmount;
          let newLevel = skill.level;
          let leveledUp = false;

          while (newXP >= skill.xpToNextLevel && newLevel < 99) {
            newXP -= skill.xpToNextLevel;
            newLevel++;
            leveledUp = true;
          }

          if (newLevel >= 99) {
            newLevel = 99;
            newXP = 0;
          }

          const updatedSkills = state.skills.map((s) =>
            s.id === id
              ? { ...s, level: newLevel, xp: newXP, xpToNextLevel: calculateXPForLevel(newLevel), lastUpdated: new Date().toISOString() }
              : s
          );

          return {
            skills: updatedSkills,
            newsItems: leveledUp
              ? [`⬆️ ${skill.name} Lv.${newLevel}!`, ...state.newsItems.slice(0, 4)]
              : state.newsItems,
          };
        });
      },

      deleteSkill: (id) => {
        set((state) => ({ skills: state.skills.filter((s) => s.id !== id) }));
      },

      getSkillsByCategory: (category) => get().skills.filter((s) => s.category === category),

      addVitalityTracker: (config) => {
        const now = new Date().toISOString();
        const newTracker: VitalityTracker = {
          ...config,
          id: `vitality-${Date.now()}`,
          currentStreak: 0,
          consecutiveFailures: 0,
          history: [],
          totalCompletions: 0,
          longestStreak: 0,
          createdAt: now,
        };
        set((state) => ({
          vitalityTrackers: [...state.vitalityTrackers, newTracker],
          newsItems: [`⚡ Yeni: ${config.name}`, ...state.newsItems.slice(0, 4)],
        }));
      },

      markVitalitySuccess: (trackerId) => {
        set((state) => {
          const tracker = state.vitalityTrackers.find((t) => t.id === trackerId);
          if (!tracker) return state;

          const newStreak = tracker.currentStreak + 1;
          const tpReward = getVitalityTPReward(tracker, newStreak);
          const today = new Date().toISOString().split('T')[0];
          const record: VitalityRecord = { date: today, success: true, tpAwarded: tpReward, streakDay: newStreak };

          if (tpReward > 0) get().addTP(tracker.linkedStat, tpReward);

          return {
            vitalityTrackers: state.vitalityTrackers.map((t) =>
              t.id === trackerId
                ? {
                    ...t,
                    currentStreak: newStreak,
                    consecutiveFailures: 0,
                    history: [record, ...t.history].slice(0, 90),
                    totalCompletions: t.totalCompletions + 1,
                    longestStreak: Math.max(newStreak, t.longestStreak),
                  }
                : t
            ),
            newsItems: tpReward > 0 ? [`⚡ ${tracker.name} Day ${newStreak}: +${tpReward} TP`, ...state.newsItems.slice(0, 4)] : state.newsItems,
          };
        });
      },

      markVitalityFailure: (trackerId) => {
        set((state) => {
          const tracker = state.vitalityTrackers.find((t) => t.id === trackerId);
          if (!tracker) return state;

          const getPenaltyForDay = (streakDay: number): number => {
            if (streakDay <= 1) return -50;
            if (streakDay === 2) return -25;
            if (streakDay === 3) return -17;
            if (streakDay === 4) return -12;
            if (streakDay === 5) return -10;
            return -8;
          };

          const penalty = getPenaltyForDay(tracker.currentStreak);
          const today = new Date().toISOString().split('T')[0];
          const record: VitalityRecord = { date: today, success: false, tpAwarded: penalty, streakDay: 0 };

          get().addTP(tracker.linkedStat, penalty);

          return {
            vitalityTrackers: state.vitalityTrackers.map((t) =>
              t.id === trackerId
                ? { ...t, currentStreak: 0, consecutiveFailures: t.consecutiveFailures + 1, history: [record, ...t.history].slice(0, 90) }
                : t
            ),
            newsItems: [`💔 ${tracker.name}: ${penalty} TP`, ...state.newsItems.slice(0, 4)],
          };
        });
      },

      deleteVitalityTracker: (trackerId) => {
        set((state) => ({ vitalityTrackers: state.vitalityTrackers.filter((t) => t.id !== trackerId) }));
      },

      getSubStatsByParent: (stat) => get().subStats.filter((s) => s.parentStat === stat),

      updateSubStat: (id, value) => {
        set((state) => {
          const subStat = state.subStats.find((s) => s.id === id);
          if (!subStat) return state;

          const clampedValue = Math.max(0, Math.min(99, value));
          const updatedSubStats = state.subStats.map((s) => (s.id === id ? { ...s, value: clampedValue } : s));

          const parentStat = subStat.parentStat;
          const parentSubStats = updatedSubStats.filter((s) => s.parentStat === parentStat);
          const weightedSum = parentSubStats.reduce((sum, s) => sum + s.value * s.weight, 0);
          const newParentValue = Math.round(weightedSum);

          return {
            subStats: updatedSubStats,
            stats: { ...state.stats, [parentStat]: Math.max(1, Math.min(99, newParentValue)) },
            previousStats: { ...state.previousStats, [parentStat]: state.stats[parentStat] },
          };
        });
      },

      recalculateMainStat: (stat) => {
        set((state) => {
          const subStats = state.subStats.filter((s) => s.parentStat === stat);
          const weightedSum = subStats.reduce((sum, s) => sum + s.value * s.weight, 0);
          const newValue = Math.round(weightedSum);

          return {
            stats: { ...state.stats, [stat]: Math.max(1, Math.min(99, newValue)) },
            previousStats: { ...state.previousStats, [stat]: state.stats[stat] },
          };
        });
      },

      checkAndUpdateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastLogin = state.streakData.lastLoginDate;

          if (lastLogin === today) return state;

          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          let newStreak = state.streakData.currentStreak;
          let newLongest = state.streakData.longestStreak;

          if (lastLogin === yesterday) {
            newStreak += 1;
            newLongest = Math.max(newLongest, newStreak);
          } else if (lastLogin === '') {
            newStreak = 1;
            newLongest = 1;
          } else {
            newStreak = 1;
          }

          return {
            streakData: {
              ...state.streakData,
              currentStreak: newStreak,
              longestStreak: newLongest,
              lastLoginDate: today,
              streakHistory: [...state.streakData.streakHistory, today].slice(-90),
            },
          };
        });
      },

      useStreakFreeze: () => {
        const state = get();
        if (state.streakData.streakFreezes <= 0) return false;
        set((state) => ({
          streakData: { ...state.streakData, streakFreezes: state.streakData.streakFreezes - 1 },
        }));
        return true;
      },

      boostEnergy: (amount: number) => {
        set((state) => ({
          energy: { ...state.energy, current: Math.min(state.energy.max, state.energy.current + amount) },
          newsItems: [`⚡ Enerji: +${amount}`, ...state.newsItems.slice(0, 4)],
        }));
      },

      useEnergyBoost: (boostId: string, baseAmount: number, boostName: string) => {
        set((state) => ({
          energy: { ...state.energy, current: Math.min(state.energy.max, state.energy.current + baseAmount) },
          energyBoostCooldowns: { ...state.energyBoostCooldowns, [boostId]: Date.now() },
          newsItems: [`⚡ ${boostName}: +${baseAmount}`, ...state.newsItems.slice(0, 4)],
        }));
      },

      getBoostCooldownRemaining: (boostId: string, cooldownHours: number) => {
        const state = get();
        const lastUsed = state.energyBoostCooldowns[boostId];
        if (!lastUsed) return null;
        const hoursSince = (Date.now() - lastUsed) / (1000 * 60 * 60);
        const remaining = cooldownHours - hoursSince;
        return remaining <= 0 ? null : remaining;
      },

      logSleep: (bedTime: string, wakeTime: string, quality: number) => {
        const [bedHour, bedMin] = bedTime.split(':').map(Number);
        const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);

        let duration = wakeHour - bedHour + (wakeMin - bedMin) / 60;
        if (duration < 0) duration += 24;

        let baseEnergy = 0;
        if (duration >= 8) baseEnergy = 100;
        else if (duration >= 7) baseEnergy = 90;
        else if (duration >= 6) baseEnergy = 75;
        else if (duration >= 5) baseEnergy = 55;
        else if (duration >= 4) baseEnergy = 40;
        else baseEnergy = 25;

        const qualityMultiplier = 0.6 + quality * 0.1;
        let calculatedEnergy = Math.round(baseEnergy * qualityMultiplier);

        if (bedHour >= 0 && bedHour < 6) calculatedEnergy = Math.round(calculatedEnergy * 0.85);

        calculatedEnergy = Math.min(100, Math.max(10, calculatedEnergy));

        const recommendations: string[] = [];
        if (duration < 6) recommendations.push('💤 Az uyudun, Power Nap değerlendir');
        if (quality <= 2) recommendations.push('🧘 Kalite düşük, meditasyon dene');
        if (duration >= 7 && quality >= 4) recommendations.push('🌟 Mükemmel uyku!');
        if (recommendations.length === 0) recommendations.push('👍 İyi uyku!');

        set((state) => ({
          todaySleep: {
            bedTime,
            wakeTime,
            quality,
            duration: Math.round(duration * 10) / 10,
            calculatedEnergy,
            recommendations,
            loggedAt: new Date().toISOString(),
          },
          energy: { ...state.energy, current: calculatedEnergy },
          newsItems: [`🌙 Uyku: ${Math.round(duration)}s → %${calculatedEnergy}`, ...state.newsItems.slice(0, 4)],
        }));
      },

      hasSleepLoggedToday: () => {
        const state = get();
        if (!state.todaySleep) return false;
        const today = new Date().toISOString().split('T')[0];
        return state.todaySleep.loggedAt.split('T')[0] === today;
      },

      clearRecentTPActivity: (stat) => {
        set((state) => ({ recentTPActivities: { ...state.recentTPActivities, [stat]: null } }));
      },

      getGEN: () => {
        const { stats } = get();
        return Math.round((stats.PRO + stats.PHY + stats.MEN + stats.DIS) / 4);
      },

      getMarketValue: () => {
        const state = get();
        const gen = state.getGEN();
        const ageMultiplier = state.age < 25 ? 1.2 : state.age < 30 ? 1.0 : 0.8;
        const formBonus = 1 + (state.kondisyon - 50) / 100;
        const contractMultiplier = state.contracts
          .filter((c) => c.completed && c.reward.type === 'base_value_increase')
          .reduce((acc, c) => acc * c.reward.value, 1);
        const value = state.baseMarketValue * Math.pow(gen / 50, 2) * ageMultiplier * formBonus * contractMultiplier;
        return Math.round(value);
      },

      getActiveMultipliers: () => {
        const { playStyles } = get();
        const multipliers: Record<StatType, number> = { PRO: 1, PHY: 1, MEN: 1, DIS: 1 };
        playStyles
          .filter((ps) => ps.unlocked && ps.effect.type === 'multiplier')
          .forEach((ps) => {
            if (ps.effect.stat) {
              multipliers[ps.effect.stat] *= ps.effect.value;
            } else {
              Object.keys(multipliers).forEach((key) => {
                multipliers[key as StatType] *= ps.effect.value;
              });
            }
          });
        return multipliers;
      },

      getStatChanges: () => {
        const { stats, previousStats } = get();
        return {
          PRO: stats.PRO - previousStats.PRO,
          PHY: stats.PHY - previousStats.PHY,
          MEN: stats.MEN - previousStats.MEN,
          DIS: stats.DIS - previousStats.DIS,
        };
      },
    }),
    {
      name: 'fifa-life-mobile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { recentTPActivities, ...rest } = state;
        return rest;
      },
    }
  )
);
