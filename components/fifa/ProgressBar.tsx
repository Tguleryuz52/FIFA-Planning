// ProgressBar - Animated horizontal progress bar
// Used for Kondisyon, TP pools, Energy, etc.

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors, getKondisyonColors } from '../../theme/colors';

interface ProgressBarProps {
  value: number;
  maxValue?: number;
  height?: number;
  label?: string;
  showPercentage?: boolean;
  type?: 'kondisyon' | 'tp' | 'energy' | 'custom';
  customColors?: string[];
  animate?: boolean;
  delay?: number;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function ProgressBar({
  value,
  maxValue = 100,
  height = 8,
  label,
  showPercentage = true,
  type = 'custom',
  customColors,
  animate = true,
  delay = 0,
}: ProgressBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Animation
  const animatedWidth = useSharedValue(0);
  
  React.useEffect(() => {
    if (animate) {
      animatedWidth.value = withDelay(delay, withTiming(percentage, { duration: 1000 }));
    } else {
      animatedWidth.value = percentage;
    }
  }, [percentage, animate, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  // Get colors based on type
  const getGradientColors = (): string[] => {
    if (customColors) return customColors;
    
    switch (type) {
      case 'kondisyon':
        return getKondisyonColors(value);
      case 'tp':
        return [colors.accent.blue, colors.accent.purple];
      case 'energy':
        if (value >= 70) return [colors.accent.neon, '#00CC6A'];
        if (value >= 40) return [colors.accent.warning, '#CC8800'];
        return [colors.accent.danger, '#CC3333'];
      default:
        return [colors.accent.blue, colors.accent.purple];
    }
  };

  const gradientColors = getGradientColors();

  return (
    <View style={styles.container}>
      {/* Label row */}
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, { color: gradientColors[0] }]}>
              {Math.round(value)}{type === 'kondisyon' ? '%' : `/${maxValue}`}
            </Text>
          )}
        </View>
      )}

      {/* Progress track */}
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fillContainer, animatedStyle]}>
          <LinearGradient
            colors={gradientColors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { height }]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: colors.text.muted,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  fillContainer: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: 100,
  },
  fill: {
    width: '100%',
    borderRadius: 100,
  },
});

export default ProgressBar;
