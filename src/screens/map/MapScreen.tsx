import { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import MapView from 'react-native-maps';

import { NAV_ROUTES } from '@/constants/navigation';
import { MainMap } from '@/components/map/MainMap';

import { APP_COLORS, THEME_COLORS } from '@/constants/theme';
import { AppPressable } from '@/components/common/AppPressable';
import { Route, Square } from 'lucide-react-native';
import { MAP_CONFIG } from '@/constants/map';
import { BottomDrawer } from '@/components/common/BottomDrawer';
import { MapHeader } from '@/components/map/MapHeader';
import { MapEmptyState } from '@/components/map/MapEmptyState';
import { MapStoryInfo } from '@/components/map/MapStoryInfo';
import { MapPartnerInfo } from '@/components/map/MapPartnerInfo';
import { MapLoadingOverlay } from '@/components/map/MapLoadingOverlay';
import { useGeolocation } from '@/businesses/geolocation/useGeolocation';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { modalActions } from '@/stores/useModalStore';
import { toastActions } from '@/stores/useToastStore';

const MapScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const mapRef = useRef<MapView>(null);
  const currentDeltaRef = useRef(MAP_CONFIG.CLOSE_DELTA);
  const { loading: myLocationLoading, location: myLocation } = useGeolocation();
  const { currentWorkspace } = useWorkspaceStore();

  const { stories, selectedStoryId, isRecording, recordingPath } =
    useStoryStore();
  const { setSelectedStoryId, startRecording, stopRecording, saveStory } =
    storyActions;
  const { showModal } = modalActions;
  const { showToast } = toastActions;

  // 현재 바텀시트에서 보여줄 선택된 유저 ID
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 워크스페이스 멤버들에게 가상의 위치 데이터 부여
  const membersWithLocation = (currentWorkspace?.members || []).map(member => ({
    ...member,
    // 나(민수)인 경우 실제 위치 사용, 아닐 경우 고정된 가상 위치 사용
    location:
      member.id === 'user-1'
        ? {
            latitude:
              myLocation?.latitude || MAP_CONFIG.DEFAULT_LOCATION.latitude,
            longitude:
              myLocation?.longitude || MAP_CONFIG.DEFAULT_LOCATION.longitude,
          }
        : member.id === 'user-2'
        ? { latitude: 37.5, longitude: 127.03 }
        : { latitude: 37.512, longitude: 127.04 }, // user-3, 4 등
  }));

  // 선택된 유저 데이터
  const selectedUser =
    membersWithLocation.find(m => m.id === selectedUserId) ||
    membersWithLocation[0];

  const recentPlaces = [
    { id: '1', name: '명동 성당 카페', date: '어제 오후 2:00', type: 'cafe' },
    { id: '2', name: '남산 타워', date: '3일 전', type: 'park' },
    { id: '3', name: '강남구청 역 이자카야', date: '지난 주말', type: 'food' },
  ];

  // 외부(예: 스토리 탭)에서 스토리를 선택하고 넘어왔을 때 지도 이동 처리
  useEffect(() => {
    if (selectedStoryId) {
      const story = stories.find(s => s.id === selectedStoryId);
      if (story && story.path.length > 0) {
        const { latitude, longitude } = story.path[0];
        setSelectedUserId(null); // 유저 정보 창 닫기
        // 지도 뷰포트 이동 애니메이션 실행
        mapRef.current?.animateToRegion(
          {
            // 대상 위도 및 경도 (스토리 시작 지점)
            latitude,
            longitude,
            // 현재 지도의 줌 레벨(확대/축소 상태)을 그대로 유지
            // 사용자가 지도를 확대/축소해놓은 상태가 초기화되지 않게 하기 위함
            ...currentDeltaRef.current,
          },
          // 500ms 동안 부드럽게 화면 이동 (애니메이션 지속 시간)
          500,
        );
      }
    }
  }, [selectedStoryId, stories]);

  // 특정 유저의 마커를 클릭했을 때 지도를 해당 위치로 이동
  const moveToUser = (id: string, lat: number, lng: number) => {
    setSelectedUserId(id);
    setSelectedStoryId(null); // 유저 선택 시 스토리 선택 해제
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        ...currentDeltaRef.current,
      },
      500,
    );
  };

  // 실시간 위치 기록을 시작하거나 종료(저장)하는 토글 함수
  const toggleRecording = () => {
    if (!isRecording) {
      // 기록 시작
      startRecording();
      showToast(
        '실시간 위치 기록을 시작합니다.\n이동하신 경로는 스토리로 저장됩니다.',
        'info',
      );
      return;
    }
    console.log(recordingPath);

    // 기록 종료 시 바로 저장
    if (recordingPath.length < 2) {
      showToast('기록된 경로가 너무 짧아 저장할 수 없습니다.', 'error');
      stopRecording();
      return;
    }

    // 실시간 위치 기록을 종료하고 저장
    const newStoryId = `story-${Date.now()}`;

    saveStory({
      id: newStoryId,
      title: `${new Date().toLocaleDateString()} 산책`,
      userId: 'user-1',
      workspaceId: currentWorkspace?.id || 'ws-1',
      pathColor: APP_COLORS.primary,
    });

    showToast('새로운 스토리가 지도에 기록되었습니다!', 'success');

    // 기록된 스토리 수정 화면으로 이동
    navigation.navigate(NAV_ROUTES.STORY_EDIT.NAME, { storyId: newStoryId });
  };

  // 파트너의 위치로 가는 길찾기(구글 맵) 외부 앱 실행 함수
  const openDirections = async () => {
    const partner = membersWithLocation.find(m => m.id === 'user-2');
    if (!partner) return;

    const { latitude, longitude } = partner.location;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showModal({
          type: 'alert',
          title: '에러',
          message: '구글 지도 앱을 열 수 없습니다.',
        });
      }
    } catch {
      showModal({
        type: 'alert',
        title: '에러',
        message: '길찾기 실행 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. 메인 지도 렌더링 영역 */}
      {myLocation && (
        <MainMap
          mapRef={mapRef}
          myLocation={myLocation}
          currentDelta={currentDeltaRef.current}
          stories={stories}
          recordingPath={recordingPath}
          isRecording={isRecording}
          selectedStoryId={selectedStoryId}
          membersWithLocation={membersWithLocation}
          onMarkerPress={moveToUser}
          onPolylinePress={id => {
            setSelectedStoryId(id);
            setSelectedUserId(null);
          }}
          onRegionChangeComplete={region => {
            currentDeltaRef.current = {
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            };
          }}
        />
      )}
      {/* 로딩 표시 바 (위치 정보 획득 전) */}
      {myLocationLoading && <MapLoadingOverlay />}

      {/* 2. 상단 헤더 영역 (프로필 목록 및 위치 기록 토글) */}
      <MapHeader
        membersWithLocation={membersWithLocation}
        moveToUser={moveToUser}
      />

      {/* 실시간 스토리 기록 제어 플로팅 버튼 */}
      <View style={styles.floatingActionContainer} pointerEvents="box-none">
        <AppPressable
          style={[
            styles.floatingActionBtn,
            isRecording && styles.floatingActionBtnRecording,
          ]}
          onPress={toggleRecording}
        >
          {isRecording ? (
            <>
              <Square size={16} color={THEME_COLORS.white} fill={THEME_COLORS.white} />
              <Text style={[styles.floatingActionText, { color: THEME_COLORS.white }]}>
                스토리 기록 종료
              </Text>
            </>
          ) : (
            <>
              <Route size={16} color={APP_COLORS.primary} />
              <Text style={[styles.floatingActionText, { color: APP_COLORS.primary }]}>
                스토리 기록 시작
              </Text>
            </>
          )}
        </AppPressable>
      </View>

      {/* 3. 하단 상세 정보 드로어 (스토리/파트너 정보 표시) */}
      <BottomDrawer snapPoints={[0.15, 0.55, 0.87]}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {selectedStoryId ? (
            (() => {
              const story = stories.find(s => s.id === selectedStoryId);
              if (!story) return null;
              return <MapStoryInfo story={story} />;
            })()
          ) : selectedUserId && selectedUser ? (
            <MapPartnerInfo
              selectedUser={selectedUser}
              onOpenDirections={openDirections}
              recentPlaces={recentPlaces}
            />
          ) : (
            <MapEmptyState />
          )}
        </ScrollView>
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.bgGray },
  floatingActionContainer: {
    position: 'absolute',
    bottom: 44, // 요구하신 대로 20픽셀 위로 올림
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingActionBtnRecording: {
    backgroundColor: THEME_COLORS.red,
    shadowColor: THEME_COLORS.red,
    shadowOpacity: 0.3,
  },
  floatingActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
});

export default MapScreen;
