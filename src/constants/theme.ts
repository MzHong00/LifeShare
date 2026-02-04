/**
 * Toss Style Design System
 */
export const COLORS = {
  // 핵심 포인트 컬러 (Toss Blue)
  primary: '#3182F6',
  primaryLight: '#E8F3FF',

  // 배경색 (토스 특유의 차분한 라이트 그레이)
  background: '#F2F4F6',

  // 텍스트 컬러 (차분하고 명확한 위계)
  textPrimary: '#191F28', // 제목, 강조 텍스트
  textSecondary: '#4E5968', // 부제목, 일반 텍스트
  textTertiary: '#8B95A1', // 힌트, 비활성화 텍스트

  // 상태 및 포인트 컬러
  success: '#00D494',
  error: '#F04452', // 에러, 경고성 알림
  warning: '#FFAD13',

  // 기타
  border: '#E5E8EB',
  skeleton: '#F9FAFB',
  red: '#F04452', // 하트, 스토리, 좋아요 등 포인트 컬러
  black: '#000000',
  grey: '#F2F4F6', // background와 동일하지만 명시적 사용을 위해 추가
  pinkLight: '#FFEBF0',
  greenLight: '#E8FAEF',
  white: '#FFFFFF',
  dark: '#191F28', // textPrimary와 동일하지만 배경색 등에 사용될 때를 위해 추가

  // 소셜 로그인 및 포인트 배경
  kakao: '#FEE500',
  kakaoText: '#3C1E1E',
  googleBlue: '#4285F4',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  layout: 20, // 화면 좌우 기본 여백
};

export const TYPOGRAPHY = {
  header1: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 34,
    color: '#191F28',
  },
  header2: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    color: '#191F28',
  },
  body1: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: '#4E5968',
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: '#4E5968',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: '#8B95A1',
  },
};
