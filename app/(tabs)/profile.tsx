// Profile Screen - Player profile and settings
// Shows avatar, customization options, and app settings

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircularStat } from '../../components/fifa';
import { usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  const playerName = usePlayerStore((s) => s.playerName);
  const position = usePlayerStore((s) => s.position);
  const age = usePlayerStore((s) => s.age);
  const getGEN = usePlayerStore((s) => s.getGEN);
  const getMarketValue = usePlayerStore((s) => s.getMarketValue);
  const stats = usePlayerStore((s) => s.stats);
  const streakData = usePlayerStore((s) => s.streakData);
  const questStats = usePlayerStore((s) => s.questStats);
  const settings = usePlayerStore((s) => s.settings);
  const customization = usePlayerStore((s) => s.customization);
  const avatars = usePlayerStore((s) => s.avatars);
  const history = usePlayerStore((s) => s.history);
  const endDay = usePlayerStore((s) => s.endDay);

  const gen = getGEN();
  const marketValue = getMarketValue();

  // Get selected avatar
  const selectedAvatar = avatars.find((a) => a.id === customization.selectedAvatar);
  const avatarEmoji = selectedAvatar?.emoji || '⚽';

  // Format market value
  const formatValue = (value: number) => {
    if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
    return `€${value}`;
  };

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
            <Text style={styles.title}>👤 Profile</Text>
          </View>

          {/* Player Card */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.playerCard}
          >
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 165, 0, 0.05)']}
              style={styles.playerGradient}
            >
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarEmojiLarge}>{avatarEmoji}</Text>
              </View>
              <Text style={styles.playerName}>{playerName}</Text>
              <Text style={styles.playerMeta}>{position} • {age} years • Istanbul, TR</Text>
              
              <View style={styles.genSection}>
                <CircularStat value={gen} size={100} strokeWidth={8} label="GEN" delay={200} />
              </View>

              <View style={styles.marketValue}>
                <Text style={styles.marketLabel}>Market Value</Text>
                <Text style={styles.marketAmount}>{formatValue(marketValue)}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Stats Summary */}
          <Animated.View 
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.statsCard}
          >
            <Text style={styles.sectionTitle}>📊 Career Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>{questStats.totalCompleted}</Text>
                <Text style={styles.statBoxLabel}>Quests Done</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statBoxValue, { color: colors.stat.high }]}>
                  {streakData.longestStreak}
                </Text>
                <Text style={styles.statBoxLabel}>Best Streak</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statBoxValue, { color: colors.accent.gold }]}>
                  {history.length}
                </Text>
                <Text style={styles.statBoxLabel}>Days Logged</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>
                  {Math.round((stats.PRO + stats.PHY + stats.MEN + stats.DIS) / 4)}
                </Text>
                <Text style={styles.statBoxLabel}>Avg Stat</Text>
              </View>
            </View>
          </Animated.View>

          {/* Current Stats */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.statsCard}
          >
            <Text style={styles.sectionTitle}>📈 Current Stats</Text>
            <View style={styles.statBars}>
              <View style={styles.statBarRow}>
                <Text style={styles.statBarLabel}>PRO</Text>
                <View style={styles.statBarTrack}>
                  <View style={[styles.statBarFill, { width: `${stats.PRO}%`, backgroundColor: colors.accent.gold }]} />
                </View>
                <Text style={styles.statBarValue}>{stats.PRO}</Text>
              </View>
              <View style={styles.statBarRow}>
                <Text style={styles.statBarLabel}>PHY</Text>
                <View style={styles.statBarTrack}>
                  <View style={[styles.statBarFill, { width: `${stats.PHY}%`, backgroundColor: colors.accent.neon }]} />
                </View>
                <Text style={styles.statBarValue}>{stats.PHY}</Text>
              </View>
              <View style={styles.statBarRow}>
                <Text style={styles.statBarLabel}>MEN</Text>
                <View style={styles.statBarTrack}>
                  <View style={[styles.statBarFill, { width: `${stats.MEN}%`, backgroundColor: colors.accent.blue }]} />
                </View>
                <Text style={styles.statBarValue}>{stats.MEN}</Text>
              </View>
              <View style={styles.statBarRow}>
                <Text style={styles.statBarLabel}>DIS</Text>
                <View style={styles.statBarTrack}>
                  <View style={[styles.statBarFill, { width: `${stats.DIS}%`, backgroundColor: colors.accent.purple }]} />
                </View>
                <Text style={styles.statBarValue}>{stats.DIS}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Actions */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.actionsCard}
          >
            <Pressable 
              style={styles.actionButton}
              onPress={() => endDay()}
            >
              <LinearGradient
                colors={[colors.accent.gold, colors.accent.goldDim]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionText}>🌅 End Day & Reset Quests</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* App Info */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(500)}
            style={styles.infoCard}
          >
            <Text style={styles.infoText}>FIFA Life Dashboard v1.0</Text>
            <Text style={styles.infoSubtext}>Built with 💛 by Talha Güleryüz</Text>
            <Text style={styles.infoSubtext}>Feron Design Language</Text>
          </Animated.View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
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
  },
  playerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  playerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.accent.gold,
  },
  avatarEmojiLarge: {
    fontSize: 40,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  playerMeta: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 16,
  },
  genSection: {
    marginBottom: 16,
  },
  marketValue: {
    alignItems: 'center',
  },
  marketLabel: {
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  marketAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.accent.gold,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statBox: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statBoxLabel: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  statBars: {
    gap: 12,
  },
  statBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statBarLabel: {
    width: 36,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statBarValue: {
    width: 28,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    textAlign: 'right',
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoText: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 11,
    color: colors.text.muted,
    opacity: 0.7,
  },
  bottomPadding: {
    height: 100,
  },
});
