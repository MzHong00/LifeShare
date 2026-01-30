import api from '@/lib/axios';

export class UserService {
  static async fetchUser(userId: string) {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  }

  static async updateUser({
    userId,
    userData,
  }: {
    userId: string;
    userData: Record<string, unknown>;
  }) {
    const { data } = await api.patch(`/users/${userId}`, userData);
    return data;
  }
}
