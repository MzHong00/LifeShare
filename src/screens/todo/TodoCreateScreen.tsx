import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
  TODO_COLORS,
} from '@/constants/theme';
import { useTodoStore, todoActions } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import { getTodayDateString, getDateWithOffset } from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { HeaderButton } from '@/components/common/HeaderButton';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/common/Button';
import { FormLabel } from '@/components/common/FormLabel';

type TodoCreateRouteProp = RouteProp<
  { TodoCreate: { todoId?: string; initialDate?: string } },
  'TodoCreate'
>;

const QUICK_DATES = [
  { label: '오늘', offset: 0 },
  { label: '내일', offset: 1 },
  { label: '다음 주', offset: 7 },
];

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
  const [startDate, setStartDate] = useState(
    route.params?.initialDate || getTodayDateString(),
  );
  const [endDate, setEndDate] = useState(
    route.params?.initialDate || getTodayDateString(),
  );
  const [selectedColor, setSelectedColor] = useState(TODO_COLORS[0]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'start' | 'end'>(
    'start',
  );

  useEffect(() => {
    if (todoId) {
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setAssigneeId(todo.assigneeId);
        setStartDate(todo.startDate);
        setEndDate(todo.endDate);
        setSelectedColor(todo.color || TODO_COLORS[0]);
      }
    }
  }, [todoId, todos]);

  const handleDayPress = (day: any) => {
    if (activeDateField === 'start') {
      setStartDate(day.dateString);
      // Ends cannot be before start
      if (day.dateString > endDate) {
        setEndDate(day.dateString);
      }
    } else {
      setEndDate(day.dateString);
      // Starts cannot be after end
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      }
    }
    // Close modal after selecting a single date
    setIsCalendarVisible(false);
  };

  const setQuickDate = (offset: number) => {
    const date = getDateWithOffset(offset);
    setEndDate(date);
    if (date < startDate) {
      setStartDate(date);
    }
    // Close modal if selection happened via quick buttons
    setIsCalendarVisible(false);
  };

  const markedDates = useMemo(() => {
    const selectedDate = activeDateField === 'start' ? startDate : endDate;
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: APP_COLORS.primary,
        selectedTextColor: THEME_COLORS.white,
      },
    };
  }, [startDate, endDate, activeDateField]);

  const handleDelete = useCallback(() => {
    showModal({
      type: 'confirm',
      title: '삭제',
      message: '이 항목을 삭제하시겠습니까?',
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
          icon={<Trash2 size={24} color={APP_COLORS.error} />}
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
        message: '제목을 입력해주세요.',
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

    if (!startDate || !endDate) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '기간을 선택해주세요.',
      });
      return;
    }

    const todoData = {
      workspaceId: currentWorkspace.id,
      title: title.trim(),
      description: description.trim(),
      isCompleted: false,
      assigneeId,
      startDate,
      endDate,
      color: selectedColor,
    };

    if (todoId) {
      updateTodo(todoId, todoData);
      showModal({
        type: 'alert',
        title: '알림',
        message: '항목이 수정되었습니다.',
      });
    } else {
      addTodo({
        ...todoData,
        isCompleted: false,
      });
      showModal({
        type: 'alert',
        title: '알림',
        message: '새로운 항목이 추가되었습니다.',
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
            placeholder="무엇을 하나요? (예: 데이트, 장보기)"
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
            <FormLabel>시작일</FormLabel>
            <TouchableOpacity
              style={[
                styles.dateButton,
                activeDateField === 'start' && styles.dateButtonActive,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setActiveDateField('start');
                setIsCalendarVisible(true);
              }}
            >
              <CalendarIcon
                size={20}
                color={APP_COLORS.primary}
                style={styles.dateIcon}
              />
              <Text style={styles.dateValue}>{startDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <FormLabel>종료일</FormLabel>
            <View style={styles.quickDateRow}>
              {QUICK_DATES.map(item => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.quickDateBtn}
                  onPress={() => setQuickDate(item.offset)}
                >
                  <Text style={styles.quickDateText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.dateButton,
                activeDateField === 'end' && styles.dateButtonActive,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setActiveDateField('end');
                setIsCalendarVisible(true);
              }}
            >
              <CalendarIcon
                size={20}
                color={APP_COLORS.primary}
                style={styles.dateIcon}
              />
              <Text style={styles.dateValue}>{endDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <FormLabel>색상 선택</FormLabel>
            <View style={styles.colorRow}>
              {TODO_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorCircleActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
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
                        ? THEME_COLORS.white
                        : APP_COLORS.textTertiary
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
                          assigneeId === member.id && {
                            color: THEME_COLORS.white,
                          },
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
                      <Check size={10} color={THEME_COLORS.white} />
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
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarModalHeader}>
              <Text style={styles.calendarModalTitle}>날짜 선택</Text>
              <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>

            <Calendar
              current={activeDateField === 'start' ? startDate : endDate}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: APP_COLORS.primary,
                selectedDayTextColor: THEME_COLORS.white,
                todayTextColor: APP_COLORS.primary,
                arrowColor: APP_COLORS.primary,
                monthTextColor: APP_COLORS.textPrimary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '700',
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
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickDateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: APP_COLORS.bgGray,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  quickDateText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: APP_COLORS.bgGray,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dateButtonActive: {
    borderColor: APP_COLORS.primary,
    backgroundColor: THEME_COLORS.white,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateValue: {
    fontSize: 16,
    color: APP_COLORS.textPrimary,
    fontWeight: '500',
  },
  smallIconMargin: { marginRight: 8 },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: THEME_COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: APP_COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberAvatarActive: {
    backgroundColor: APP_COLORS.primary,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
  },
  memberName: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    color: APP_COLORS.textSecondary,
  },
  memberNameActive: {
    color: APP_COLORS.primary,
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: 4,
    backgroundColor: APP_COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME_COLORS.white,
  },
  footer: {
    paddingVertical: SPACING.layout,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModalContent: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 24,
    width: '100%',
    padding: 16,
    overflow: 'hidden',
  },
  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarModalTitle: {
    ...TYPOGRAPHY.header2,
    color: APP_COLORS.textPrimary,
  },
  closeText: {
    color: APP_COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default TodoCreateScreen;
