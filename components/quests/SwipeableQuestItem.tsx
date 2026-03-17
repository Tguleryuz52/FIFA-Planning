// Swipeable Quest Item - Quest card with swipe-to-delete
// Enhanced UI with clear completion button and visual feedback

import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Quest, QuestRarity, QuestType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

const rarityColors: Record<QuestRarity, string> = {
  COMMON: colors.rarity.common,
  RARE: colors.rarity.rare,
  EPIC: colors.rarity.epic,
  LEGENDARY: colors.rarity.legendary,
};

const typeLabels: Record<QuestType, { label: string; color: string; emoji: string }> = {
  MAIN: { label: 'ANA', color: colors.quest.main, emoji: '⚔️' },
  SIDE: { label: 'YAN', color: colors.quest.side, emoji: '📋' },
  SPECIAL: { label: 'ÖZEL', color: colors.quest.special, emoji: '👑' },
};

interface SwipeableQuestItemProps {
  quest: Quest;
  onComplete: () => void;
  onUncomplete: () => void;
  onPress: () => void;
  index: number;
}

export function SwipeableQuestItem({ quest, onComplete, onUncomplete, onPress, index }: SwipeableQuestItemProps) {
  const typeInfo = typeLabels[quest.type];
  const rarityColor = rarityColors[quest.rarity];
  const energy = usePlayerStore((s) => s.energy);
  const deleteQuest = usePlayerStore((s) => s.deleteQuest);
  const swipeableRef = useRef<Swipeable>(null);
  
  const canComplete = !quest.completedToday && energy.current >= 10;
  const isCompleted = quest.completedToday;

  const handleComplete = () => {
    if (isCompleted) {
      onUncomplete();
    } else if (canComplete) {
      onComplete();
    }
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    
    Alert.alert(
      '🗑️ Görevi Sil',
      `"${quest.title}" görevini silmek istediğinden emin misin?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet, Sil', 
          style: 'destructive',
          onPress: () => {
            deleteQuest(quest.id);
          }
        },
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <Pressable onPress={handleDelete} style={styles.deleteAction}>
        <LinearGradient
          colors={['#ff3b30', '#ff6b6b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.deleteGradient}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteText}>Sil</Text>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
      >
        <Pressable 
          onPress={handleComplete}
          style={({ pressed }) => [
            styles.questCard,
            isCompleted && styles.questCompleted,
            pressed && styles.questCardPressed,
          ]}
        >
          {/* Left side: Completion indicator */}
          <View style={[
            styles.completeIndicator,
            isCompleted && styles.completeIndicatorDone,
            !canComplete && !isCompleted && styles.completeIndicatorDisabled,
          ]}>
            {isCompleted ? (
              <Text style={styles.completeIcon}>✓</Text>
            ) : (
              <View style={styles.completeCircle} />
            )}
          </View>

          {/* Quest info */}
          <View style={styles.questInfo}>
            {/* Title row */}
            <View style={styles.questHeader}>
              <Text style={[
                styles.questTitle,
                isCompleted && styles.questTitleCompleted,
              ]} numberOfLines={1}>
                {quest.icon} {quest.title}
              </Text>
            </View>

            {/* Tags row */}
            <View style={styles.tagsRow}>
              <View style={[styles.typeTag, { backgroundColor: `${typeInfo.color}20`, borderColor: `${typeInfo.color}40` }]}>
                <Text style={[styles.typeText, { color: typeInfo.color }]}>
                  {typeInfo.emoji} {typeInfo.label}
                </Text>
              </View>
              <Text style={styles.difficultyText}>
                {'⭐'.repeat(quest.difficulty)}
              </Text>
              {quest.isCustom && (
                <View style={styles.customBadge}>
                  <Text style={styles.customText}>📝</Text>
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

          {/* Right: Edit button */}
          <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.editButtonPressed,
            ]}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    width: 80,
    height: '100%',
    marginBottom: 10,
  },
  deleteGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  questCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  questCompleted: {
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  questCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  // Completion indicator (left)
  completeIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.4)',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completeIndicatorDone: {
    backgroundColor: colors.stat.high,
    borderColor: colors.stat.high,
  },
  completeIndicatorDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    opacity: 0.5,
  },
  completeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 255, 136, 0.3)',
  },
  completeIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  // Quest info (middle)
  questInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  questTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.muted,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  difficultyText: {
    fontSize: 10,
  },
  customBadge: {
    marginLeft: 4,
  },
  customText: {
    fontSize: 12,
  },
  rewardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rewardBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.blue,
  },
  energyCost: {
    backgroundColor: 'rgba(255, 170, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  energyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.warning,
  },
  // Edit button (right)
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(147, 112, 219, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButtonPressed: {
    backgroundColor: 'rgba(147, 112, 219, 0.3)',
    transform: [{ scale: 0.9 }],
  },
  editIcon: {
    fontSize: 16,
  },
});
