import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {
  CheckCircle2,
  Circle,
  Users,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react-native';
import { Todo } from '@/types/todo';
import { APP_COLORS, TYPOGRAPHY, THEME_COLORS } from '@/constants/theme';
import { isPastDate, getRelativeDateLabel } from '@/utils/date';
import { Card } from '@/components/common/Card';

interface TodoItemProps {
  item: Todo;
  currentWorkspace: any;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

export const TodoItem = ({
  item,
  currentWorkspace,
  onToggle,
  onPress,
}: TodoItemProps) => {
  const assignee = currentWorkspace?.members?.find(
    (m: any) => m.id === item.assigneeId,
  );

  return (
    <Card
      style={[
        styles.todoItem,
        {
          backgroundColor: item.color ? `${item.color}15` : THEME_COLORS.grey50,
          borderColor: item.color ? `${item.color}30` : APP_COLORS.border,
        },
      ]}
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
            color={item.color || APP_COLORS.primary}
            fill={THEME_COLORS.white}
          />
        ) : (
          <Circle size={24} color={APP_COLORS.textTertiary} />
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
                <View
                  style={[
                    styles.initialAvatar,
                    {
                      backgroundColor: THEME_COLORS.white,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initialText,
                      { color: item.color || APP_COLORS.primary },
                    ]}
                  >
                    {assignee.name.charAt(0)}
                  </Text>
                </View>
              )}
              <Text style={styles.assigneeName}>{assignee.name}</Text>
            </View>
          ) : (
            <View style={styles.metaItem}>
              <Users size={12} color={APP_COLORS.textTertiary} />
              <Text style={styles.assigneeName}>공통</Text>
            </View>
          )}

          {item.startDate && <Text style={styles.separator}>·</Text>}

          {item.startDate && (
            <View
              style={[
                styles.metaItem,
                !item.isCompleted &&
                  isPastDate(item.endDate) &&
                  styles.overdueBadgeSubtle,
              ]}
            >
              <CalendarIcon
                size={12}
                color={
                  !item.isCompleted && isPastDate(item.endDate)
                    ? APP_COLORS.error
                    : APP_COLORS.textTertiary
                }
              />
              <Text
                style={[
                  styles.dueDateText,
                  !item.isCompleted &&
                    isPastDate(item.endDate) &&
                    styles.overdueText,
                ]}
              >
                {item.startDate === item.endDate
                  ? getRelativeDateLabel(item.startDate)
                  : `${getRelativeDateLabel(
                      item.startDate,
                    )} ~ ${getRelativeDateLabel(item.endDate)}`}
              </Text>
            </View>
          )}
        </View>
      </View>
      <ChevronRight size={16} color={APP_COLORS.textTertiary} />
    </Card>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
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
    color: APP_COLORS.textPrimary,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: APP_COLORS.textTertiary,
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
    color: APP_COLORS.border,
    fontSize: 12,
  },
  assigneeName: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
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
    backgroundColor: APP_COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 9,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  dueDateText: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    fontWeight: '500',
  },
  overdueBadgeSubtle: {},
  overdueText: {
    color: APP_COLORS.error,
    fontWeight: '700',
  },
});
