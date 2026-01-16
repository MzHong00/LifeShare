import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';

export class AuthMutations {
  static useLogin() {
    const setTokens = useAuthStore(state => state.setTokens);

    return useMutation({
      mutationFn: AuthService.login,
      onSuccess: data => {
        setTokens(data.accessToken, data.refreshToken);
      },
    });
  }

  static useLogout() {
    const clearTokens = useAuthStore(state => state.clearTokens);

    return useMutation({
      mutationFn: AuthService.logout,
      onSettled: () => {
        clearTokens();
      },
    });
  }
}
