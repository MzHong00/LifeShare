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

import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useTodoStore, todoActions } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import {
  getTodayDateString,
  getIntermediateDates,
  formatDate,
} from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { Card } from '@/components/common/Card';
import { TodoItem } from '@/components/todo/TodoItem';

const CalendarScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [selected, setSelected] = useState(getTodayDateString());
  const [currentMonth, setCurrentMonth] = useState(getTodayDateString());

  const events = useCalendarStore(state => state.events);
  const todos = useTodoStore(state => state.todos);
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  const { toggleTodo } = todoActions;

  // Generate markedDates based on store events and todos
  const markedDates = useMemo(() => {
    const marks: any = {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: APP_COLORS.primary,
        selectedTextColor: THEME_COLORS.white,
      },
    };

    // Helper to add markers for a list of items with range and color
    const addMarkers = (items: any[]) => {
      items.forEach(item => {
        const range = [
          item.startDate,
          ...getIntermediateDates(item.startDate, item.endDate),
          item.endDate,
        ];
        const uniqueRange = [...new Set(range)];

        uniqueRange.forEach(date => {
          if (marks[date]) {
            marks[date].marked = true;
            // Prioritize orange/red dots or just keep the first one
            marks[date].dotColor =
              item.color || marks[date].dotColor || APP_COLORS.primary;
          } else {
            marks[date] = {
              marked: true,
              dotColor: item.color || APP_COLORS.primary,
            };
          }
        });
      });
    };

    addMarkers(events);
    addMarkers(todos);

    return marks;
  }, [selected, events, todos]);

  const selectedDateTodos = useMemo(() => {
    return todos.filter(
      todo =>
        todo.workspaceId === currentWorkspace?.id &&
        selected >= todo.startDate &&
        selected <= todo.endDate,
    );
  }, [todos, currentWorkspace?.id, selected]);

  const activeTodos = selectedDateTodos.filter(t => !t.isCompleted);
  const completedTodos = selectedDateTodos.filter(t => t.isCompleted);

  const formatHeaderDate = (dateStr: string) => {
    return formatDate(dateStr, 'YYYY년 M월');
  };

  const handleAdd = () => {
    navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME, {
      initialDate: selected,
    });
  };

  return (
    <AppSafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{formatHeaderDate(currentMonth)}</Text>
        <TouchableOpacity
          style={styles.addIconBtn}
          activeOpacity={0.7}
          onPress={handleAdd}
        >
          <Plus size={24} color={APP_COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.flex1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.calendarWrapper}>
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
              backgroundColor: THEME_COLORS.white,
              calendarBackground: THEME_COLORS.white,
              textSectionTitleColor: APP_COLORS.textTertiary,
              selectedDayBackgroundColor: APP_COLORS.primary,
              selectedDayTextColor: THEME_COLORS.white,
              todayTextColor: APP_COLORS.primary,
              dayTextColor: APP_COLORS.textPrimary,
              textDisabledColor: APP_COLORS.border,
              dotColor: APP_COLORS.primary,
              selectedDotColor: THEME_COLORS.white,
              arrowColor: APP_COLORS.primary,
              monthTextColor: APP_COLORS.textPrimary,
              indicatorColor: APP_COLORS.primary,
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
        </Card>

        <View style={styles.eventSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>할 일</Text>
          </View>

          {selectedDateTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>등록된 할 일이 없습니다.</Text>
            </View>
          ) : (
            <>
              {activeTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  item={todo}
                  currentWorkspace={currentWorkspace}
                  onToggle={toggleTodo}
                  onPress={id =>
                    navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME, {
                      todoId: id,
                    })
                  }
                />
              ))}
              {completedTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  item={todo}
                  currentWorkspace={currentWorkspace}
                  onToggle={toggleTodo}
                  onPress={id =>
                    navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME, {
                      todoId: id,
                    })
                  }
                />
              ))}
            </>
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
    color: APP_COLORS.textPrimary,
  },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: APP_COLORS.border,
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
    padding: 8,
    marginVertical: SPACING.lg,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.header2,
    fontSize: 17,
    color: APP_COLORS.textPrimary,
  },

  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: APP_COLORS.textTertiary,
  },
});

export default CalendarScreen;
