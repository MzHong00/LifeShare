import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh, isLoggedIn: true }),
  clearTokens: () =>
    set({ accessToken: null, refreshToken: null, isLoggedIn: false }),
}));
