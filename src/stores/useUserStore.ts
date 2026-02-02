import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserProfile } from '@/types/auth';

interface UserState {
  user: UserProfile | null;
}

export const userStore = create<UserState>()(
  persist(
    (): UserState => ({
      user: null,
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useUserStore = <T = UserState>(
  selector: (state: UserState) => T = (state: UserState) =>
    state as unknown as T,
) => userStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const userActions = {
  setUser: (user: UserProfile) => userStore.setState({ user }),
  updateUser: (updates: Partial<UserProfile>) =>
    userStore.setState(state => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  clearUser: () => userStore.setState({ user: null }),
};
