// Quest Stats Section - Shows real-time stat progress
// Animated stat cards with TP gains and level up effects

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { StatType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

const statConfig: Record<StatType, { color: string; icon: string; label: string }> = {
  PRO: { color: '#00D4FF', icon: '💼', label: 'Profesyonel' },
  PHY: { color: '#FF6B6B', icon: '💪', label: 'Fiziksel' },
  MEN: { color: '#9B59B6', icon: '🧠', label: 'Mental' },
  DIS: { color: '#2ECC71', icon: '🎯', label: 'Disiplin' },
};

interface StatCardProps {
  stat: StatType;
  delay: number;
}


function StatCard({ stat, delay }: StatCardProps) {
  const stats = usePlayerStore((s) => s.stats);
  const previousStats = usePlayerStore((s) => s.previousStats);
  const tpPools = usePlayerStore((s) => s.tpPools);
  const recentActivity = usePlayerStore((s) => s.recentTPActivities[stat]);
  
  const config = statConfig[stat];
  const value = stats[stat];
  const prevValue = previousStats[stat];
  const tp = tpPools[stat];
  const progress = (tp / 10) * 100;

  // Check for level up (stat increased)
  const leveledUp = value > prevValue;

  // Animation values
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const levelUpOpacity = useSharedValue(0);
  const levelUpTranslate = useSharedValue(0);

  // Animate on TP change
  useEffect(() => {
    if (recentActivity && Date.now() - recentActivity.timestamp < 2000) {
      scale.value = withSequence(
        withSpring(1.08, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
      glow.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 800 })
      );
    }
  }, [recentActivity]);

  // Level up animation - stays visible with subtle pulse
  useEffect(() => {
    if (leveledUp) {
      // Appear animation only, no fade out
      levelUpOpacity.value = withTiming(1, { duration: 300 });
      // Subtle continuous pulse effect
      levelUpTranslate.value = withSequence(
        withSpring(-3, { damping: 12 }),
        withSpring(0, { damping: 12 })
      );
    } else {
      levelUpOpacity.value = 0;
    }
  }, [leveledUp]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.8,
    shadowRadius: glow.value * 20,
  }));

  const levelUpStyle = useAnimatedStyle(() => ({
    opacity: levelUpOpacity.value,
    transform: [{ translateY: levelUpTranslate.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400)}
      style={[styles.statCard, animatedStyle, glowStyle, { shadowColor: config.color }]}
    >
      <LinearGradient
        colors={[`${config.color}15`, `${config.color}05`]}
        style={styles.cardGradient}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.statIcon}>{config.icon}</Text>
          <Text style={[styles.statLabel, { color: config.color }]}>{stat}</Text>
        </View>

        {/* Value with up arrow */}
        <View style={styles.valueRow}>
          <Text style={styles.statValue}>{value}</Text>
          {tp > 0 && (
            <View style={styles.arrowContainer}>
              <Text style={styles.upArrow}>↑</Text>
            </View>
          )}
        </View>

        {/* LEVEL UP Badge */}
        {leveledUp && (
          <Animated.View style={[styles.levelUpBadge, levelUpStyle]}>
            <LinearGradient
              colors={['#FFD700', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.levelUpGradient}
            >
              <Text style={styles.levelUpText}>⬆️ LEVEL UP!</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* TP Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%`, backgroundColor: config.color }
              ]} 
            />
          </View>
          <Text style={styles.tpText}>{tp}/10 TP</Text>
        </View>

        {/* Recent gain indicator */}
        {recentActivity && Date.now() - recentActivity.timestamp < 5000 && (
          <View style={[styles.gainBadge, { backgroundColor: `${config.color}30` }]}>
            <Text style={[styles.gainText, { color: config.color }]}>
              {recentActivity.amount > 0 ? '+' : ''}{recentActivity.amount} TP
            </Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

// Today's Progress Summary
function TodayProgress() {
  const quests = usePlayerStore((s) => s.quests);
  const questStats = usePlayerStore((s) => s.questStats);
  
  const completedToday = quests.filter(q => q.completedToday);
  const totalTPToday = completedToday.reduce((sum, q) => 
    sum + q.rewards.reduce((s, r) => s + r.tp, 0), 0
  );

  // Calculate TP by stat
  const tpByStat: Record<StatType, number> = { PRO: 0, PHY: 0, MEN: 0, DIS: 0 };
  completedToday.forEach(q => {
    q.rewards.forEach(r => {
      tpByStat[r.stat] += r.tp;
    });
  });

  const maxTP = Math.max(...Object.values(tpByStat), 1);

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.todayProgress}>
      <View style={styles.todayHeader}>
        <Text style={styles.todayTitle}>📈 Bugünkü Kazanımlar</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>+{totalTPToday} TP</Text>
        </View>
      </View>

      {/* TP Distribution Bars */}
      <View style={styles.distributionContainer}>
        {(['PRO', 'PHY', 'MEN', 'DIS'] as StatType[]).map((stat) => {
          const config = statConfig[stat];
          const value = tpByStat[stat];
          const width = value > 0 ? (value / maxTP) * 100 : 0;

          return (
            <View key={stat} style={styles.distributionRow}>
              <Text style={styles.distributionLabel}>{config.icon}</Text>
              <View style={styles.distributionTrack}>
                <Animated.View 
                  style={[
                    styles.distributionFill, 
                    { 
                      width: `${width}%`, 
                      backgroundColor: config.color,
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.distributionValue, { color: config.color }]}>
                {value > 0 ? `+${value}` : '0'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Streak & Motivation */}
      <View style={styles.motivationRow}>
        <Text style={styles.streakText}>
          🔥 {questStats.currentStreak} gün streak
        </Text>
        {completedToday.length >= 5 && (
          <Text style={styles.comboText}>⚡ COMBO AKTIF!</Text>
        )}
      </View>
    </Animated.View>
  );
}

export function QuestStatsSection() {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📊 Stat Gelişimi</Text>
        <Text style={styles.sectionSubtitle}>Görev tamamla, güçlen!</Text>
      </View>

      {/* Stat Cards Grid */}
      <View style={styles.statsGrid}>
        <StatCard stat="PRO" delay={0} />
        <StatCard stat="PHY" delay={50} />
        <StatCard stat="MEN" delay={100} />
        <StatCard stat="DIS" delay={150} />
      </View>

      {/* Today's Progress */}
      <TodayProgress />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.text.muted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardGradient: {
    padding: 14,
    minHeight: 110,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  arrowContainer: {
    marginLeft: 4,
    marginTop: -4,
  },
  upArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  levelUpBadge: {
    position: 'absolute',
    top: 45,
    right: 8,
    zIndex: 10,
  },
  levelUpGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelUpText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  progressContainer: {
    gap: 4,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tpText: {
    fontSize: 10,
    color: colors.text.muted,
  },
  gainBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gainText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  todayProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  todayTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent.gold,
  },
  distributionContainer: {
    gap: 10,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  distributionLabel: {
    fontSize: 14,
    width: 24,
  },
  distributionTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionValue: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 35,
    textAlign: 'right',
  },
  motivationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  streakText: {
    fontSize: 12,
    color: colors.text.muted,
  },
  comboText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent.gold,
  },
});
