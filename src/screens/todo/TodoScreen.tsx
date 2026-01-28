import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import {
  Plus,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Users,
  ChevronRight,
} from 'lucide-react-native';

import { Todo } from '@/types/todo';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useTodoStore } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const TodoScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: new Date().toISOString().split('T')[0],
    end: null,
  });

  const todos = useTodoStore(state => state.todos);
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);

  // Generate dates from 14 days ago to 14 days ahead
  const dateList = useMemo(() => {
    const list = Array.from({ length: 29 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 14 + i);
      return {
        date: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('ko-KR', { weekday: 'short' }),
        dateNum: d.getDate(),
      };
    });
    // Prepend 'All' option
    return [{ date: 'all', day: '기록', dateNum: '전체' }, ...list];
  }, []);

  const filteredTodos = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return todos.filter(todo => {
      if (todo.workspaceId !== currentWorkspace?.id) return false;
      if (showMineOnly && todo.assigneeId !== 'user-1') return false;

      // Range filtering
      if (selectedRange.start && selectedRange.end) {
        if (!todo.dueDate) return false;
        return (
          todo.dueDate >= selectedRange.start &&
          todo.dueDate <= selectedRange.end
        );
      }

      // Single day filtering (legacy/default mode)
      if (selectedRange.start === 'all') return true;
      if (todo.dueDate) {
        if (
          selectedRange.start === today &&
          !todo.isCompleted &&
          todo.dueDate < today
        )
          return true;
        return todo.dueDate === selectedRange.start;
      }
      return selectedRange.start === today || selectedRange.start === 'all';
    });
  }, [todos, currentWorkspace?.id, showMineOnly, selectedRange]);

  const activeTodos = filteredTodos.filter(t => !t.isCompleted);
  const completedTodos = filteredTodos.filter(t => t.isCompleted);

  const getRelativeDateLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘까지';
    if (diffDays === 1) return '내일까지';
    if (diffDays === -1) return '어제까지';
    if (diffDays < 0) return `${Math.abs(diffDays)}일 지연`;

    return `${dateStr.split('-').slice(1).join('/')}까지`;
  };

  const renderTodoItem = (item: Todo) => {
    const assignee = currentWorkspace?.members?.find(
      m => m.id === item.assigneeId,
    );

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.todoItem}
        onPress={() =>
          navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME, { todoId: item.id })
        }
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={styles.checkboxArea}
          onPress={() => toggleTodo(item.id)}
        >
          {item.isCompleted ? (
            <CheckCircle2
              size={24}
              color={COLORS.primary}
              fill={COLORS.primaryLight}
            />
          ) : (
            <Circle size={24} color={COLORS.border} />
          )}
        </TouchableOpacity>

        <View style={styles.todoTextContainer}>
          <Text
            style={[styles.todoTitle, item.isCompleted && styles.completedText]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View style={styles.todoFooter}>
            {/* Assignee Group */}
            {item.assigneeId && assignee ? (
              <View style={styles.metaItem}>
                {assignee.avatar ? (
                  <Image
                    source={{ uri: assignee.avatar }}
                    style={styles.miniAvatar}
                  />
                ) : (
                  <View style={styles.initialAvatar}>
                    <Text style={styles.initialText}>
                      {assignee.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <Text style={styles.assigneeName}>{assignee.name}</Text>
              </View>
            ) : (
              <View style={styles.metaItem}>
                <Users size={12} color={COLORS.textTertiary} />
                <Text style={styles.assigneeName}>공통</Text>
              </View>
            )}

            {/* Separator Bullet */}
            {item.dueDate && <Text style={styles.separator}>·</Text>}

            {/* Due Date Group */}
            {item.dueDate && (
              <View
                style={[
                  styles.metaItem,
                  !item.isCompleted &&
                    new Date(item.dueDate) <
                      new Date(new Date().toISOString().split('T')[0]) &&
                    styles.overdueBadgeSubtle,
                ]}
              >
                <CalendarIcon
                  size={12}
                  color={
                    !item.isCompleted &&
                    new Date(item.dueDate) <
                      new Date(new Date().toISOString().split('T')[0])
                      ? COLORS.error
                      : COLORS.textTertiary
                  }
                />
                <Text
                  style={[
                    styles.dueDateText,
                    !item.isCompleted &&
                      new Date(item.dueDate) <
                        new Date(new Date().toISOString().split('T')[0]) &&
                      styles.overdueText,
                  ]}
                >
                  {getRelativeDateLabel(item.dueDate)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <ChevronRight size={16} color={COLORS.border} />
      </TouchableOpacity>
    );
  };

  const handleDayPress = (day: any) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: day.dateString, end: null });
    } else {
      if (day.dateString < selectedRange.start) {
        setSelectedRange({ start: day.dateString, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: day.dateString });
      }
      setIsCalendarVisible(false); // Close on range select
    }
  };

  const markedDates = useMemo(() => {
    const marks: any = {};
    if (selectedRange.start) {
      marks[selectedRange.start] = {
        selected: true,
        startingDay: true,
        color: COLORS.primary,
      };
    }
    if (selectedRange.end) {
      marks[selectedRange.end] = {
        selected: true,
        endingDay: true,
        color: COLORS.primary,
      };

      // Fill range
      let current = new Date(selectedRange.start!);
      const last = new Date(selectedRange.end);
      while (current < last) {
        current.setDate(current.getDate() + 1);
        const iso = current.toISOString().split('T')[0];
        if (iso !== selectedRange.end) {
          marks[iso] = {
            selected: true,
            color: COLORS.primaryLight,
            textColor: COLORS.primary,
          };
        }
      }
    }
    return marks;
  }, [selectedRange]);

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dateList.filter(d => d.date !== 'all')}
          keyExtractor={item => item.date}
          contentContainerStyle={styles.dateFilterContent}
          style={styles.dateFilter}
          initialScrollIndex={14}
          getItemLayout={(_, index) => ({
            length: 44 + 12,
            offset: (44 + 12) * index,
            index,
          })}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateItem,
                selectedRange.start === item.date &&
                  !selectedRange.end &&
                  styles.dateItemActive,
              ]}
              onPress={() =>
                setSelectedRange({ start: item.date as string, end: null })
              }
            >
              <Text
                style={[
                  styles.dateDay,
                  selectedRange.start === item.date &&
                    !selectedRange.end &&
                    styles.dateTextActive,
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dateNum,
                  selectedRange.start === item.date &&
                    !selectedRange.end &&
                    styles.dateTextActive,
                ]}
              >
                {item.dateNum}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.headerTop}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              (selectedRange.end || selectedRange.start === 'all') &&
                styles.filterChipActive,
            ]}
            onPress={() => setIsCalendarVisible(true)}
          >
            <CalendarIcon
              size={14}
              color={
                selectedRange.end || selectedRange.start === 'all'
                  ? COLORS.white
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.filterChipText,
                (selectedRange.end || selectedRange.start === 'all') &&
                  styles.filterChipTextActive,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {selectedRange.start === 'all'
                ? '전체 기간'
                : selectedRange.start && selectedRange.end
                ? `${selectedRange.start
                    .slice(5)
                    .replace(/-/g, '.')} ~ ${selectedRange.end
                    .slice(5)
                    .replace(/-/g, '.')}`
                : selectedRange.start?.slice(5).replace(/-/g, '.')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, showMineOnly && styles.filterChipActive]}
            onPress={() => setShowMineOnly(!showMineOnly)}
          >
            <Users
              size={14}
              color={showMineOnly ? COLORS.white : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.filterChipText,
                showMineOnly && styles.filterChipTextActive,
              ]}
            >
              내 할 일
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isCalendarVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>기간 선택</Text>
              <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType={'period'}
              theme={{
                selectedDayBackgroundColor: COLORS.primary,
                todayTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
                dotColor: COLORS.primary,
              }}
            />
            <View style={styles.calendarFooter}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedRange({ start: 'all', end: null });
                  setIsCalendarVisible(false);
                }}
              >
                <Text style={styles.resetText}>전체보기로 초기화</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.listContent}
      >
        {activeTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              하는 중 {activeTodos.length}
            </Text>
            {activeTodos.map(renderTodoItem)}
          </View>
        )}

        {completedTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              완료됨 {completedTodos.length}
            </Text>
            {completedTodos.map(renderTodoItem)}
          </View>
        )}

        {filteredTodos.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 등록된 할 일이 없어요.</Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME)}
            >
              <Text style={styles.emptyAddText}>할 일 추가하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME)}
      >
        <Plus size={30} color={COLORS.white} />
      </TouchableOpacity>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    marginTop: 10,
  },
  screenTitle: {
    ...TYPOGRAPHY.header1,
    color: COLORS.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 1,
    justifyContent: 'flex-end',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxWidth: '100%',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  dateFilter: {
    paddingLeft: SPACING.layout,
  },
  dateFilterContent: {
    paddingRight: SPACING.layout,
    gap: 12,
  },
  dateItem: {
    width: 44,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  dateDay: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dateTextActive: {
    color: COLORS.primary,
  },
  filterCheckbox: {
    marginBottom: 20,
    marginLeft: 4,
  },
  listContent: {
    padding: SPACING.layout,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textTertiary,
    marginBottom: 12,
    marginLeft: 4,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxArea: {
    padding: 4,
    marginRight: 10,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  todoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  separator: {
    marginHorizontal: 8,
    color: COLORS.border,
    fontSize: 12,
  },
  assigneeName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 7,
  },
  initialAvatar: {
    width: 18,
    height: 18,
    borderRadius: 7,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dueDateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  overdueBadgeSubtle: {
    // Subtle hint for overdue in footer
  },
  overdueText: {
    color: COLORS.error,
    fontWeight: '700',
  },
  allDateText: {
    fontSize: 13,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textTertiary,
    marginBottom: 16,
  },
  emptyAddBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
  },
  emptyAddText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: '100%',
    padding: 16,
    overflow: 'hidden',
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
    color: COLORS.textPrimary,
  },
  closeText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  calendarFooter: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    alignItems: 'center',
  },
  resetBtn: {
    paddingVertical: 8,
  },
  resetText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default TodoScreen;
