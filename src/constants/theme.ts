/**
 * Raw Palette Colors (Source of truth for hex codes)
 */
export const THEME_COLORS = {
  blue: '#3182F6',
  blueLight: '#E8F3FF',
  blueSky: '#22CCFF',
  blueBaby: '#74B9FF',
  indigo: '#6226EF',
  purple: '#8E44AD',
  purpleSoft: '#A29BFE',
  pink: '#F044D2',
  pinkLight: '#FFEBF0',
  magenta: '#E84393',
  red: '#F04452',
  redSoft: '#FF4D4D',
  crimson: '#D63031',
  orange: '#FF6B01',
  orangeDeep: '#E17055',
  amber: '#FFB800',
  yellow: '#FFAD13',
  peach: '#FAB1A0',
  green: '#00BA54',
  greenEmerald: '#1AB769',
  greenMint: '#55E6C1',
  greenLight: '#E8FAEF',
  teal: '#00CEC9',
  success: '#00D494',
  grey50: '#F9FAFB',
  grey100: '#F2F4F6',
  grey200: '#E5E8EB',
  grey300: '#D1D6DB',
  grey400: '#B2BEC3',
  grey500: '#8B95A1',
  grey600: '#6B7684',
  grey700: '#4E5968',
  grey800: '#333D4B',
  grey900: '#191F28',
  white: '#FFFFFF',
  black: '#000000',
  kakao: '#FEE500',
  google: '#4285F4',
};

/**
 * Semantic System Colors
 */
export const COLORS = {
  // 핵심 포인트 컬러 (LifeShare Blue)
  primary: THEME_COLORS.blue,
  primaryLight: THEME_COLORS.blueLight,

  // 배경색 (차분한 라이트 그레이)
  background: THEME_COLORS.grey100,

  // 텍스트 컬러 (차분하고 명확한 위계)
  textPrimary: THEME_COLORS.grey900, // 제목, 강조 텍스트
  textSecondary: THEME_COLORS.grey700, // 부제목, 일반 텍스트
  textTertiary: THEME_COLORS.grey500, // 힌트, 비활성화 텍스트

  // 상태 및 포인트 컬러
  success: THEME_COLORS.success,
  error: THEME_COLORS.red,
  warning: THEME_COLORS.yellow,

  // UI 요소
  border: THEME_COLORS.grey200,
  skeleton: THEME_COLORS.grey50,
  divider: THEME_COLORS.grey200,

  // 원본 색상 참조
  red: THEME_COLORS.red,
  green: THEME_COLORS.green,
  blue: THEME_COLORS.blue,
  grey: THEME_COLORS.grey100,
  white: THEME_COLORS.white,
  black: THEME_COLORS.black,
  dark: THEME_COLORS.grey900,
  pinkLight: THEME_COLORS.pinkLight,
  greenLight: THEME_COLORS.greenLight,

  // 특정 서비스/브랜드 컬러
  kakao: THEME_COLORS.kakao,
  kakaoText: '#3C1E1E',
  googleBlue: THEME_COLORS.google,
};

/**
 * 스토리 경로를 위한 20가지 프리미엄 컬러 팔레트
 */
export const PATH_COLORS = [
  THEME_COLORS.blue,
  THEME_COLORS.red,
  THEME_COLORS.orange,
  THEME_COLORS.green,
  THEME_COLORS.purple,
  THEME_COLORS.pink,
  THEME_COLORS.blueSky,
  THEME_COLORS.indigo,
  THEME_COLORS.amber,
  THEME_COLORS.greenEmerald,
  THEME_COLORS.redSoft,
  THEME_COLORS.purpleSoft,
  THEME_COLORS.teal,
  THEME_COLORS.peach,
  THEME_COLORS.blueBaby,
  THEME_COLORS.grey400,
  THEME_COLORS.greenMint,
  THEME_COLORS.orangeDeep,
  THEME_COLORS.crimson,
  THEME_COLORS.magenta,
];

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
