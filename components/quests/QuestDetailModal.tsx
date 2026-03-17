// Quest Detail Modal - View and edit quest details
// Shows statistics, completion history, and edit/delete options

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

import { Quest, QuestRarity, QuestType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

const rarityColors: Record<QuestRarity, string> = {
  COMMON: colors.rarity.common,
  RARE: colors.rarity.rare,
  EPIC: colors.rarity.epic,
  LEGENDARY: colors.rarity.legendary,
};

const typeInfo: Record<QuestType, { label: string; color: string; emoji: string }> = {
  MAIN: { label: 'Ana Görev', color: colors.quest.main, emoji: '⚔️' },
  SIDE: { label: 'Yan Görev', color: colors.quest.side, emoji: '🎯' },
  SPECIAL: { label: 'Efsanevi', color: colors.quest.special, emoji: '👑' },
};

interface QuestDetailModalProps {
  quest: Quest | null;
  visible: boolean;
  onClose: () => void;
}

export function QuestDetailModal({ quest, visible, onClose }: QuestDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const updateQuest = usePlayerStore((s) => s.updateQuest);
  const deleteQuest = usePlayerStore((s) => s.deleteQuest);

  if (!quest) return null;

  const info = typeInfo[quest.type];
  const rarityColor = rarityColors[quest.rarity];

  const handleEdit = () => {
    setEditTitle(quest.title);
    setEditDescription(quest.description || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    updateQuest(quest.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteQuest(quest.id);
    onClose();
  };

  const completionRate = quest.totalCompletions > 0 
    ? Math.round((quest.totalCompletions / Math.max(1, quest.totalCompletions)) * 100) 
    : 0;

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
              <View style={[styles.iconContainer, { backgroundColor: `${info.color}20` }]}>
                <Text style={styles.icon}>{quest.icon}</Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Title & Description */}
              {isEditing ? (
                <View style={styles.editSection}>
                  <TextInput
                    style={styles.editInput}
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholder="Görev başlığı"
                    placeholderTextColor={colors.text.muted}
                  />
                  <TextInput
                    style={[styles.editInput, styles.editTextArea]}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    placeholder="Açıklama"
                    placeholderTextColor={colors.text.muted}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.title}>{quest.title}</Text>
                  {quest.description && (
                    <Text style={styles.description}>{quest.description}</Text>
                  )}
                </>
              )}

              {/* Tags */}
              <View style={styles.tagsRow}>
                <View style={[styles.tag, { backgroundColor: `${info.color}20` }]}>
                  <Text style={[styles.tagText, { color: info.color }]}>
                    {info.emoji} {info.label}
                  </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: `${rarityColor}20` }]}>
                  <Text style={[styles.tagText, { color: rarityColor }]}>
                    {quest.rarity}
                  </Text>
                </View>
                <View style={styles.difficultyTag}>
                  <Text style={styles.difficultyText}>
                    {'⭐'.repeat(quest.difficulty)}
                  </Text>
                </View>
              </View>

              {/* Rewards */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎁 Ödüller</Text>
                <View style={styles.rewardsGrid}>
                  {quest.rewards.map((reward, idx) => (
                    <View key={idx} style={styles.rewardCard}>
                      <Text style={styles.rewardStat}>{reward.stat}</Text>
                      <Text style={styles.rewardTP}>+{reward.tp} TP</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Statistics */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{quest.totalCompletions}</Text>
                    <Text style={styles.statLabel}>Toplam Tamamlama</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {quest.completedToday ? '✓' : '—'}
                    </Text>
                    <Text style={styles.statLabel}>Bugün</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>-10</Text>
                    <Text style={styles.statLabel}>Enerji Maliyeti</Text>
                  </View>
                </View>
              </View>

              {/* Last Completed */}
              {quest.completedAt && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🕐 Son Tamamlama</Text>
                  <Text style={styles.lastCompleted}>
                    {new Date(quest.completedAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                {isEditing ? (
                  <>
                    <Pressable style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                      <Text style={styles.cancelButtonText}>İptal</Text>
                    </Pressable>
                    <Pressable style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.saveButtonText}>💾 Kaydet</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable style={styles.editButton} onPress={handleEdit}>
                      <Text style={styles.editButtonText}>✏️ Düzenle</Text>
                    </Pressable>
                    {quest.isCustom && (
                      <Pressable style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>🗑️ Sil</Text>
                      </Pressable>
                    )}
                  </>
                )}
              </View>
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
    maxHeight: height * 0.85,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 16,
    lineHeight: 20,
  },
  editSection: {
    marginBottom: 16,
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  editTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  difficultyText: {
    fontSize: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rewardCard: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  rewardStat: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent.blue,
    marginBottom: 4,
  },
  rewardTP: {
    fontSize: 12,
    color: colors.text.muted,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.muted,
    textAlign: 'center',
  },
  lastCompleted: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text.muted,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.accent.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
