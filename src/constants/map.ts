/**
 * 지도 관련 상수 (기본 위치, 줌 레벨 등)
 */
export const MAP_CONFIG = {
  // 기본 위치 (서울시청 기준)
  DEFAULT_LOCATION: {
    latitude: 37.5665,
    longitude: 126.978,
  },

  // 기본 줌 레벨 (상세도)
  DEFAULT_DELTA: {
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },

  // 정밀 줌 레벨 (위치 탭 등에서 사용)
  CLOSE_DELTA: {
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  },
};
