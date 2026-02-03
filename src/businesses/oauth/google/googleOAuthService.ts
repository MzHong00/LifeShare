import { Platform } from 'react-native';
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { OS } from '@/constants/common';
import { authActions } from '@/stores/useAuthStore';
import { userActions } from '@/stores/useUserStore';

export const GoogleOAuthService = {
  /**
   * 구글 로그인 초기 설정
   */
  initGoogleOAuth: () => {
    GoogleSignin.configure({
      ...(Platform.OS === OS.IOS && {
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      }),
      webClientId: Config.GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  },

  /**
   * 구글 로그인 실행 및 토큰/사용자 정보 저장
   */
  loginGoogleOAuth: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data) {
        throw new Error('구글 로그인 실패: 사용자 정보가 없습니다.');
      }

      const { user, idToken } = userInfo.data;

      // 구글 토큰 가져오기 (accessToken 확보)
      const { accessToken } = await GoogleSignin.getTokens();

      // 1. AuthStore에 인증 토큰 저장
      // 백엔드가 없는 현재 상황에서는 idToken을 refreshToken 대용으로 임시 저장합니다.
      authActions.setTokens(accessToken, idToken || '');

      // 2. UserStore에 사용자 프로필 정보 저장
      userActions.setUser({
        name: user.name || user.email.split('@')[0],
        profileImage: user.photo || undefined,
      });

      console.log('✅ 구글 로그인 성공 및 데이터 분리 저장 완료');
    } catch (error) {
      console.error('❌ 구글 로그인 에러:', error);
    }
  },
};
