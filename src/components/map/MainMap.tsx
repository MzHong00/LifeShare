import type { RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region,
} from 'react-native-maps';

import { COLORS } from '@/constants/theme';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import type { Story } from '@/types';

interface MainMapProps {
  /** 지도 인스턴스에 접근하기 위한 Ref (애니메이션, 영역 이동 등에 사용) */
  mapRef: RefObject<MapView | null>;
  /** 사용자의 현재 위/경도 좌표 */
  myLocation: { latitude: number; longitude: number };
  /** 지도의 초기/현재 줌 레벨 (위도/경도 델타 값) */
  currentDelta: { latitudeDelta: number; longitudeDelta: number };
  /** 지도에 표시할 스토리 목록 (각 스토리의 이동 경로 포함, 선택 사항) */
  stories?: Story[];
  /** 현재 선택된 스토리의 ID (강조 표시 및 상세 정보 로드용, 선택 사항) */
  selectedStoryId?: string | null;
  /** 위치 정보를 포함한 워크스페이스 멤버 목록 (마커 표시용, 선택 사항) */
  membersWithLocation?: any[];
  /** 멤버 마커 터치 시 호출되는 콜백 함수 (선택 사항) */
  onMarkerPress?: (id: string, lat: number, lng: number) => void;
  /** 스토리 경로(폴리라인) 터치 시 호출되는 콜백 함수 (선택 사항) */
  onPolylinePress?: (id: string) => void;
  /** 지도 영역(Region) 이동이 완료되었을 때 호출되는 콜백 함수 (선택 사항) */
  onRegionChangeComplete?: (region: Region) => void;
  /** 지도의 빈 공간을 터치했을 때 호출되는 콜백 함수 (선택 사항) */
  onPress?: (event: any) => void;
  /** 지도 위에 렌더링할 추가적인 컴포넌트들 */
  children?: React.ReactNode;
  /** 미니멀한 지도 스타일(POI, 노선 숨김 등) 적용 여부 (선택 사항) */
  minimalist?: boolean;
}

/**
 * 지도를 미니멀하게 유지하기 위한 스타일 설정
 * (지하철 노선, POI, 대중교통 아이콘 등을 숨김)
 */
const GOOGLE_MAPS_STYLE = [
  {
    featureType: 'transit.line',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit.station',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

export const MainMap = ({
  mapRef,
  myLocation,
  currentDelta,
  stories,
  selectedStoryId,
  membersWithLocation,
  onMarkerPress,
  onPolylinePress,
  onRegionChangeComplete,
  onPress,
  children,
  minimalist,
}: MainMapProps) => {
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      customMapStyle={minimalist ? GOOGLE_MAPS_STYLE : undefined}
      showsUserLocation={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      initialRegion={{
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        ...currentDelta,
      }}
      onRegionChangeComplete={onRegionChangeComplete}
      onPress={onPress}
    >
      {/* All Story Paths */}
      {stories?.map(story => {
        const isSelected = selectedStoryId === story.id;
        return (
          <Polyline
            key={story.id}
            coordinates={story.path}
            strokeColor={isSelected ? story.pathColor : story.pathColor + '40'}
            strokeWidth={isSelected ? 6 : 4}
            tappable={!!onPolylinePress}
            onPress={() => onPolylinePress?.(story.id)}
          />
        );
      })}

      {membersWithLocation?.map(member => (
        <Marker
          key={member.id}
          coordinate={member.location}
          onPress={() =>
            onMarkerPress?.(
              member.id,
              member.location.latitude,
              member.location.longitude,
            )
          }
        >
          <View style={styles.markerContainer}>
            {member.id !== 'user-1' && <View style={styles.pulseEffect} />}
            <View
              style={[
                styles.avatarMarker,
                member.id === 'user-1' && { borderColor: COLORS.primary },
              ]}
            >
              <ProfileAvatar uri={member.avatar} name={member.name} size={44} />
            </View>
          </View>
        </Marker>
      ))}

      {children}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { width: '100%', height: '100%' },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  pulseEffect: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
  },
  avatarMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
