import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react-native';

import { APP_COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useTodoStore, todoActions } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { getTodayDateString } from '@/utils/date';
import { Card } from '@/components/common/Card';
import { AppPressable } from '@/components/common/AppPressable';

export const RecentCalendar = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const today = getTodayDateString();
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  const events = useCalendarStore(state => state.events);
  const todos = useTodoStore(state => state.todos);
  const { toggleTodo } = todoActions;

  // Today's events
  const todayEvents = events
    .filter(
      e =>
        e.workspaceId === currentWorkspace?.id &&
        today >= e.startDate &&
        today <= e.endDate,
    )
    .slice(0, 2);

  // Today's todos
  const todayTodos = todos
    .filter(
      t =>
        t.workspaceId === currentWorkspace?.id &&
        today >= t.startDate &&
        today <= t.endDate,
    )
    .slice(0, 3);

  const hasData = todayEvents.length > 0 || todayTodos.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 일정</Text>
        <AppPressable
          style={styles.moreBtn}
          onPress={() => navigation.navigate(NAV_ROUTES.CALENDAR.NAME)}
        >
          <Text style={styles.moreText}>전체보기</Text>
          <ChevronRight size={14} color={APP_COLORS.textSecondary} />
        </AppPressable>
      </View>

      {!hasData ? (
        <Card
          style={styles.emptyCard}
          onPress={() => navigation.navigate(NAV_ROUTES.CALENDAR.NAME)}
        >
          <CalendarIcon
            size={24}
            color={APP_COLORS.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>오늘은 예정된 일정이 없어요.</Text>
          <Text style={styles.emptySubText}>새로운 일정을 추가해보세요</Text>
        </Card>
      ) : (
        <View style={styles.content}>
          {todayEvents.map(event => (
            <AppPressable
              key={event.id}
              onPress={() => navigation.navigate(NAV_ROUTES.CALENDAR.NAME)}
            >
              <Card style={styles.eventCard}>
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: event.color || APP_COLORS.primary },
                  ]}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  <Text style={styles.cardTime}>종일</Text>
                </View>
              </Card>
            </AppPressable>
          ))}

          {todayTodos.map(todo => (
            <Card key={todo.id} style={styles.todoCard}>
              <AppPressable
                style={styles.checkbox}
                onPress={() => toggleTodo(todo.id)}
              >
                {todo.isCompleted ? (
                  <CheckCircle2
                    size={24}
                    color={todo.color || APP_COLORS.primary}
                    fill={(todo.color || APP_COLORS.primary) + '20'}
                  />
                ) : (
                  <View
                    style={[
                      styles.circle,
                      { borderColor: todo.color || APP_COLORS.border },
                    ]}
                  />
                )}
              </AppPressable>
              <AppPressable
                style={styles.todoInfo}
                onPress={() =>
                  navigation.navigate(NAV_ROUTES.TODO_CREATE.NAME, {
                    todoId: todo.id,
                  })
                }
              >
                <Text
                  style={[
                    styles.todoTitle,
                    todo.isCompleted && styles.completedText,
                  ]}
                >
                  {todo.title}
                </Text>
              </AppPressable>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.layout,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.header2,
    fontSize: 17,
    color: APP_COLORS.textPrimary,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    ...TYPOGRAPHY.caption,
    color: APP_COLORS.textSecondary,
    marginRight: 2,
  },
  content: {
    gap: 10,
  },
  eventCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    ...TYPOGRAPHY.body1,
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  cardTime: {
    ...TYPOGRAPHY.caption,
    color: APP_COLORS.textTertiary,
    marginTop: 2,
  },
  todoCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  todoInfo: {
    flex: 1,
  },
  todoTitle: {
    ...TYPOGRAPHY.body1,
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: APP_COLORS.textTertiary,
  },
  emptyCard: {
    paddingVertical: 30,
    alignItems: 'center',
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: APP_COLORS.border,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
  },
  emptySubText: {
    ...TYPOGRAPHY.caption,
    color: APP_COLORS.textTertiary,
    marginTop: 4,
  },
});
