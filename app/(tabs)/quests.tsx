// Quests Screen - Daily quests with add/edit/delete functionality
// Premium FIFA RPG-style quest system with calendar view

import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddQuestModal, QuestDetailModal, QuestStatsSection, WeeklyCalendar } from '../../components/quests';
import { Quest, QuestRarity, QuestType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

// Rarity colors
const rarityColors: Record<QuestRarity, string> = {
  COMMON: colors.rarity.common,
  RARE: colors.rarity.rare,
  EPIC: colors.rarity.epic,
  LEGENDARY: colors.rarity.legendary,
};

// Quest type labels
const typeLabels: Record<QuestType, { label: string; color: string; emoji: string }> = {
  MAIN: { label: 'MAIN', color: colors.quest.main, emoji: '⚔️' },
  SIDE: { label: 'SIDE', color: colors.quest.side, emoji: '🎯' },
  SPECIAL: { label: 'SPECIAL', color: colors.quest.special, emoji: '👑' },
};

interface QuestItemProps {
  quest: Quest;
  onComplete: () => void;
  onUncomplete: () => void;
  onPress: () => void;
  index: number;
}

function QuestItem({ quest, onComplete, onUncomplete, onPress, index }: QuestItemProps) {
  const typeInfo = typeLabels[quest.type];
  const rarityColor = rarityColors[quest.rarity];
  const energy = usePlayerStore((s) => s.energy);
  
  const canComplete = !quest.completedToday && energy.current >= 10;

  // TAP to complete/uncomplete
  const handlePress = () => {
    if (quest.completedToday) {
      onUncomplete();
    } else if (canComplete) {
      onComplete();
    }
  };

  // LONG PRESS to open details/edit
  const handleLongPress = () => {
    onPress();
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <Pressable 
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={400}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)', borderless: false }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          backgroundColor: quest.completedToday ? '#0a3a1a' : pressed ? '#303045' : '#1e1e2e',
          borderRadius: 16,
          padding: 16,
          marginBottom: 14,
          borderWidth: 2,
          borderColor: quest.completedToday ? '#00FF88' : '#404055',
          alignItems: 'center',
          elevation: pressed ? 4 : 10,
          transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
        })}
      >
        {/* Quest icon */}
        <View style={[styles.questIcon, { backgroundColor: `${typeInfo.color}15` }]}>
          <Text style={styles.questEmoji}>{quest.icon}</Text>
        </View>

        {/* Quest info */}
        <View style={styles.questInfo}>
          <View style={styles.questHeader}>
            <Text style={[
              styles.questTitle,
              quest.completedToday && styles.questTitleCompleted,
            ]} numberOfLines={1}>
              {quest.title}
            </Text>
            {quest.completedToday && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
          </View>

          {/* Tags row */}
          <View style={styles.tagsRow}>
            <View style={[styles.typeTag, { backgroundColor: `${typeInfo.color}20` }]}>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>
                {typeInfo.label}
              </Text>
            </View>
            <Text style={styles.difficultyText}>
              {'⭐'.repeat(quest.difficulty)}
            </Text>
            {quest.isCustom && (
              <View style={styles.customBadge}>
                <Text style={styles.customText}>ÖZEL</Text>
              </View>
            )}
          </View>

          {/* Rewards */}
          <View style={styles.rewardsRow}>
            {quest.rewards.map((reward, idx) => (
              <View key={idx} style={styles.rewardBadge}>
                <Text style={styles.rewardText}>
                  +{reward.tp} {reward.stat}
                </Text>
              </View>
            ))}
            <View style={styles.energyCost}>
              <Text style={styles.energyText}>-10 ⚡</Text>
            </View>
          </View>
        </View>

        {/* Status indicator (right side) */}
        <View style={[
          styles.statusIndicator,
          quest.completedToday && styles.statusDone,
          !canComplete && !quest.completedToday && styles.statusDisabled,
        ]}>
          <Text style={styles.statusIcon}>
            {quest.completedToday ? '✓' : '○'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Progress Stats Component
function ProgressStats() {
  const quests = usePlayerStore((s) => s.quests);
  const questStats = usePlayerStore((s) => s.questStats);
  const energy = usePlayerStore((s) => s.energy);

  const mainQuests = quests.filter((q) => q.type === 'MAIN');
  const sideQuests = quests.filter((q) => q.type === 'SIDE');
  const specialQuests = quests.filter((q) => q.type === 'SPECIAL');

  const mainCompleted = mainQuests.filter((q) => q.completedToday).length;
  const sideCompleted = sideQuests.filter((q) => q.completedToday).length;
  const specialCompleted = specialQuests.filter((q) => q.completedToday).length;
  const totalCompleted = quests.filter((q) => q.completedToday).length;

  return (
    <Animated.View entering={FadeInUp.delay(50).duration(400)} style={styles.progressCard}>
      {/* Motivational Text */}
      <View style={styles.motivationRow}>
        <Text style={styles.motivationText}>
          💪 Her tamamlanan görev bir adım daha yaklaştırır!
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGridRow}>
        {/* Total */}
        <View style={styles.statBox}>
          <View style={styles.statCircle}>
            <Text style={styles.statValue}>{totalCompleted}/{quests.length}</Text>
          </View>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        {/* Main */}
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>⚔️</Text>
          <Text style={[styles.miniStatValue, { color: colors.quest.main }]}>
            {mainCompleted}/{mainQuests.length}
          </Text>
          <Text style={styles.miniStatLabel}>Main</Text>
        </View>

        {/* Side */}
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>🎯</Text>
          <Text style={[styles.miniStatValue, { color: colors.quest.side }]}>
            {sideCompleted}/{sideQuests.length}
          </Text>
          <Text style={styles.miniStatLabel}>Side</Text>
        </View>

        {/* Special */}
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>👑</Text>
          <Text style={[styles.miniStatValue, { color: colors.quest.special }]}>
            {specialCompleted}/{specialQuests.length}
          </Text>
          <Text style={styles.miniStatLabel}>Special</Text>
        </View>

        {/* Energy */}
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>⚡</Text>
          <Text style={[styles.miniStatValue, { color: colors.accent.warning }]}>
            {energy.current}
          </Text>
          <Text style={styles.miniStatLabel}>Enerji</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function QuestsScreen() {
  const quests = usePlayerStore((s) => s.quests);
  const completeDailyQuest = usePlayerStore((s) => s.completeDailyQuest);
  const uncompleteDailyQuest = usePlayerStore((s) => s.uncompleteDailyQuest);

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Separate quests by type
  const mainQuests = useMemo(() => quests.filter((q) => q.type === 'MAIN'), [quests]);
  const sideQuests = useMemo(() => quests.filter((q) => q.type === 'SIDE'), [quests]);
  const specialQuests = useMemo(() => quests.filter((q) => q.type === 'SPECIAL'), [quests]);

  // Calculate completion history for calendar
  const completionHistory = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = quests.filter((q) => q.completedToday).length;
    return { [today]: completedToday };
  }, [quests]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      
      <LinearGradient
        colors={[colors.bg.primary, colors.bg.secondary]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>⚔️ Daily Quests</Text>
            <Text style={styles.subtitle}>
              Görevleri tamamla, TP kazan, stat'larını geliştir
            </Text>
          </View>

          {/* Progress Stats */}
          <ProgressStats />

          {/* Weekly Calendar */}
          <WeeklyCalendar completionHistory={completionHistory} />

          {/* Main Quests */}
          {mainQuests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>⚔️ Ana Görevler</Text>
                <Text style={styles.sectionCount}>{mainQuests.filter(q => q.completedToday).length}/{mainQuests.length}</Text>
              </View>
              {mainQuests.map((quest, index) => (
                <QuestItem
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={() => completeDailyQuest(quest.id)}
                  onUncomplete={() => uncompleteDailyQuest(quest.id)}
                  onPress={() => setSelectedQuest(quest)}
                />
              ))}
            </View>
          )}

          {/* Side Quests */}
          {sideQuests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📋 Yan Görevler</Text>
                <Text style={styles.sectionCount}>{sideQuests.filter(q => q.completedToday).length}/{sideQuests.length}</Text>
              </View>
              {sideQuests.map((quest, index) => (
                <QuestItem
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={() => completeDailyQuest(quest.id)}
                  onUncomplete={() => uncompleteDailyQuest(quest.id)}
                  onPress={() => setSelectedQuest(quest)}
                />
              ))}
            </View>
          )}

          {/* Special Quests */}
          {specialQuests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>👑 Efsanevi Görevler</Text>
                <Text style={styles.sectionCount}>{specialQuests.filter(q => q.completedToday).length}/{specialQuests.length}</Text>
              </View>
              {specialQuests.map((quest, index) => (
                <QuestItem
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={() => completeDailyQuest(quest.id)}
                  onUncomplete={() => uncompleteDailyQuest(quest.id)}
                  onPress={() => setSelectedQuest(quest)}
                />
              ))}
            </View>
          )}

          {/* Stats Progress Section */}
          <QuestStatsSection />

          {/* Tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              Görev tamamla → Stat kartlarında TP artışını izle!
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable 
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
        >
          <LinearGradient
            colors={[colors.accent.gold, '#FFA500']}
            style={styles.fabGradient}
          >
            <Text style={styles.fabIcon}>➕</Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>

      {/* Modals */}
      <QuestDetailModal
        quest={selectedQuest}
        visible={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
      />

      <AddQuestModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  motivationRow: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  motivationText: {
    fontSize: 13,
    color: colors.accent.gold,
    fontWeight: '500',
  },
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statBox: {
    alignItems: 'center',
  },
  statCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.muted,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  miniStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  miniStatLabel: {
    fontSize: 9,
    color: colors.text.muted,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  questCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a25',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#333344',
    alignItems: 'center',
    // Drop shadow for button-like feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  questCompleted: {
    backgroundColor: '#0a2a1a',
    borderColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOpacity: 0.3,
  },
  questPressed: {
    backgroundColor: '#252535',
    transform: [{ scale: 0.96 }],
    elevation: 4,
  },
  questIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questEmoji: {
    fontSize: 24,
  },
  questInfo: {
    flex: 1,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  questTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.muted,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.stat.high,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmark: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 8,
  },
  customBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(147, 112, 219, 0.2)',
  },
  customText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9370DB',
  },
  rewardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rewardBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.accent.blue,
  },
  energyCost: {
    backgroundColor: 'rgba(255, 170, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  energyText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.accent.warning,
  },
  // Status indicator (right side circle)
  statusIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.4)',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  statusDone: {
    backgroundColor: colors.stat.high,
    borderColor: colors.stat.high,
  },
  statusDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5,
  },
  statusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.stat.high,
  },
  completeIcon: {
    fontSize: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  tipEmoji: {
    fontSize: 18,
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    color: colors.text.muted,
    lineHeight: 16,
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    shadowColor: colors.accent.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 24,
  },
});
