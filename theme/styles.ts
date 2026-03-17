// FIFA Life Design System - Shared Styles
// React Native StyleSheet equivalents of web CSS classes

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from './colors';

// Shared styles that can be spread into component StyleSheets
export const commonStyles = StyleSheet.create({
  // Glass card effect
  glassCard: {
    backgroundColor: colors.glass.bg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 8,
  } as ViewStyle,

  // Tactile surface (premium card feel)
  tactileSurface: {
    backgroundColor: colors.bg.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  } as ViewStyle,

  // Screen container
  screenContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  } as ViewStyle,

  // Content container with padding
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  } as ViewStyle,

  // Centered content
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  // Row with space between
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,

  // Gradient gold text (simulated - use with gold color)
  textGradientGold: {
    color: colors.accent.gold,
  } as TextStyle,

  // Primary heading
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  } as TextStyle,

  // Secondary heading
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  } as TextStyle,

  // Body text
  bodyText: {
    fontSize: 14,
    color: colors.text.secondary,
  } as TextStyle,

  // Muted/caption text
  mutedText: {
    fontSize: 12,
    color: colors.text.muted,
  } as TextStyle,

  // Small label
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,

  // Stat value text (large numbers)
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  } as TextStyle,

  // Elite stat glow effect (simulated with shadow)
  eliteGlow: {
    textShadowColor: colors.stat.elite,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  } as TextStyle,

  // Button base
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Primary button (gold)
  buttonPrimary: {
    backgroundColor: colors.accent.gold,
  } as ViewStyle,

  // Secondary button (glass)
  buttonSecondary: {
    backgroundColor: colors.glass.bg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  } as ViewStyle,

  // Button text
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,

  // Badge/tag
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  } as ViewStyle,

  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.secondary,
  } as TextStyle,

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  } as ViewStyle,

  // Section spacing
  section: {
    marginBottom: 24,
  } as ViewStyle,

  // Card grid (2 columns)
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  } as ViewStyle,

  gridItem2: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  } as ViewStyle,

  // Card grid (4 columns for stats on tablets)
  grid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  } as ViewStyle,

  gridItem4: {
    width: '25%',
    paddingHorizontal: 6,
    marginBottom: 12,
  } as ViewStyle,
});

// Animation timing configs (for Reanimated)
export const animationConfig = {
  fast: 200,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 200,
  },
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale
export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

// Font sizes
export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  hero: 48,
};

export default commonStyles;
