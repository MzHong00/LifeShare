import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
}

export const authStore = create<AuthState>()(
  persist(
    (): AuthState => ({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useAuthStore = <T = AuthState>(
  selector: (state: AuthState) => T = (state: AuthState) =>
    state as unknown as T,
) => authStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const authActions = {
  setTokens: (access: string, refresh: string) =>
    authStore.setState({
      accessToken: access,
      refreshToken: refresh,
      isLoggedIn: true,
    }),
  clearTokens: () =>
    authStore.setState({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    }),
};
