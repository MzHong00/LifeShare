import { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  Zap,
  Sparkles,
  MapPin,
  Square,
  Route,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import MapView from 'react-native-maps';
import { MainMap } from '@/components/map/MainMap';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { BottomDrawer } from '@/components/common/BottomDrawer';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { MapStoryInfo } from '@/components/map/MapStoryInfo';
import { MapPartnerInfo } from '@/components/map/MapPartnerInfo';
import { useGeolocation } from '@/businesses/geolocation/useGeolocation';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { modalActions } from '@/stores/useModalStore';
import { getCurrentTimeString } from '@/utils/date';

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const currentDeltaRef = useRef({
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const { loading: myLocationLoading, location: myLocation } = useGeolocation();
  const { currentWorkspace } = useWorkspaceStore();

  const { isRecording, recordingPath, stories, selectedStoryId } =
    useStoryStore();
  const { startRecording, stopRecording, saveStory, setSelectedStoryId } =
    storyActions;
  const { showModal } = modalActions;

  const [showHistory, setShowHistory] = useState(false);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);

  // 현재 바텀시트에서 보여줄 선택된 유저 ID
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 워크스페이스 멤버들에게 가상의 위치 데이터 부여
  const membersWithLocation = (currentWorkspace?.members || []).map(member => ({
    ...member,
    // 나(민수)인 경우 실제 위치 사용, 아닐 경우 고정된 가상 위치 사용
    location:
      member.id === 'user-1'
        ? {
            latitude: myLocation?.latitude || 37.4979,
            longitude: myLocation?.longitude || 127.0276,
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
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            ...currentDeltaRef.current,
          },
          500,
        );
      }
    }
  }, [selectedStoryId, stories]);

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

  const handleToggleRecording = () => {
    if (isRecording) {
      if (recordingPath.length === 0) {
        stopRecording();
        return;
      }
      showModal({
        type: 'confirm',
        title: '스토리 기록 중단',
        message: '지금까지의 경로를 스토리로 저장할까요?',
        confirmText: '저장',
        cancelText: '취소',
        onConfirm: () => {
          saveStory({
            id: Date.now().toString(),
            title: `${getCurrentTimeString()}의 기록`,
            userId: 'user-1',
            workspaceId: currentWorkspace?.id || 'ws-1',
          });
          showModal({
            type: 'alert',
            title: '저장 완료',
            message: '스토리 탭에서 확인할 수 있습니다.',
          });
        },
        onCancel: () => stopRecording(),
      });
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      {myLocation && (
        <MainMap
          mapRef={mapRef}
          myLocation={myLocation}
          currentDelta={currentDeltaRef.current}
          isRecording={isRecording}
          recordingPath={recordingPath}
          showHistory={showHistory}
          stories={stories}
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
      {myLocationLoading && (
        <View style={styles.mapLoadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>위치 정보를 불러오는 중...</Text>
        </View>
      )}

      {/* Floating Header UI */}
      <AppSafeAreaView
        style={styles.floatingHeader}
        edges={['top']}
        headerShown={false}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <View style={styles.statusBadge}>
              <Zap size={10} color={COLORS.success} fill={COLORS.success} />
              <Text style={styles.statusBadgeText}>실시간 업데이트 중</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsHeaderMinimized(!isHeaderMinimized)}
              style={styles.minimizeBtn}
              activeOpacity={0.7}
            >
              {isHeaderMinimized ? (
                <ChevronDown size={18} color={COLORS.textTertiary} />
              ) : (
                <ChevronUp size={18} color={COLORS.textTertiary} />
              )}
            </TouchableOpacity>
          </View>

          {!isHeaderMinimized && (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.userListScroll}
              >
                {membersWithLocation.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.userItem}
                    onPress={() =>
                      moveToUser(
                        member.id,
                        member.location.latitude,
                        member.location.longitude,
                      )
                    }
                  >
                    <ProfileAvatar
                      uri={member.avatar}
                      name={member.name}
                      size={44}
                    />
                    <Text style={styles.userNameText}>{member.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.headerActionBar}>
                <TouchableOpacity
                  style={[
                    styles.headerActionPill,
                    showHistory && { backgroundColor: COLORS.primary },
                  ]}
                  onPress={() => setShowHistory(!showHistory)}
                >
                  <Route
                    size={14}
                    color={showHistory ? COLORS.white : COLORS.textPrimary}
                  />
                  <Text
                    style={[
                      styles.headerActionText,
                      showHistory && { color: COLORS.white },
                    ]}
                  >
                    우리의 스토리보기
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.headerActionPill,
                    isRecording && { backgroundColor: COLORS.error },
                  ]}
                  onPress={handleToggleRecording}
                >
                  {isRecording ? (
                    <Square
                      size={12}
                      color={COLORS.white}
                      fill={COLORS.white}
                    />
                  ) : (
                    <Sparkles
                      size={14}
                      color={COLORS.textPrimary}
                      fill={COLORS.textPrimary + '20'}
                    />
                  )}
                  <Text
                    style={[
                      styles.headerActionText,
                      isRecording && { color: COLORS.white },
                    ]}
                  >
                    {isRecording ? '위치 기록 중' : '스토리 만들기'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </AppSafeAreaView>

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
            <View style={styles.emptyDrawerContent}>
              <View style={styles.emptyInfoCard}>
                <MapPin size={24} color={COLORS.textTertiary} />
                <Text style={styles.emptyInfoText}>
                  위의 멤버 아이콘이나 경로를 눌러{'\n'}상세 정보를 확인해보세요
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  mapLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.skeleton,
  },
  loadingText: {
    marginTop: 12,
    ...TYPOGRAPHY.body2,
  },
  floatingHeader: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    marginHorizontal: SPACING.layout,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    marginBottom: 4,
  },
  minimizeBtn: {
    padding: 4,
  },
  headerActionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    marginTop: 4,
  },
  headerActionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.skeleton,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginLeft: 3,
  },
  userListScroll: {
    paddingHorizontal: 12,
    gap: 16,
    paddingBottom: 4,
  },
  userItem: {
    alignItems: 'center',
    width: 60,
  },
  userAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.skeleton,
    marginBottom: 4,
    padding: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  userAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitialText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  userNameText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  markerAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  emptyDrawerContent: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyInfoCard: {
    alignItems: 'center',
    gap: 12,
  },
  emptyInfoText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MapScreen;
