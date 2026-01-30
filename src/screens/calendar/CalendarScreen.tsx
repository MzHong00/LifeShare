import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars';
import { Plus } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useCalendarStore } from '@/stores/useCalendarStore';
import {
  getTodayDateString,
  getIntermediateDates,
  formatDate,
} from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

const CalendarScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [selected, setSelected] = useState(getTodayDateString());
  const [currentMonth, setCurrentMonth] = useState(getTodayDateString());

  const events = useCalendarStore(state => state.events);

  // Generate markedDates based on store events
  const markedDates = useMemo(() => {
    const marks: any = {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: COLORS.primary,
        selectedTextColor: COLORS.white,
      },
    };

    events.forEach(event => {
      // Get full range including start and end
      const range = [
        event.startDate,
        ...getIntermediateDates(event.startDate, event.endDate),
        event.endDate,
      ];
      // Filter out duplicates if startDate equals endDate
      const uniqueRange = [...new Set(range)];

      uniqueRange.forEach(date => {
        if (marks[date]) {
          marks[date].marked = true;
          marks[date].dotColor = event.color || COLORS.primary;
        } else {
          marks[date] = {
            marked: true,
            dotColor: event.color || COLORS.primary,
          };
        }
      });
    });

    return marks;
  }, [selected, events]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.startDate !== b.startDate)
        return a.startDate.localeCompare(b.startDate);
      return (a.startTime || '').localeCompare(b.startTime || '');
    });
  }, [events]);

  const formatHeaderDate = (dateStr: string) => {
    return formatDate(dateStr, 'YYYY년 M월');
  };

  const handleAddEvent = () => {
    navigation.navigate(NAV_ROUTES.EVENT_CREATE.NAME, {
      initialDate: selected,
    });
  };

  const handleEditEvent = (eventId: string) => {
    navigation.navigate(NAV_ROUTES.EVENT_CREATE.NAME, { eventId });
  };

  return (
    <AppSafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{formatHeaderDate(currentMonth)}</Text>
        <TouchableOpacity
          style={styles.addIconBtn}
          activeOpacity={0.7}
          onPress={handleAddEvent}
        >
          <Plus size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.flex1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.calendarWrapper}>
          <Calendar
            current={selected}
            onDayPress={day => setSelected(day.dateString)}
            onMonthChange={month => {
              setCurrentMonth(month.dateString);
            }}
            markedDates={markedDates}
            renderHeader={() => null}
            hideArrows={true}
            theme={{
              backgroundColor: COLORS.white,
              calendarBackground: COLORS.white,
              textSectionTitleColor: COLORS.textTertiary,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: COLORS.white,
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textPrimary,
              textDisabledColor: COLORS.border,
              dotColor: COLORS.primary,
              selectedDotColor: COLORS.white,
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textPrimary,
              indicatorColor: COLORS.primary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '700',
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13,
            }}
            enableSwipeMonths={true}
            style={styles.calendar}
          />
        </View>

        <View style={styles.eventSection}>
          <Text style={styles.sectionTitle}>다가오는 일정</Text>

          {sortedEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>등록된 일정이 없습니다.</Text>
            </View>
          ) : (
            sortedEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                activeOpacity={0.7}
                onPress={() => handleEditEvent(event.id)}
              >
                <View
                  style={[styles.eventTag, { backgroundColor: event.color }]}
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>
                    {event.startDate === event.endDate
                      ? event.startDate
                      : `${event.startDate.slice(5)} ~ ${event.endDate.slice(
                          5,
                        )}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY.header1,
    color: COLORS.textPrimary,
  },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40,
  },
  eventSection: {
    marginTop: SPACING.sm,
  },
  calendarWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 8,
    marginVertical: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.header2,
    fontSize: 17,
    marginBottom: SPACING.lg,
    color: COLORS.textPrimary,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 20,
    marginBottom: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  eventTag: {
    width: 4,
    height: 32,
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
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  eventTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textTertiary,
  },
});

export default CalendarScreen;
