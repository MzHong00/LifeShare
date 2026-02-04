import { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Text,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import {
  Check,
  Users,
  Calendar as CalendarIcon,
  Trash2,
} from 'lucide-react-native';

import '@/lib/reactNativeCalendars';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useTodoStore, todoActions } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import {
  getTodayDateString,
  getDateWithOffset,
  formatDate,
} from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { HeaderButton } from '@/components/common/HeaderButton';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/common/Button';
import { FormLabel } from '@/components/common/FormLabel';

type TodoCreateRouteProp = RouteProp<
  { TodoCreate: { todoId?: string } },
  'TodoCreate'
>;

const TodoCreateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TodoCreateRouteProp>();
  const todoId = route.params?.todoId;

  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  const { todos } = useTodoStore();
  const { addTodo, updateTodo, removeTodo } = todoActions;
  const { showModal } = modalActions;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    if (todoId) {
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setAssigneeId(todo.assigneeId);
        setDueDate(todo.dueDate || getTodayDateString());
      }
    }
  }, [todoId, todos]);

  const handleDelete = useCallback(() => {
    showModal({
      type: 'confirm',
      title: '할 일 삭제',
      message: '이 할 일을 삭제하시겠습니까?',
      onConfirm: () => {
        if (todoId) {
          removeTodo(todoId);
          navigation.goBack();
        }
      },
    });
  }, [todoId, removeTodo, navigation, showModal]);

  const renderHeaderRight = useCallback(
    () =>
      todoId ? (
        <HeaderButton
          onPress={handleDelete}
          icon={<Trash2 size={24} color={COLORS.error} />}
        />
      ) : undefined,
    [todoId, handleDelete],
  );

  const members = currentWorkspace?.members || [];

  const handleCreateOrUpdate = () => {
    if (!title.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '할 일 제목을 입력해주세요.',
      });
      return;
    }

    if (!currentWorkspace) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '워크스페이스 정보가 없습니다.',
      });
      return;
    }

    if (!dueDate.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '마감 기한을 선택해주세요.',
      });
      return;
    }

    const todoData = {
      workspaceId: currentWorkspace.id,
      title: title.trim(),
      description: description.trim(),
      isCompleted: false,
      assigneeId,
      dueDate: dueDate.trim(),
    };

    if (todoId) {
      updateTodo(todoId, todoData);
      showModal({
        type: 'alert',
        title: '알림',
        message: '할 일이 수정되었습니다.',
      });
    } else {
      addTodo({
        ...todoData,
        isCompleted: false,
      });
      showModal({
        type: 'alert',
        title: '알림',
        message: '새로운 할 일이 추가되었습니다.',
      });
    }

    navigation.goBack();
  };

  return (
    <AppSafeAreaView style={styles.container} headerRight={renderHeaderRight}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <FormField
            label="제목"
            placeholder="무엇을 해야 하나요?"
            value={title}
            onChangeText={setTitle}
            required
          />

          <FormField
            label="설명 (선택)"
            placeholder="상세 내용을 입력해주세요."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.section}>
            <FormLabel>마감 기한</FormLabel>
            <View style={styles.dateInputWrapper}>
              <TouchableOpacity
                style={styles.dateTouchArea}
                onPress={() => setIsCalendarVisible(true)}
                activeOpacity={0.7}
              >
                <CalendarIcon
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.dateIcon}
                />
                <View style={styles.dateInput}>
                  <Text style={styles.dateInputText}>
                    {dueDate || formatDate(getTodayDateString(), 'YYYY-MM-DD')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.quickDateRow}>
              {['오늘', '내일', '다음주'].map(label => (
                <TouchableOpacity
                  key={label}
                  style={styles.quickDateBtn}
                  onPress={() => {
                    let date = getTodayDateString();
                    if (label === '내일') date = getDateWithOffset(1);
                    if (label === '다음주') date = getDateWithOffset(7);
                    setDueDate(date);
                  }}
                >
                  <Text style={styles.quickDateText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <FormLabel>담당자 지정</FormLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.memberList}
            >
              <TouchableOpacity
                style={[
                  styles.memberItem,
                  assigneeId === undefined && styles.memberItemActive,
                ]}
                onPress={() => setAssigneeId(undefined)}
              >
                <View
                  style={[
                    styles.memberAvatarPlaceholder,
                    assigneeId === undefined && styles.memberAvatarActive,
                  ]}
                >
                  <Users
                    size={20}
                    color={
                      assigneeId === undefined
                        ? COLORS.white
                        : COLORS.textTertiary
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.memberName,
                    assigneeId === undefined && styles.memberNameActive,
                  ]}
                >
                  공통
                </Text>
              </TouchableOpacity>

              {members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberItem,
                    assigneeId === member.id && styles.memberItemActive,
                  ]}
                  onPress={() => setAssigneeId(member.id)}
                >
                  {member.avatar ? (
                    <Image
                      source={{ uri: member.avatar }}
                      style={styles.memberAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.memberAvatarPlaceholder,
                        assigneeId === member.id && styles.memberAvatarActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarInitial,
                          assigneeId === member.id && { color: COLORS.white },
                        ]}
                      >
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.memberName,
                      assigneeId === member.id && styles.memberNameActive,
                    ]}
                  >
                    {member.name}
                  </Text>
                  {assigneeId === member.id && (
                    <View style={styles.checkBadge}>
                      <Check size={10} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          title={todoId ? '저장하기' : '추가하기'}
          onPress={handleCreateOrUpdate}
        />
      </View>
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCalendarVisible(false)}
        >
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>마감 기한 선택</Text>
              <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              current={dueDate || getTodayDateString()}
              onDayPress={day => {
                setDueDate(day.dateString);
                setIsCalendarVisible(false);
              }}
              markedDates={
                dueDate
                  ? {
                      [dueDate]: {
                        selected: true,
                        selectedColor: COLORS.primary,
                        selectedTextColor: COLORS.white,
                      },
                    }
                  : {}
              }
              theme={{
                selectedDayBackgroundColor: COLORS.primary,
                todayTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
                dotColor: COLORS.primary,
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.layout,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  dateTouchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  dateInputText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textPrimary,
  },
  quickDateRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  quickDateBtn: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickDateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  memberList: {
    flexDirection: 'row',
    marginTop: 4,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  memberItemActive: {},
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 20,
    marginBottom: 8,
  },
  memberAvatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberAvatarActive: {
    backgroundColor: COLORS.primary,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  memberName: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  memberNameActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: 4,
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  footer: {
    paddingVertical: SPACING.layout,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
});

export default TodoCreateScreen;
