import { useEffect, useCallback } from 'react';

import { useLocationStore, locationActions } from '@/stores/useLocationStore';
import { useMemoryStore, memoryActions } from '@/stores/useMemoryStore';
import { GeolocationService } from '@/businesses/geolocation/geolocationServiceService';

export const useGeolocation = () => {
  const { location, error, loading } = useLocationStore();

  const { setLocation, setError, setLoading } = locationActions;

  // useMemoryStore는 아직 이전 방식이므로 그대로 둡니다.
  const { isRecording } = useMemoryStore();
  const { addLocationPoint } = memoryActions;

  const updateLocation = useCallback(async () => {
    try {
      setLoading(true);
      const hasPermission = await GeolocationService.requestPermission();

      if (!hasPermission) {
        setError('위치 권한이 거부되었습니다.');
        setLoading(false);
        return;
      }

      const position = await GeolocationService.getCurrentPosition();

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || '위치를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [setLocation, setError, setLoading]);

  // 초기 위치 로드 및 실시간 추적 설정
  useEffect(() => {
    let watchId: number | null = null;

    const init = async () => {
      await updateLocation();

      const hasPermission = await GeolocationService.requestPermission();
      if (hasPermission) {
        watchId = GeolocationService.watchPosition(
          position => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(newLocation);

            if (isRecording) {
              addLocationPoint({
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
                timestamp: position.timestamp,
              });
              console.log('newLocation', newLocation);
            }
          },
          err => {
            console.error('WatchPosition Error:', err);
          },
        );
      }
    };

    init();

    return () => {
      if (watchId !== null) {
        GeolocationService.clearWatch(watchId);
      }
    };
  }, [updateLocation, isRecording, addLocationPoint, setLocation]);

  return {
    location,
    error,
    loading,
    refreshLocation: updateLocation,
  };
};
