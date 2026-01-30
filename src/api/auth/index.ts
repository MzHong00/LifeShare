import api from '@/lib/axios';

export interface LoginCredentials {
  email: string;
  password?: string;
  // 소셜 로그인 등을 고려하여 추가 필드가 있을 수 있음
  [key: string]: any;
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data; // { accessToken, refreshToken, user }
  }

  static async refreshTokens(refreshToken: string) {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data; // { accessToken, refreshToken }
  }

  static async logout() {
    await api.post('/auth/logout');
  }
}
