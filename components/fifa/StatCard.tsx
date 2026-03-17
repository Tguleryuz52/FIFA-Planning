// StatCard - FIFA-style stat display card with simple TP controls
// Shows PRO/PHY/MEN/DIS stats with just +/- buttons

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatType, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';
import { CircularStat } from './CircularStat';
import { GlowCard } from './GlowCard';
import { ProgressBar } from './ProgressBar';

interface StatCardProps {
  stat: StatType;
  delay?: number;
}

const statInfo: Record<StatType, { 
  name: string; 
  icon: string; 
  description: string; 
  color: 'gold' | 'neon' | 'blue' | 'purple';
}> = {
  PRO: {
    name: 'Professional',
    icon: '💼',
    description: 'İş performansı & Projeler',
    color: 'gold',
  },
  PHY: {
    name: 'Physical',
    icon: '💪',
    description: 'Spor, Sağlık & Uyku',
    color: 'neon',
  },
  MEN: {
    name: 'Mental',
    icon: '🧠',
    description: 'Meditasyon, Okuma & Öğrenme',
    color: 'blue',
  },
  DIS: {
    name: 'Discipline',
    icon: '🎯',
    description: 'Rutin takibi & Alışkanlıklar',
    color: 'purple',
  },
};

export function StatCard({ stat, delay = 0 }: StatCardProps) {
  const stats = usePlayerStore((s) => s.stats);
  const tpPools = usePlayerStore((s) => s.tpPools);
  const addTP = usePlayerStore((s) => s.addTP);
  const getSubStatsByParent = usePlayerStore((s) => s.getSubStatsByParent);
  const getActiveMultipliers = usePlayerStore((s) => s.getActiveMultipliers);

  const info = statInfo[stat];
  const value = stats[stat];
  const tpPool = tpPools[stat];
  const subStats = getSubStatsByParent(stat);
  const multipliers = getActiveMultipliers();
  const hasMultiplier = multipliers[stat] > 1;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)}>
      <GlowCard 
        glowColor={value >= 80 ? info.color : 'none'}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>{info.icon}</Text>
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <Text style={styles.statName}>{stat}</Text>
              {hasMultiplier && (
                <View style={styles.multiplierBadge}>
                  <Text style={styles.multiplierText}>
                    ×{multipliers[stat].toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.fullName}>{info.name}</Text>
          </View>
        </View>

        {/* Circular Stat */}
        <View style={styles.statContainer}>
          <CircularStat 
            value={value} 
            size={90} 
            strokeWidth={7}
            delay={delay + 200}
          />
        </View>

        {/* Sub-stats mini grid */}
        <View style={styles.subStatsGrid}>
          {subStats.slice(0, 4).map((subStat) => (
            <View key={subStat.id} style={styles.subStatItem}>
              <Text style={styles.subStatName}>{subStat.name}</Text>
              <Text style={[
                styles.subStatValue,
                subStat.value >= 75 && styles.subStatHigh,
                subStat.value >= 60 && subStat.value < 75 && styles.subStatMid,
              ]}>
                {subStat.value}
              </Text>
            </View>
          ))}
        </View>

        {/* TP Progress with +/- buttons */}
        <View style={styles.tpSection}>
          <View style={styles.tpRow}>
            <Text style={styles.tpLabel}>TP Pool</Text>
            <View style={styles.tpControls}>
              {/* Minus button */}
              <Pressable 
                style={({ pressed }) => [
                  styles.tpBtn, 
                  styles.tpBtnMinus,
                  pressed && styles.tpBtnPressed
                ]}
                onPress={() => addTP(stat, -1)}
              >
                <Text style={styles.tpBtnTextMinus}>−</Text>
              </Pressable>

              {/* TP value */}
              <Text style={styles.tpValue}>{tpPool}/10</Text>

              {/* Plus button */}
              <Pressable 
                style={({ pressed }) => [
                  styles.tpBtn, 
                  styles.tpBtnPlus,
                  pressed && styles.tpBtnPressed
                ]}
                onPress={() => addTP(stat, 1)}
              >
                <Text style={styles.tpBtnTextPlus}>+</Text>
              </Pressable>
            </View>
          </View>
          <ProgressBar
            value={tpPool}
            maxValue={10}
            height={6}
            showPercentage={false}
            type="tp"
            animate={true}
            delay={delay + 400}
          />
        </View>

        {/* Description */}
        <Text style={styles.description}>{info.description}</Text>
      </GlowCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  icon: {
    fontSize: 22,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  fullName: {
    fontSize: 10,
    color: colors.text.muted,
  },
  multiplierBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  multiplierText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.accent.gold,
  },
  statContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  subStatsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 3,
  },
  subStatItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  subStatName: {
    fontSize: 8,
    color: colors.text.muted,
  },
  subStatValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  subStatHigh: {
    color: colors.stat.high,
  },
  subStatMid: {
    color: colors.stat.mid,
  },
  // TP Section
  tpSection: {
    width: '100%',
    marginTop: 10,
  },
  tpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tpLabel: {
    fontSize: 11,
    color: colors.text.muted,
  },
  tpControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tpBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpBtnMinus: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
  },
  tpBtnPlus: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.4)',
  },
  tpBtnPressed: {
    opacity: 0.6,
  },
  tpBtnTextMinus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent.danger,
  },
  tpBtnTextPlus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.stat.high,
  },
  tpValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 35,
    textAlign: 'center',
  },
  description: {
    fontSize: 9,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StatCard;
