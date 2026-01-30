import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';
import { getISOTimestamp } from '@/utils/date';

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearTodos: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    set => ({
      todos: [],
      addTodo: todoData => {
        const newTodo: Todo = {
          ...todoData,
          id: `todo-${Date.now()}`,
          createdAt: getISOTimestamp(),
        };
        set(state => ({
          todos: [newTodo, ...state.todos],
        }));
      },
      updateTodo: (id, updates) => {
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, ...updates } : todo,
          ),
        }));
      },
      toggleTodo: id => {
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
          ),
        }));
      },
      removeTodo: id => {
        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id),
        }));
      },
      clearTodos: () => set({ todos: [] }),
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
