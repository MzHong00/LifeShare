import { Platform, PermissionsAndroid } from 'react-native';
import Config from 'react-native-config';
import Geolocation from 'react-native-geolocation-service';

export const GeolocationService = {
  /**
   * 위치 권한 요청
   */
  requestPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  },

  /**
   * 현재 위치 가져오기
   */
  getCurrentPosition: (): Promise<Geolocation.GeoPosition> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
        },
      );
    });
  },

  /**
   * 실시간 위치 추적 시작
   */
  watchPosition: (
    successCallback: (position: Geolocation.GeoPosition) => void,
    errorCallback: (error: Geolocation.GeoError) => void,
  ): number => {
    return Geolocation.watchPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      distanceFilter: 0, // 10미터 이동 시마다 업데이트
      interval: 5000, // 5초마다 업데이트 (안드로이드 전용)
      fastestInterval: 2000,
    });
  },

  /**
   * 위치 추적 중지
   */
  clearWatch: (watchId: number) => {
    Geolocation.clearWatch(watchId);
  },

  reverseGeocode: async (latitude: number, longitude: number) => {
    const apiKey = Config.GOOGLE_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const response = await fetch(url);

    const data = await response.json();
    console.log(data);
    return data.results[0].formatted_address;
  },
};
