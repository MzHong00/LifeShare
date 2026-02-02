import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Todo } from '@/types/todo';
import { getISOTimestamp } from '@/utils/date';

interface TodoState {
  todos: Todo[];
}

export const todoStore = create<TodoState>()(
  persist(
    (): TodoState => ({
      todos: [],
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useTodoStore = <T = TodoState>(
  selector: (state: TodoState) => T = (state: TodoState) =>
    state as unknown as T,
) => todoStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const todoActions = {
  addTodo: (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: `todo-${Date.now()}`,
      createdAt: getISOTimestamp(),
    };
    todoStore.setState(state => ({
      todos: [newTodo, ...state.todos],
    }));
  },
  updateTodo: (id: string, updates: Partial<Todo>) => {
    todoStore.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo,
      ),
    }));
  },
  toggleTodo: (id: string) => {
    todoStore.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    }));
  },
  removeTodo: (id: string) => {
    todoStore.setState(state => ({
      todos: state.todos.filter(todo => todo.id !== id),
    }));
  },
  clearTodos: () => todoStore.setState({ todos: [] }),
};
