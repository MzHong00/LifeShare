import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CheckCircle2, Circle, Users, User } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  category: 'individual' | 'shared';
  assignee?: string;
}

const TodoScreen = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'shared' | 'mine'>('all');
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: '이번주 주말 마트 장보기',
      isCompleted: false,
      category: 'shared',
    },
    {
      id: '2',
      title: '전기요금 납부하기',
      isCompleted: true,
      category: 'individual',
    },
    {
      id: '3',
      title: '강아지 산책시키기',
      isCompleted: false,
      category: 'shared',
    },
    {
      id: '4',
      title: '부모님 생신 선물 사기',
      isCompleted: false,
      category: 'shared',
    },
    {
      id: '5',
      title: '운동 30분 하기',
      isCompleted: false,
      category: 'individual',
    },
  ]);

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'shared') return todo.category === 'shared';
    if (activeTab === 'mine') return todo.category === 'individual';
    return true;
  });

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.todoContent}>
        {item.isCompleted ? (
          <CheckCircle2
            size={24}
            color={COLORS.primary}
            fill={COLORS.primaryLight}
          />
        ) : (
          <Circle size={24} color={COLORS.border} />
        )}
        <View style={styles.todoTextContainer}>
          <Text
            style={[styles.todoTitle, item.isCompleted && styles.completedText]}
          >
            {item.title}
          </Text>
          <View style={styles.tagContainer}>
            <View
              style={[
                styles.tag,
                item.category === 'shared' ? styles.tagShared : styles.tagMine,
              ]}
            >
              {item.category === 'shared' ? (
                <Users size={12} color={COLORS.primary} />
              ) : (
                <User size={12} color={COLORS.textSecondary} />
              )}
              <Text
                style={[
                  styles.tagText,
                  item.category === 'shared'
                    ? styles.tagTextShared
                    : styles.tagTextMine,
                ]}
              >
                {item.category === 'shared' ? '공유' : '개인'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.header1}>할 일</Text>
        <Text style={styles.summaryText}>
          오늘 할 일이{' '}
          <Text style={styles.highlightText}>
            {todos.filter(t => !t.isCompleted).length}개
          </Text>{' '}
          남았어요
        </Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['all', 'shared', 'mine'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab && styles.activeTabLabel,
              ]}
            >
              {tab === 'all'
                ? '전체'
                : tab === 'shared'
                ? '공유됨'
                : '내 할 일'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              할 일이 없어요. 새로운 일을 추가해보세요!
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab}>
        <Plus size={30} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  summaryText: {
    ...TYPOGRAPHY.body1,
    marginTop: 4,
    color: COLORS.textSecondary,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.layout,
    marginBottom: SPACING.md,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 100,
  },
  todoItem: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  todoTitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 4,
  },
  tagShared: {
    backgroundColor: COLORS.primaryLight,
  },
  tagMine: {
    backgroundColor: COLORS.skeleton,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tagTextShared: {
    color: COLORS.primary,
  },
  tagTextMine: {
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textTertiary,
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
});

export default TodoScreen;
