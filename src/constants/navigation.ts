/**
 * 내비게이션 라우트 상수 이름
 * NAME: 네비게이션 시스템에서 사용하는 고유 키 (ID)
 * TITLE: 헤더나 레이블에 표시되는 사용자용 한글 이름
 */
export const NAV_ROUTES = {
  // 인트로/인증
  LOGIN: {
    NAME: 'Login',
    TITLE: '로그인',
  },

  // 라이프룸 설정 (연결 전)
  WORKSPACE_LANDING: {
    NAME: 'WorkspaceLanding',
    TITLE: '환영합니다',
  },

  // 메인 탭
  MAIN_TABS: {
    NAME: 'MainTabs',
    TITLE: '메인',
  },
  HOME: {
    NAME: 'Home',
    TITLE: '홈',
  },
  CHAT: {
    NAME: 'Chat',
    TITLE: '채팅',
  },
  LOCATION: {
    NAME: 'Location',
    TITLE: '위치',
  },

  // 서브 기능들
  CALENDAR: {
    NAME: 'Calendar',
    TITLE: '캘린더',
  },
  ANNIVERSARY: {
    NAME: 'Anniversary',
    TITLE: '기념일',
  },
  EVENT_CREATE: {
    NAME: 'EventCreate',
    TITLE: '일정 생성',
  },
  TODO: {
    NAME: 'Todo',
    TITLE: '할 일',
  },
  TODO_CREATE: {
    NAME: 'TodoCreate',
    TITLE: '할 일 생성',
  },
  STORIES: {
    NAME: 'Stories',
    TITLE: '스토리',
  },
  STORY_EDIT: {
    NAME: 'StoryEdit',
    TITLE: '스토리 수정',
  },
  STORY_DETAIL: {
    NAME: 'StoryDetail',
    TITLE: '스토리 상세보기',
  },
  PROFILE: {
    NAME: 'Profile',
    TITLE: '마이페이지',
  },
  PROFILE_EDIT: {
    NAME: 'ProfileEdit',
    TITLE: '프로필 수정',
  },
  WORKSPACE_SETUP: {
    NAME: 'WorkspaceSetup',
    TITLE: '라이프룸 생성',
  },
  WORKSPACE_LIST: {
    NAME: 'WorkspaceList',
    TITLE: '연결 관리 및 초대',
  },
  WORKSPACE_EDIT: {
    NAME: 'WorkspaceEdit',
    TITLE: '라이프룸 관리',
  },
  PRO_UPGRADE: {
    NAME: 'ProUpgrade',
    TITLE: 'Pro 플랜 업그레이드',
  },
  PLAN_MANAGEMENT: {
    NAME: 'PlanManagement',
    TITLE: '플랜 관리',
  },
  PRIVACY_POLICY: {
    NAME: 'PrivacyPolicy',
    TITLE: '개인정보 보호 정책',
  },
} as const;
