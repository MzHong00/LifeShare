module.exports = {
  // 리액트 네이티브를 위한 Jest 기본 설정 세트
  preset: 'react-native',

  // Jest가 자바스크립트로 변환(컴파일)하지 '않을' 폴더들을 지정합니다.
  // 기본적으로 node_modules는 무시되지만, 여기에 적힌 라이브러리들은
  // 최신 문법을 사용하므로 예외적으로 변환 과정(Transform)을 거치게 합니다.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|@react-navigation|lucide-react-native)',
  ],

  // 각 테스트 파일이 실행되기 직전에 먼저 실행될 설정 파일을 지정합니다.
  // 주로 라이브러리 가짜(Mock) 데이터를 만드는 용도로 사용합니다.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
