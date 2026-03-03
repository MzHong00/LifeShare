import Config from 'react-native-config';
import * as Sentry from '@sentry/react-native';

/**
 * Sentry 기능을 프로젝트 전역에서 표준화된 방식으로 사용하기 위한 서비스 객체입니다.
 */
export const sentry = {
  /**
   * Sentry 초기 설정을 수행합니다.
   * 앱의 최상위 진입점(App.tsx)에서 호출해야 합니다.
   */
  init: () => {
    Sentry.init({
      dsn: Config.SENTRY_DSN,

      // 이벤트에 더 많은 컨텍스트 데이터(IP 주소, 쿠키, 사용자 정보 등)를 추가합니다.
      sendDefaultPii: true,

      // 로그 활성화
      enableLogs: true,

      // 세션 리플레이(Session Replay) 설정
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1,
      integrations: [Sentry.mobileReplayIntegration()],
    });
  },

  /**
   * 루트 컴포넌트를 Sentry로 감싸 에러 추적 및 성능 측정 기능을 활성화합니다.
   *
   * @param Component 감쌀 루트 컴포넌트
   */
  wrap: (Component: React.ComponentType) => {
    return Sentry.wrap(Component);
  },

  /**
   * 발생한 에러를 Sentry로 전송합니다.
   * 주로 try-catch 블록의 catch 절에서 사용됩니다.
   *
   * @param error 발생한 에러 객체
   */
  captureException: (error: any) => {
    Sentry.captureException(error);
  },

  /**
   * 지정된 메시지를 Sentry로 전송합니다.
   * 에러는 아니지만 추적이 필요한 중요 시점에 사용합니다.
   *
   * @param message 전송할 메시지 내용
   * @param level 메시지 수준 (info, warning, error 등)
   */
  captureMessage: (message: string, level: Sentry.SeverityLevel = 'info') => {
    Sentry.captureMessage(message, level);
  },

  /**
   * 현재 사용자의 정보를 Sentry 에러 리포트에 연결합니다.
   * 로그인 시 호출하면 에러 발생 시 누구에게 발생했는지 추적하기 용이합니다.
   *
   * @param user 사용자 정보 객체 (id 필수, email/username 권장)
   */
  setUser: (user: Sentry.User | null) => {
    Sentry.setUser(user);
  },

  /**
   * 이동 경로(Breadcrumbs)를 추가합니다.
   * 에러 발생 직전까지 사용자가 어떤 행동을 했는지 타임라인으로 기록합니다.
   *
   * @param breadcrumb 브레드크럼 정보
   */
  addBreadcrumb: (breadcrumb: Sentry.Breadcrumb) => {
    Sentry.addBreadcrumb(breadcrumb);
  },

  /**
   * Sentry의 로그 시스템을 통해 메시지를 기록합니다.
   * Sentry 대시보드의 'Logs' 탭에서 검색이 가능합니다.
   *
   * @param message 기록할 메시지
   * @param level 로그 수준
   */
  log: (message: string, level: Sentry.SeverityLevel = 'info') => {
    // Sentry.log(message, level);
    // SDK 버전에 따라 logger를 직접 사용할 수도 있습니다.
    switch (level) {
      case 'info':
        Sentry.logger.info(message);
        break;
      case 'warning':
        Sentry.logger.warn(message);
        break;
      case 'error':
        Sentry.logger.error(message);
        break;
      default:
        Sentry.logger.info(message);
    }
  },

  /**
   * 추가적인 컨텍스트 정보를 설정합니다.
   * 특정 기능이나 상태에 대한 임시 태그를 붙일 때 유용합니다.
   *
   * @param name 컨텍스트 이름
   * @param context 데이터 객체
   */
  setContext: (name: string, context: { [key: string]: any } | null) => {
    Sentry.setContext(name, context);
  },
};
