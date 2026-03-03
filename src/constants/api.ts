/**
 * API 통신 관련 상태 코드 상수
 */
export const HTTP_STATUS = {
  /** 성공 (200) */
  OK: 200,

  /** 잘못된 요청 (400) */
  BAD_REQUEST: 400,

  /** 일반 인증 실패 - 로그인 정보 불일치 등 (401) */
  UNAUTHORIZED: 401,

  /** 권한 없음 (403) */
  FORBIDDEN: 403,

  /** 요청 리소스를 찾을 수 없음 (404) */
  NOT_FOUND: 404,

  /** Access Token 만료 (487) */
  ACCESS_TOKEN_EXPIRED: 487,

  /** Refresh Token 만료 (488) */
  REFRESH_TOKEN_EXPIRED: 488,

  /** 서버 내부 오류 (500) */
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * 전역 API 설정 관련 상수
 */
export const API_CONFIG = {
  /** API 요청 타임아웃 (10초) */
  TIMEOUT: 10000,
} as const;
