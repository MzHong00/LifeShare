import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Check,
  Users,
  Calendar as CalendarIcon,
  Trash2,
} from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useTodoStore } from '@/stores/useTodoStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useModalStore } from '@/stores/useModalStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type TodoCreateRouteProp = RouteProp<
  { TodoCreate: { todoId?: string } },
  'TodoCreate'
>;

const TodoCreateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TodoCreateRouteProp>();
  const todoId = route.params?.todoId;

  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  const { todos, addTodo, updateTodo, removeTodo } = useTodoStore();
  const { showAlert, showConfirm } = useModalStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD

  useEffect(() => {
    if (todoId) {
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setAssigneeId(todo.assigneeId);
        setDueDate(todo.dueDate || '');
      }
    }
  }, [todoId, todos]);

  const handleDelete = useCallback(() => {
    showConfirm('할 일 삭제', '이 할 일을 삭제하시겠습니까?', () => {
      if (todoId) {
        removeTodo(todoId);
        navigation.goBack();
      }
    });
  }, [todoId, removeTodo, navigation, showConfirm]);

  useLayoutEffect(() => {
    if (todoId) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={handleDelete}
            style={{ marginRight: SPACING.md }}
          >
            <Trash2 size={24} color={COLORS.error} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, todoId, handleDelete]);

  const members = currentWorkspace?.members || [];

  const handleCreateOrUpdate = () => {
    if (!title.trim()) {
      showAlert('알림', '할 일 제목을 입력해주세요.');
      return;
    }

    if (!currentWorkspace) {
      showAlert('알림', '워크스페이스 정보가 없습니다.');
      return;
    }

    const todoData = {
      workspaceId: currentWorkspace.id,
      title: title.trim(),
      description: description.trim(),
      isCompleted: false,
      assigneeId,
      dueDate: dueDate.trim() || undefined,
    };

    if (todoId) {
      updateTodo(todoId, todoData);
      showAlert('알림', '할 일이 수정되었습니다.');
    } else {
      addTodo({
        ...todoData,
        isCompleted: false,
      });
      showAlert('알림', '새로운 할 일이 추가되었습니다.');
    }

    navigation.goBack();
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="무엇을 해야 하나요?"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>설명 (선택)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="상세 내용을 입력해주세요."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor={COLORS.textTertiary}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>마감 기한 (선택)</Text>
            <View style={styles.dateInputWrapper}>
              <CalendarIcon
                size={20}
                color={COLORS.textSecondary}
                style={styles.dateIcon}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD (예: 2026-01-20)"
                value={dueDate}
                onChangeText={setDueDate}
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.quickDateRow}>
              {['오늘', '내일', '다음주'].map(label => (
                <TouchableOpacity
                  key={label}
                  style={styles.quickDateBtn}
                  onPress={() => {
                    const d = new Date();
                    if (label === '내일') d.setDate(d.getDate() + 1);
                    if (label === '다음주') d.setDate(d.getDate() + 7);
                    setDueDate(d.toISOString().split('T')[0]);
                  }}
                >
                  <Text style={styles.quickDateText}>{label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.quickDateBtn}
                onPress={() => setDueDate('')}
              >
                <Text style={styles.quickDateText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>담당자 지정</Text>
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
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateOrUpdate}
        >
          <Text style={styles.createButtonText}>
            {todoId ? '저장하기' : '추가하기'}
          </Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
    height: '100%',
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
    padding: SPACING.layout,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default TodoCreateScreen;
