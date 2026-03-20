import { View, Text, StyleSheet } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';

import {
  APP_COLORS,
  THEME_COLORS,
  TYPOGRAPHY,
  SPACING,
} from '@/constants/theme';
import { modalActions } from '@/stores/useModalStore';
import { AppPressable } from '@/components/common/AppPressable';

interface StoryDateSelectorProps {
  date: string; // 선택된 날짜 (YYYY-MM-DD)
  onSelectDate: (date: string) => void; // 날짜 선택 후 콜백
}

/**
 * 날짜 선택 컴포넌트 (캘린더 모달 연동)
 */
export const StoryDateSelector = ({
  date,
  onSelectDate,
}: StoryDateSelectorProps) => {
  const handleOpenCalendar = () => {
    modalActions.showModal({
      type: 'none',
      title: '날짜 선택',
      content: (
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>날짜 선택</Text>
            <AppPressable onPress={() => modalActions.hideModal()}>
              <Text style={styles.closeText}>닫기</Text>
            </AppPressable>
          </View>
          <Calendar
            current={date}
            onDayPress={day => {
              onSelectDate(day.dateString);
              modalActions.hideModal();
            }}
            markedDates={{
              [date]: {
                selected: true,
                selectedColor: APP_COLORS.primary,
                selectedTextColor: THEME_COLORS.white,
              },
            }}
            theme={{
              selectedDayBackgroundColor: APP_COLORS.primary,
              todayTextColor: APP_COLORS.primary,
              arrowColor: APP_COLORS.primary,
              dotColor: APP_COLORS.primary,
            }}
          />
        </View>
      ),
    });
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>날짜</Text>
      <AppPressable
        style={[styles.input, styles.dateInput]}
        onPress={handleOpenCalendar}
      >
        <CalendarIcon size={20} color={APP_COLORS.primary} strokeWidth={2.5} />
        <Text style={[styles.dateText, { color: APP_COLORS.textPrimary }]}>
          {date}
        </Text>
      </AppPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  label: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: APP_COLORS.bgGray,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: APP_COLORS.textPrimary,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 24,
    width: '100%',
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarTitle: {
    ...TYPOGRAPHY.header2,
    color: APP_COLORS.textPrimary,
  },
  closeText: {
    color: APP_COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});
