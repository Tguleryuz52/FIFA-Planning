// GlowCard - Glassmorphism card with optional glow effect
// FIFA-style premium card container

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

type GlowColor = 'gold' | 'neon' | 'blue' | 'purple' | 'none';

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: GlowColor;
  style?: ViewStyle;
  onPress?: () => void;
  delay?: number;
}

const glowColors: Record<GlowColor, string> = {
  gold: colors.accent.gold,
  neon: colors.accent.neon,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  none: 'transparent',
};

export function GlowCard({
  children,
  glowColor = 'none',
  style,
  onPress,
  delay = 0,
}: GlowCardProps) {
  const scale = useSharedValue(1);
  const hasGlow = glowColor !== 'none';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const cardContent = (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Glow effect layer */}
      {hasGlow && (
        <View 
          style={[
            styles.glowLayer, 
            { 
              shadowColor: glowColors[glowColor],
              shadowOpacity: 0.4,
            }
          ]} 
        />
      )}
      
      {/* Card content with gradient border */}
      <LinearGradient
        colors={
          hasGlow 
            ? [
                `${glowColors[glowColor]}20`,
                `${glowColors[glowColor]}05`,
              ]
            : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBorder, hasGlow && styles.glowBorder]}
      >
        <View style={[styles.innerCard, style]}>
          {children}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable 
        onPress={onPress} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 8,
  },
  gradientBorder: {
    borderRadius: 24,
    padding: 1,
  },
  glowBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  innerCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 23,
    padding: 16,
    // Subtle inner shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default GlowCard;
