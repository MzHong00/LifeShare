import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

const CalendarScreen = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  // 간단한 캘린더 그리드 데이터 예시
  const renderCalendar = () => {
    const cells = [];
    for (let i = 1; i <= 31; i++) {
      cells.push(
        <View key={i} style={styles.dayCell}>
          <Text style={styles.dayText}>{i}</Text>
          {i === 14 && <View style={styles.eventDot} />}
          {i === 24 && (
            <View
              style={[styles.eventDot, { backgroundColor: COLORS.primary }]}
            />
          )}
        </View>,
      );
    }
    return cells;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={TYPOGRAPHY.header1}>캘린더</Text>
          <Text style={styles.subtitle}>우리의 소중한 일정</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <TouchableOpacity>
            <ChevronLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>2024년 3월</Text>
          <TouchableOpacity>
            <ChevronRight size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {days.map(day => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>{renderCalendar()}</View>
      </View>

      <ScrollView style={styles.eventList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>다가오는 일정</Text>

        <TouchableOpacity style={styles.eventItem}>
          <View style={[styles.eventTag, { backgroundColor: COLORS.error }]} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>1300일 기념일 ❤️</Text>
            <Text style={styles.eventTime}>3월 14일 (목) • 하루 종일</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.eventItem}>
          <View
            style={[styles.eventTag, { backgroundColor: COLORS.primary }]}
          />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>벚꽃 놀이 가기 🌸</Text>
            <Text style={styles.eventTime}>3월 24일 (일) • 오후 2:00</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.layout,
    padding: SPACING.lg,
    borderRadius: 24,
    marginBottom: SPACING.xl,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  monthTitle: {
    ...TYPOGRAPHY.header2,
    fontSize: 18,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  weekDayText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 40,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '500',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.error,
    marginTop: 2,
  },
  eventList: {
    paddingHorizontal: SPACING.layout,
  },
  sectionTitle: {
    ...TYPOGRAPHY.header2,
    fontSize: 16,
    marginBottom: SPACING.lg,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  eventTag: {
    width: 4,
    height: 30,
    borderRadius: 2,
    marginRight: SPACING.lg,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...TYPOGRAPHY.body1,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  eventTime: {
    ...TYPOGRAPHY.caption,
  },
});

export default CalendarScreen;
