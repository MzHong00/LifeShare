import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars';
import {
  Plus,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Users,
  ChevronRight,
  ChevronDown,
} from 'lucide-react-native';

import { Todo } from '@/types/todo';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useTodoStore } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import {
  getTodayDateString,
  isPastDate,
  getRelativeDateLabel,
  formatDate,
} from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

interface TodoItemProps {
  item: Todo;
  currentWorkspace: any;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

const TodoItem = ({
  item,
  currentWorkspace,
  onToggle,
  onPress,
}: TodoItemProps) => {
  const assignee = currentWorkspace?.members?.find(
    (m: any) => m.id === item.assigneeId,
  );

  return (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.checkboxArea}
        onPress={() => onToggle(item.id)}
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

          {item.dueDate && <Text style={styles.separator}>·</Text>}

          {item.dueDate && (
            <View
              style={[
                styles.metaItem,
                !item.isCompleted &&
                  isPastDate(item.dueDate) &&
                  styles.overdueBadgeSubtle,
              ]}
            >
              <CalendarIcon
                size={12}
                color={
                  !item.isCompleted && isPastDate(item.dueDate)
                    ? COLORS.error
                    : COLORS.textTertiary
                }
              />
              <Text
                style={[
                  styles.dueDateText,
                  !item.isCompleted &&
                    isPastDate(item.dueDate) &&
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

const TodoScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    getTodayDateString(),
  );

  const todos = useTodoStore(state => state.todos);
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);

  // Generate dates from 14 days ago to 14 days ahead

  const filteredTodos = useMemo(() => {
    const today = getTodayDateString();
    return todos.filter(todo => {
      if (todo.workspaceId !== currentWorkspace?.id) return false;
      if (showMineOnly && todo.assigneeId !== 'user-1') return false;

      if (selectedDate === 'all') return true;

      if (todo.dueDate) {
        if (selectedDate === today && !todo.isCompleted && todo.dueDate < today)
          return true;
        return todo.dueDate === selectedDate;
      }
      return selectedDate === today;
    });
  }, [todos, currentWorkspace?.id, showMineOnly, selectedDate]);

  const activeTodos = filteredTodos.filter(t => !t.isCompleted);
  const completedTodos = filteredTodos.filter(t => t.isCompleted);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setIsCalendarVisible(false);
  };

  const markedDates = useMemo(() => {
    if (selectedDate === 'all') return {};
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: COLORS.primary,
        selectedTextColor: COLORS.white,
      },
    };
  }, [selectedDate]);

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.headerDateSelector}
          onPress={() => setIsCalendarVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.screenTitle}>
            {selectedDate === 'all'
              ? '전체'
              : formatDate(selectedDate, 'M월 D일')}
            {' 일정'}
          </Text>
          <ChevronDown
            size={20}
            color={COLORS.textPrimary}
            style={styles.chevronDown}
          />
        </TouchableOpacity>

        <View style={styles.filterRow}>
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
                  setSelectedDate('all');
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
            <Text style={styles.sectionTitle}>할 일 {activeTodos.length}</Text>
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
          </View>
        )}

        {completedTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              완료됨 {completedTodos.length}
            </Text>
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
  headerTop: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 4,
  },
  screenTitle: {
    ...TYPOGRAPHY.header1,
    color: COLORS.textPrimary,
  },
  headerDateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chevronDown: {
    marginLeft: 4,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    justifyContent: 'flex-start',
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
