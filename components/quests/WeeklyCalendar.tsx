// Weekly Calendar Component - Shows weekly progress
// FIFA-style calendar with daily completion indicators

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors } from '../../theme/colors';

interface WeeklyCalendarProps {
  completionHistory?: Record<string, number>; // date -> completed count
  onDayPress?: (date: string) => void;
}

export function WeeklyCalendar({ completionHistory = {}, onDayPress }: WeeklyCalendarProps) {
  // Get current week days (Monday to Sunday)
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const today = new Date().toISOString().split('T')[0];
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Haftalık İlerleme</Text>
        <Text style={styles.subtitle}>Pzt - Paz</Text>
      </View>

      <View style={styles.calendar}>
        {weekDays.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const isToday = dateStr === today;
          const isPast = date < new Date(today);
          const completedCount = completionHistory[dateStr] || 0;
          const hasCompletions = completedCount > 0;

          return (
            <Pressable
              key={dateStr}
              style={[
                styles.dayCard,
                isToday && styles.todayCard,
                isPast && !hasCompletions && styles.missedCard,
              ]}
              onPress={() => onDayPress?.(dateStr)}
            >
              <Text style={[styles.dayName, isToday && styles.todayText]}>
                {dayNames[index]}
              </Text>
              <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                {date.getDate()}
              </Text>
              <View style={styles.indicator}>
                {hasCompletions ? (
                  <View style={[styles.completedDot, isToday && styles.todayDot]} />
                ) : isPast ? (
                  <View style={styles.missedDot} />
                ) : (
                  <View style={styles.emptyDot} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {completionHistory[today] 
            ? `✅ Bugün ${completionHistory[today]} görev tamamlandı`
            : '📋 Bugün henüz görev tamamlanmadı'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.text.muted,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  todayCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderColor: colors.accent.gold,
  },
  missedCard: {
    opacity: 0.5,
  },
  dayName: {
    fontSize: 10,
    color: colors.text.muted,
    marginBottom: 4,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 6,
  },
  todayText: {
    color: colors.accent.gold,
  },
  indicator: {
    alignItems: 'center',
  },
  completedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.stat.high,
  },
  todayDot: {
    backgroundColor: colors.accent.gold,
    shadowColor: colors.accent.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  missedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 59, 48, 0.5)',
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: colors.text.muted,
  },
});
