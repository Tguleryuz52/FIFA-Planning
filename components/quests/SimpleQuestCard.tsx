// Simple Quest Card - Clean, functional quest item
// No gesture conflicts, clear press actions

import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Quest, QuestType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

const typeStyles: Record<QuestType, { bg: string; border: string; label: string; emoji: string }> = {
  MAIN: { bg: 'rgba(255, 170, 0, 0.15)', border: 'rgba(255, 170, 0, 0.3)', label: 'ANA GÖREV', emoji: '⚔️' },
  SIDE: { bg: 'rgba(0, 212, 255, 0.15)', border: 'rgba(0, 212, 255, 0.3)', label: 'YAN GÖREV', emoji: '📋' },
  SPECIAL: { bg: 'rgba(147, 112, 219, 0.15)', border: 'rgba(147, 112, 219, 0.3)', label: 'ÖZEL', emoji: '👑' },
};

interface SimpleQuestCardProps {
  quest: Quest;
  onComplete: () => void;
  onUncomplete: () => void;
  onEdit: () => void;
  index: number;
}

export function SimpleQuestCard({ quest, onComplete, onUncomplete, onEdit, index }: SimpleQuestCardProps) {
  const energy = usePlayerStore((s) => s.energy);
  const deleteQuest = usePlayerStore((s) => s.deleteQuest);
  
  const isCompleted = quest.completedToday;
  const canComplete = !isCompleted && energy.current >= 10;
  const typeStyle = typeStyles[quest.type];

  const handlePress = () => {
    if (isCompleted) {
      onUncomplete();
    } else if (canComplete) {
      onComplete();
    } else {
      Alert.alert('⚡ Yetersiz Enerji', 'Bu görevi tamamlamak için en az 10 enerji gerekli.');
    }
  };

  const handleLongPress = () => {
    Alert.alert(
      quest.title,
      'Bu görev için ne yapmak istersin?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: '✏️ Düzenle', onPress: onEdit },
        { 
          text: '🗑️ Sil', 
          style: 'destructive',
          onPress: () => deleteQuest(quest.id)
        },
      ]
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={({ pressed }) => [
          styles.card,
          isCompleted && styles.cardCompleted,
          pressed && styles.cardPressed,
        ]}
      >
        {/* Left: Completion indicator */}
        <View style={[
          styles.checkCircle,
          isCompleted && styles.checkCircleDone,
          !canComplete && !isCompleted && styles.checkCircleDisabled,
        ]}>
          {isCompleted ? (
            <Text style={styles.checkIcon}>✓</Text>
          ) : (
            <View style={styles.checkDot} />
          )}
        </View>

        {/* Middle: Quest content */}
        <View style={styles.content}>
          {/* Title with icon */}
          <Text style={[
            styles.title,
            isCompleted && styles.titleCompleted,
          ]} numberOfLines={1}>
            {quest.icon} {quest.title}
          </Text>

          {/* Type badge + difficulty */}
          <View style={styles.metaRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
              <Text style={[styles.typeLabel, { color: typeStyle.border.replace('0.3', '1') }]}>
                {typeStyle.emoji} {typeStyle.label}
              </Text>
            </View>
            <Text style={styles.difficulty}>{'⭐'.repeat(quest.difficulty)}</Text>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsRow}>
            {quest.rewards.map((r, i) => (
              <View key={i} style={styles.rewardChip}>
                <Text style={styles.rewardText}>+{r.tp} {r.stat}</Text>
              </View>
            ))}
            <View style={styles.energyChip}>
              <Text style={styles.energyText}>-10 ⚡</Text>
            </View>
          </View>
        </View>

        {/* Right: Edit button */}
        <Pressable
          onPress={onEdit}
          hitSlop={8}
          style={({ pressed }) => [
            styles.editBtn,
            pressed && styles.editBtnPressed,
          ]}
        >
          <Text style={styles.editIcon}>⚙️</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardCompleted: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderColor: 'rgba(0, 255, 136, 0.25)',
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  // Check circle
  checkCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.5)',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkCircleDone: {
    backgroundColor: colors.stat.high,
    borderColor: colors.stat.high,
  },
  checkCircleDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 255, 136, 0.4)',
  },
  checkIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  // Content
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.muted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  difficulty: {
    fontSize: 11,
  },
  rewardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rewardChip: {
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
  energyChip: {
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
  // Edit button
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  editBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  editIcon: {
    fontSize: 16,
  },
});
