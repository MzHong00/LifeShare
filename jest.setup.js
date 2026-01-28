// 제스처 핸들러(터치, 스와이프 등) 기능을 테스트 환경에 맞게 초기화합니다.
import 'react-native-gesture-handler/jestSetup';

/**
 * [가짜(Mock) 데이터 만들기]
 * 실제 아이폰/안드로이드 기능은 테스트 환경(컴퓨터 메모리)에 존재하지 않습니다.
 * 따라서 해당 기능들을 호출했을 때 에러가 나지 않도록 '가짜'로 만들어주는 과정입니다.
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-config', () => ({
  GOOGLE_CLIENT_ID_IOS: 'mock-ios-client-id',
  GOOGLE_CLIENT_ID_ANDROID: 'mock-android-client-id',
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn().mockResolvedValue(true),
    configure: jest.fn().mockResolvedValue(undefined),
    signIn: jest.fn().mockResolvedValue({
      idToken: 'mock-id-token',
      user: {
        id: 'mock-user-id',
        email: 'mock@email.com',
        name: 'Mock User',
        photo: 'mock-photo-url',
      },
    }),
    signOut: jest.fn().mockResolvedValue(undefined),
    revokeAccess: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('react-native-maps', () => {
  const MapView = props => {
    const { children, ...rest } = props;
    return <div {...rest}>{children}</div>;
  };
  const Marker = props => <div {...props} />;
  return {
    __esModule: true,
    default: MapView,
    Marker,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest
    .fn()
    .mockImplementation((success, error, options) => {
      success({
        coords: {
          latitude: 37.5665,
          longitude: 126.978,
          accuracy: 100,
        },
        timestamp: Date.now(),
      });
    }),
}));
