import { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { Radio } from 'lucide-react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { APP_COLORS, THEME_COLORS } from '@/constants/theme';
import { MAP_CONFIG } from '@/constants/map';
import { MainMap } from '@/components/map/MainMap';
import { useGeolocation } from '@/businesses/geolocation/useGeolocation';
import type { LocationPoint } from '@/types';

interface StoryMapPickerProps {
  path?: LocationPoint[];
  pathColor: string;
  onSelect: (path: LocationPoint[]) => void;
  onClose: () => void;
}

const StoryMapPicker = ({
  path = [],
  pathColor,
  onSelect,
  onClose,
}: StoryMapPickerProps) => {
  const mapRef = useRef<MapView>(null);
  const { location: myLocation } = useGeolocation();

  // 현재 편집 중인 포인트 목록
  const [points, setPoints] = useState<LocationPoint[]>(path);

  const isInitialFitDone = useRef(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // 초기 렌더링 시에만 기존 경로가 있으면 fitBounds, 없으면 내 위치로 이동
    if (!isInitialFitDone.current) {
      if (points.length > 0) {
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 100, right: 100, bottom: 200, left: 100 },
          animated: true,
        });
        isInitialFitDone.current = true;
      } else if (myLocation) {
        mapRef.current.animateToRegion({
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          ...MAP_CONFIG.DEFAULT_DELTA,
        });
        isInitialFitDone.current = true;
      }
    }
  }, [myLocation, points]);

  const handleMapPress = (e: any) => {
    const newPoint: LocationPoint = {
      ...e.nativeEvent.coordinate,
      timestamp: Date.now(),
    };
    setPoints(prev => [...prev, newPoint]);
  };

  const handleMarkerDragEnd = (index: number, e: any) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setPoints(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...newCoordinate };
      return next;
    });
  };

  const handleMarkerPress = (index: number, e: any) => {
    e.stopPropagation(); // 맵의 onPress(정점 추가) 및 기본 이동 동작 방지
    setPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onSelect(points);
    onClose();
  };

  const toggleRecording = () => {
    // 실시간 기록 기능은 추후 구현 예정
    console.log('Real-time recording feature button pressed.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MainMap
          mapRef={mapRef}
          myLocation={myLocation || MAP_CONFIG.DEFAULT_LOCATION}
          currentDelta={MAP_CONFIG.DEFAULT_DELTA}
          onPress={handleMapPress}
          minimalist
        >
          {/* 현재 작업 중인 경로 표시 */}
          {points.length > 0 && (
            <>
              <Polyline
                coordinates={points}
                strokeColor={pathColor}
                strokeWidth={5}
              />
              {points.map((point, index) => (
                <Marker
                  key={`point-${index}-${point.timestamp}`}
                  coordinate={point}
                  draggable
                  onDragEnd={e => handleMarkerDragEnd(index, e)}
                  onPress={e => handleMarkerPress(index, e)}
                  pinColor={pathColor}
                />
              ))}
            </>
          )}
        </MainMap>

        <View style={styles.mapOverlayInfo}>
          <Text style={styles.mapOverlayText}>
            지도를 터치하여 이동 경로를 그려보세요.{'\n'}마커를 드래그하여
            위치를 수정할 수 있습니다.
          </Text>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={toggleRecording}
            activeOpacity={0.8}
          >
            <Radio size={20} color={THEME_COLORS.white} />
            <Text style={styles.recordButtonText}>실시간 기록</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapSubmitButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.mapSubmitButtonText}>선택 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  mapOverlayInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: APP_COLORS.primary + '30',
  },
  mapOverlayText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomActions: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  recordButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: APP_COLORS.textPrimary, // 검은색 계열로 차별화
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recordingActiveButton: {
    backgroundColor: THEME_COLORS.white,
    borderWidth: 2,
    borderColor: APP_COLORS.error,
  },
  recordButtonText: {
    color: THEME_COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  mapSubmitButton: {
    flex: 1.5,
    backgroundColor: APP_COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  mapSubmitButtonText: {
    color: THEME_COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default StoryMapPicker;
