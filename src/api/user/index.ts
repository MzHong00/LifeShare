import api from '@/api/index';

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
    userData: any;
  }) {
    const { data } = await api.patch(`/users/${userId}`, userData);
    return data;
  }
}
