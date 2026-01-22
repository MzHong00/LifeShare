// 제스처 핸들러(터치, 스와이프 등) 기능을 테스트 환경에 맞게 초기화합니다.
import 'react-native-gesture-handler/jestSetup';

/**
 * [가짜(Mock) 데이터 만들기]
 * 실제 아이폰/안드로이드 기능은 테스트 환경(컴퓨터 메모리)에 존재하지 않습니다.
 * 따라서 해당 기능들을 호출했을 때 에러가 나지 않도록 '가짜'로 만들어주는 과정입니다.
 */

// 1. Async Storage 가짜로 만들기
// 로컬 저장소 기능을 메모리 상의 가짜 저장소로 대체합니다.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
