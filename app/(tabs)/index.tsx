// FIFA Life Dashboard - Main Screen
// Shows PlayerHeader, Stats grid with TP controls, and quick actions

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlayerHeader, StatCard } from '../../components/fifa';
import { usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

export default function DashboardScreen() {
  const checkAndResetIfNewDay = usePlayerStore((s) => s.checkAndResetIfNewDay);
  const newsItems = usePlayerStore((s) => s.newsItems);
  const streakData = usePlayerStore((s) => s.streakData);
  const questStats = usePlayerStore((s) => s.questStats);

  // Check for new day on mount
  useEffect(() => {
    checkAndResetIfNewDay();
  }, []);

  // Format today's date
  const dateStr = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />
      
      {/* Background gradient */}
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
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <Text style={styles.logo}>⚽</Text>
            <Text style={styles.title}>FIFA Life Dashboard</Text>
            <Text style={styles.subtitle}>
              Level up your life. Track your growth. Become elite.
            </Text>
            
            {/* Status badges */}
            <View style={styles.badgeRow}>
              <View style={styles.badgeOnline}>
                <Text style={styles.badgeText}>🟢 Online</Text>
              </View>
              <View style={styles.badgeDate}>
                <Text style={styles.badgeDateText}>📅 {dateStr}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Player Header */}
          <PlayerHeader />

          {/* Stats Grid - Full StatCard with sub-stats and TP controls */}
          <Text style={styles.sectionTitle}>📊 Stats Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <StatCard stat="PRO" delay={100} />
            </View>
            <View style={styles.statItem}>
              <StatCard stat="PHY" delay={200} />
            </View>
            <View style={styles.statItem}>
              <StatCard stat="MEN" delay={300} />
            </View>
            <View style={styles.statItem}>
              <StatCard stat="DIS" delay={400} />
            </View>
          </View>

          {/* Quick Stats Footer */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{questStats.totalCompleted}</Text>
              <Text style={styles.quickStatLabel}>Quests Done</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: colors.stat.high }]}>
                {streakData.currentStreak}
              </Text>
              <Text style={styles.quickStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: colors.accent.gold }]}>
                {streakData.longestStreak}
              </Text>
              <Text style={styles.quickStatLabel}>Best Streak</Text>
            </View>
          </View>

          {/* Latest News */}
          {newsItems.length > 0 && (
            <View style={styles.newsSection}>
              <Text style={styles.sectionTitle}>📰 Latest Updates</Text>
              <View style={styles.newsList}>
                {newsItems.slice(0, 3).map((news, index) => (
                  <View key={index} style={styles.newsItem}>
                    <Text style={styles.newsText}>{news}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Built with 💛 by Talha Güleryüz • Feron Design
            </Text>
          </View>
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
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.accent.gold,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeOnline: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    color: colors.stat.high,
  },
  badgeDate: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeDateText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  quickStatLabel: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 4,
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  newsSection: {
    marginTop: 8,
  },
  newsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  newsItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  newsText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    fontSize: 11,
    color: colors.text.muted,
  },
});
