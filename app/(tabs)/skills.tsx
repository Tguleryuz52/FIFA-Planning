// Skills Screen - Skill tree display
// Shows all skills with levels and XP progress

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircularStat, ProgressBar } from '../../components/fifa';
import { Skill, SkillCategory, usePlayerStore } from '../../stores/playerStore';
import { colors } from '../../theme/colors';

// Category info
const categoryInfo: Record<SkillCategory, { label: string; icon: string; color: string }> = {
  technical: { label: 'Technical', icon: '💻', color: colors.accent.blue },
  creative: { label: 'Creative', icon: '🎨', color: colors.accent.purple },
  business: { label: 'Business', icon: '📈', color: colors.accent.gold },
  personal: { label: 'Personal', icon: '🧘', color: colors.accent.neon },
  other: { label: 'Other', icon: '📦', color: colors.text.muted },
};

interface SkillCardProps {
  skill: Skill;
  index: number;
}

function SkillCard({ skill, index }: SkillCardProps) {
  const catInfo = categoryInfo[skill.category];
  const xpPercentage = (skill.xp / skill.xpToNextLevel) * 100;

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 80).duration(400)}
      style={styles.skillCard}
    >
      <View style={styles.skillHeader}>
        <View style={styles.skillIcon}>
          <Text style={styles.skillEmoji}>{skill.icon}</Text>
        </View>
        <View style={styles.skillInfo}>
          <Text style={styles.skillName}>{skill.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: `${catInfo.color}20` }]}>
            <Text style={[styles.categoryText, { color: catInfo.color }]}>
              {catInfo.icon} {catInfo.label}
            </Text>
          </View>
        </View>
        <CircularStat
          value={skill.level}
          size={60}
          strokeWidth={5}
          animate={true}
          delay={index * 80 + 200}
        />
      </View>

      {/* Description */}
      {skill.description && (
        <Text style={styles.skillDescription}>{skill.description}</Text>
      )}

      {/* XP Progress */}
      <View style={styles.xpSection}>
        <ProgressBar
          value={skill.xp}
          maxValue={skill.xpToNextLevel}
          height={6}
          label={`XP: ${skill.xp}/${skill.xpToNextLevel}`}
          showPercentage={false}
          type="custom"
          customColors={[catInfo.color, catInfo.color]}
          animate={true}
          delay={index * 80 + 300}
        />
      </View>
    </Animated.View>
  );
}

export default function SkillsScreen() {
  const skills = usePlayerStore((s) => s.skills);
  const getSkillsByCategory = usePlayerStore((s) => s.getSkillsByCategory);

  // Calculate average skill level
  const avgLevel = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)
    : 0;

  // Group skills by category
  const technicalSkills = getSkillsByCategory('technical');
  const creativeSkills = getSkillsByCategory('creative');
  const businessSkills = getSkillsByCategory('business');
  const personalSkills = getSkillsByCategory('personal');

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
            <Text style={styles.title}>🌳 Skill Tree</Text>
            <Text style={styles.subtitle}>
              Track your real-world skills and level them up
            </Text>
          </View>

          {/* Stats overview */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{skills.length}</Text>
              <Text style={styles.statLabel}>Total Skills</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.accent.gold }]}>{avgLevel}</Text>
              <Text style={styles.statLabel}>Avg Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.stat.high }]}>
                {skills.filter((s) => s.level >= 70).length}
              </Text>
              <Text style={styles.statLabel}>Expert (70+)</Text>
            </View>
          </View>

          {/* Skills by category */}
          {technicalSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💻 Technical Skills</Text>
              {technicalSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </View>
          )}

          {creativeSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎨 Creative Skills</Text>
              {creativeSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </View>
          )}

          {businessSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 Business Skills</Text>
              {businessSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </View>
          )}

          {personalSkills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧘 Personal Skills</Text>
              {personalSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </View>
          )}

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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  skillCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skillEmoji: {
    fontSize: 22,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  skillDescription: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 10,
    marginBottom: 12,
  },
  xpSection: {
    marginTop: 12,
  },
  bottomPadding: {
    height: 100,
  },
});
