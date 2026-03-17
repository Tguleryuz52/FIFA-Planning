// Add Quest Modal - Create new quests
// Premium UI for adding custom quests

import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { QuestDifficulty, QuestRarity, QuestType, StatType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

const QUEST_TYPES: { type: QuestType; label: string; emoji: string; color: string }[] = [
  { type: 'MAIN', label: 'Main', emoji: '⚔️', color: colors.quest.main },
  { type: 'SIDE', label: 'Side', emoji: '🎯', color: colors.quest.side },
  { type: 'SPECIAL', label: 'Special', emoji: '👑', color: colors.quest.special },
];

const RARITIES: { rarity: QuestRarity; label: string; color: string }[] = [
  { rarity: 'COMMON', label: 'Common', color: colors.rarity.common },
  { rarity: 'RARE', label: 'Rare', color: colors.rarity.rare },
  { rarity: 'EPIC', label: 'Epic', color: colors.rarity.epic },
  { rarity: 'LEGENDARY', label: 'Legendary', color: colors.rarity.legendary },
];

const STATS: StatType[] = ['PRO', 'PHY', 'MEN', 'DIS'];

const ICONS = ['⚔️', '💪', '📚', '🎯', '🏃', '💻', '🧠', '✨', '🔥', '⚡', '🎮', '🎨'];

interface AddQuestModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddQuestModal({ visible, onClose }: AddQuestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⚔️');
  const [type, setType] = useState<QuestType>('MAIN');
  const [rarity, setRarity] = useState<QuestRarity>('COMMON');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(2);
  const [rewardStat, setRewardStat] = useState<StatType>('PRO');
  const [rewardTP, setRewardTP] = useState('5');

  const addQuest = usePlayerStore((s) => s.addQuest);

  const handleAdd = () => {
    if (!title.trim()) return;

    addQuest({
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      type,
      rarity,
      difficulty,
      rewards: [{ stat: rewardStat, tp: parseInt(rewardTP) || 5 }],
    });

    // Reset form
    setTitle('');
    setDescription('');
    setIcon('⚔️');
    setType('MAIN');
    setRarity('COMMON');
    setDifficulty(2);
    setRewardStat('PRO');
    setRewardTP('5');
    
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.backdrop}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          entering={SlideInDown.springify().damping(25).stiffness(90).mass(0.8)}
          exiting={SlideOutDown.duration(250)}
          style={styles.modalContainer}
        >
          <LinearGradient
            colors={['#1a1a24', '#0d0d12']}
            style={styles.modal}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>➕ Yeni Görev</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Title */}
              <View style={styles.field}>
                <Text style={styles.label}>Görev Başlığı</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Örn: 1 Saat Coding"
                  placeholderTextColor={colors.text.muted}
                />
              </View>

              {/* Description */}
              <View style={styles.field}>
                <Text style={styles.label}>Açıklama (Opsiyonel)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Görev detayları..."
                  placeholderTextColor={colors.text.muted}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Icon Selection */}
              <View style={styles.field}>
                <Text style={styles.label}>İkon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.iconRow}>
                    {ICONS.map((emoji) => (
                      <Pressable
                        key={emoji}
                        style={[styles.iconOption, icon === emoji && styles.iconSelected]}
                        onPress={() => setIcon(emoji)}
                      >
                        <Text style={styles.iconEmoji}>{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Quest Type */}
              <View style={styles.field}>
                <Text style={styles.label}>Görev Tipi</Text>
                <View style={styles.optionsRow}>
                  {QUEST_TYPES.map((qt) => (
                    <Pressable
                      key={qt.type}
                      style={[
                        styles.typeOption,
                        type === qt.type && { backgroundColor: `${qt.color}30`, borderColor: qt.color },
                      ]}
                      onPress={() => setType(qt.type)}
                    >
                      <Text style={styles.typeEmoji}>{qt.emoji}</Text>
                      <Text style={[styles.typeLabel, type === qt.type && { color: qt.color }]}>
                        {qt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Rarity */}
              <View style={styles.field}>
                <Text style={styles.label}>Nadirlik</Text>
                <View style={styles.optionsRow}>
                  {RARITIES.map((r) => (
                    <Pressable
                      key={r.rarity}
                      style={[
                        styles.rarityOption,
                        rarity === r.rarity && { backgroundColor: `${r.color}30`, borderColor: r.color },
                      ]}
                      onPress={() => setRarity(r.rarity)}
                    >
                      <View style={[styles.rarityDot, { backgroundColor: r.color }]} />
                      <Text style={[styles.rarityLabel, rarity === r.rarity && { color: r.color }]}>
                        {r.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Difficulty */}
              <View style={styles.field}>
                <Text style={styles.label}>Zorluk</Text>
                <View style={styles.difficultyRow}>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <Pressable
                      key={d}
                      style={[styles.difficultyOption, difficulty >= d && styles.difficultyActive]}
                      onPress={() => setDifficulty(d as QuestDifficulty)}
                    >
                      <Text style={styles.difficultyStar}>⭐</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Reward */}
              <View style={styles.field}>
                <Text style={styles.label}>Ödül</Text>
                <View style={styles.rewardRow}>
                  <View style={styles.statPicker}>
                    {STATS.map((s) => (
                      <Pressable
                        key={s}
                        style={[styles.statOption, rewardStat === s && styles.statSelected]}
                        onPress={() => setRewardStat(s)}
                      >
                        <Text style={[styles.statText, rewardStat === s && styles.statTextSelected]}>
                          {s}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.tpInputContainer}>
                    <TextInput
                      style={styles.tpInput}
                      value={rewardTP}
                      onChangeText={setRewardTP}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={styles.tpLabel}>TP</Text>
                  </View>
                </View>
              </View>

              {/* Add Button */}
              <Pressable
                style={[styles.addButton, !title.trim() && styles.addButtonDisabled]}
                onPress={handleAdd}
                disabled={!title.trim()}
              >
                <Text style={styles.addButtonText}>➕ Görev Ekle</Text>
              </Pressable>

              <View style={{ height: 40 }} />
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    maxHeight: height * 0.9,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: colors.text.primary,
    fontSize: 18,
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSelected: {
    borderColor: colors.accent.gold,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  iconEmoji: {
    fontSize: 22,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeEmoji: {
    fontSize: 16,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.muted,
  },
  rarityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.muted,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  difficultyActive: {
    opacity: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  difficultyStar: {
    fontSize: 18,
  },
  rewardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statPicker: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  statOption: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderColor: colors.accent.blue,
  },
  statText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.muted,
  },
  statTextSelected: {
    color: colors.accent.blue,
  },
  tpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tpInput: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  tpLabel: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.accent.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
