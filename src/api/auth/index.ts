import api from '@/api/index';

export class AuthService {
  static async login(credentials: any) {
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
