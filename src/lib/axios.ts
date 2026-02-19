import axios from 'axios';
import Config from 'react-native-config';

import { HTTP_STATUS, API_CONFIG } from '@/constants/api';
import { sentry } from '@/lib/sentry';
import { authStore, authActions } from '@/stores/useAuthStore';

/**
 * 전역 API 통신을 위한 Axios 인스턴스 설정
 * - baseURL: 환경 변수에서 가져온 API 주소
 * - timeout: 10초 제한
 */
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청(Request) 인터셉터
 * 모든 API 요청 전에 실행되며, AuthStore에 저장된 Access Token이 있을 경우 헤더에 첨부합니다.
 */
api.interceptors.request.use(
  config => {
    const token = authStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

/**
 * 응답(Response) 인터셉터
 * 1. 성공 시: 응답 데이터를 그대로 반환
 * 2. 에러 시: 토큰 상태 코드(487: Access 만료, 488: Refresh 만료, 401: 인증 실패)에 따른 처리
 */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // [CASE 1] Access Token 만료 (487) -> 토큰 갱신 시도
    if (
      status === HTTP_STATUS.ACCESS_TOKEN_EXPIRED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStore.getState().refreshToken;
        if (!refreshToken)
          throw new Error('이용 가능한 Refresh Token이 없습니다.');

        // 토큰 갱신 API 호출
        const { data } = await axios.post(`${Config.API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data;

        // 갱신된 토큰을 Store에 저장
        authActions.setTokens(accessToken, newRefreshToken);

        // 실패했던 기존 요청에 새 토큰을 끼워넣어 다시 시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신 과정 중 에러 발생 시 로그아웃 처리
        authActions.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // [CASE 2] Refresh Token 만료 (488) 및 일반 인증 실패 (401)
    // - 488: 리프레시 토큰까지 만료되었으므로 강제 로그아웃
    // - 401: 잘못된 계정 정보 등 일반적인 인증 실패
    if (
      status === HTTP_STATUS.REFRESH_TOKEN_EXPIRED ||
      status === HTTP_STATUS.UNAUTHORIZED
    ) {
      authActions.clearTokens();
    }

    // 500번대 서버 에러 발생 시 Sentry에 기록
    if (status && status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      sentry.captureException(error);
    }

    return Promise.reject(error);
  },
);

export default api;
