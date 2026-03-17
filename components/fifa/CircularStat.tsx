// CircularStat - FIFA-style circular progress indicator
// Displays stats 0-99 with color coding based on value

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, getStatColor } from '../../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularStatProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  animate?: boolean;
  delay?: number;
}

export function CircularStat({
  value,
  maxValue = 99,
  size = 120,
  strokeWidth = 8,
  label,
  showValue = true,
  animate = true,
  delay = 0,
}: CircularStatProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / maxValue, 1);
  
  // Animated progress
  const animatedProgress = useSharedValue(0);
  
  React.useEffect(() => {
    if (animate) {
      animatedProgress.value = withDelay(delay, withTiming(progress, { duration: 1500 }));
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animate, delay]);

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference - animatedProgress.value * circumference;
    return {
      strokeDashoffset: offset,
    };
  });

  // Get colors based on value
  const getGradientColors = () => {
    if (value >= 80) return ['#FFD700', '#FFA500']; // Elite - Gold
    if (value >= 70) return ['#00FF88', '#00CC6A']; // High - Green
    if (value >= 50) return ['#FFAA00', '#FF8800']; // Mid - Orange
    return ['#FF4444', '#CC2222']; // Low - Red
  };

  const gradientColors = getGradientColors();
  const statColor = getStatColor(value);
  const isElite = value >= 80;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center content */}
      {showValue && (
        <View style={styles.centerContent}>
          <Text 
            style={[
              styles.value, 
              { color: statColor },
              isElite && styles.eliteGlow
            ]}
          >
            {value}
          </Text>
          {label && (
            <Text style={styles.label}>{label}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  eliteGlow: {
    textShadowColor: colors.stat.elite,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});

export default CircularStat;
