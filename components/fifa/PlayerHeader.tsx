// PlayerHeader - FIFA-style player info card
// Shows avatar, name, position, GEN overall, kondisyon, and streak

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';
import { CircularStat } from './CircularStat';
import { ProgressBar } from './ProgressBar';

export function PlayerHeader() {
  // Store selectors
  const playerName = usePlayerStore((s) => s.playerName);
  const position = usePlayerStore((s) => s.position);
  const age = usePlayerStore((s) => s.age);
  const getGEN = usePlayerStore((s) => s.getGEN);
  const kondisyon = usePlayerStore((s) => s.kondisyon);
  const energy = usePlayerStore((s) => s.energy);
  const streakData = usePlayerStore((s) => s.streakData);
  const checkAndUpdateStreak = usePlayerStore((s) => s.checkAndUpdateStreak);
  const customization = usePlayerStore((s) => s.customization);
  const avatars = usePlayerStore((s) => s.avatars);

  const gen = getGEN();

  // Get selected avatar
  const selectedAvatar = avatars.find((a) => a.id === customization.selectedAvatar);
  const avatarEmoji = selectedAvatar?.emoji || '⚽';

  // Check streak on mount
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  // Avatar scale animation
  const avatarScale = useSharedValue(0);
  useEffect(() => {
    avatarScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, []);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const getKondisyonLabel = () => {
    if (kondisyon >= 80) return 'Excellent';
    if (kondisyon >= 60) return 'Good';
    if (kondisyon >= 40) return 'Tired';
    if (kondisyon >= 20) return 'Exhausted';
    return 'Burnout!';
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
        style={styles.card}
      >
        <View style={styles.content}>
          {/* Avatar */}
          <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 165, 0, 0.2)']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
            </LinearGradient>
            {/* Position badge */}
            <LinearGradient
              colors={[colors.accent.gold, colors.accent.goldDim]}
              style={styles.positionBadge}
            >
              <Text style={styles.positionText}>{position}</Text>
            </LinearGradient>
          </Animated.View>

          {/* Player Info */}
          <View style={styles.infoSection}>
            <Animated.Text 
              entering={FadeInUp.delay(200).duration(400)}
              style={styles.playerName}
            >
              {playerName}
            </Animated.Text>
            
            <Animated.View 
              entering={FadeInUp.delay(300).duration(400)}
              style={styles.metaRow}
            >
              <Text style={styles.metaText}>🎂 {age} years</Text>
              <Text style={styles.metaText}>📍 Istanbul, TR</Text>
            </Animated.View>

            {/* Kondisyon Bar */}
            <Animated.View 
              entering={FadeInUp.delay(400).duration(400)}
              style={styles.barSection}
            >
              <ProgressBar
                value={kondisyon}
                maxValue={100}
                height={8}
                label={`Kondisyon - ${getKondisyonLabel()}`}
                type="kondisyon"
                delay={500}
              />
            </Animated.View>

            {/* Energy Bar */}
            <Animated.View 
              entering={FadeInUp.delay(500).duration(400)}
              style={styles.barSection}
            >
              <ProgressBar
                value={energy.current}
                maxValue={energy.max}
                height={6}
                label="Energy"
                type="energy"
                delay={600}
              />
            </Animated.View>
          </View>

          {/* GEN Score */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(500)}
            style={styles.genContainer}
          >
            <CircularStat
              value={gen}
              size={100}
              strokeWidth={10}
              label="GEN"
              delay={400}
            />
            <Text style={styles.overallLabel}>Overall Rating</Text>
          </Animated.View>
        </View>

        {/* Streak Indicator */}
        <Animated.View 
          entering={FadeInUp.delay(600).duration(400)}
          style={styles.streakContainer}
        >
          <LinearGradient
            colors={['rgba(255, 165, 0, 0.2)', 'rgba(255, 68, 68, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.streakBadge}
          >
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakLabel}>Streak</Text>
              <Text style={styles.streakValue}>{streakData.currentStreak} days</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  positionBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  positionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  infoSection: {
    flex: 1,
  },
  playerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  barSection: {
    marginBottom: 8,
  },
  genContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  overallLabel: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  streakContainer: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    gap: 8,
  },
  streakIcon: {
    fontSize: 20,
  },
  streakLabel: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.accent.warning,
  },
});

export default PlayerHeader;
