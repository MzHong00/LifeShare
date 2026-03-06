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
import { MapPin, ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import MapView from 'react-native-maps';
import { MainMap } from '@/components/map/MainMap';

import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { MAP_CONFIG } from '@/constants/map';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { BottomDrawer } from '@/components/common/BottomDrawer';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { MapStoryInfo } from '@/components/map/MapStoryInfo';
import { MapPartnerInfo } from '@/components/map/MapPartnerInfo';
import { useGeolocation } from '@/businesses/geolocation/useGeolocation';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { modalActions } from '@/stores/useModalStore';

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const currentDeltaRef = useRef(MAP_CONFIG.CLOSE_DELTA);
  const { loading: myLocationLoading, location: myLocation } = useGeolocation();
  const { currentWorkspace } = useWorkspaceStore();

  const { stories, selectedStoryId } = useStoryStore();
  const { setSelectedStoryId } = storyActions;
  const { showModal } = modalActions;

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

  return (
    <View style={styles.container}>
      {myLocation && (
        <MainMap
          mapRef={mapRef}
          myLocation={myLocation}
          currentDelta={currentDeltaRef.current}
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
          <ActivityIndicator size="large" color={APP_COLORS.primary} />
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
              <MapPin
                size={10}
                color={APP_COLORS.success}
                fill={APP_COLORS.success}
              />
              <Text style={styles.statusBadgeText}>실시간 업데이트 중</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsHeaderMinimized(!isHeaderMinimized)}
              style={styles.minimizeBtn}
              activeOpacity={0.7}
            >
              {isHeaderMinimized ? (
                <ChevronDown size={18} color={APP_COLORS.textTertiary} />
              ) : (
                <ChevronUp size={18} color={APP_COLORS.textTertiary} />
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
                    <View style={styles.avatarContainer}>
                      <ProfileAvatar
                        uri={member.avatar}
                        name={member.name}
                        size={44}
                      />
                      <View style={styles.locateIconContainer}>
                        <Search
                          size={10}
                          color={THEME_COLORS.white}
                          strokeWidth={3}
                        />
                      </View>
                    </View>
                    <Text style={styles.userNameText}>{member.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
                <MapPin size={24} color={APP_COLORS.textTertiary} />
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
  container: { flex: 1, backgroundColor: APP_COLORS.bgGray },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
  },
  mapLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.skeleton,
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
        shadowColor: THEME_COLORS.black,
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
    backgroundColor: APP_COLORS.bgGray,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: APP_COLORS.skeleton,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: APP_COLORS.success,
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
    backgroundColor: APP_COLORS.skeleton,
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
    backgroundColor: APP_COLORS.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitialText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
  },
  userNameText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  avatarContainer: {
    position: 'relative',
  },
  locateIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: APP_COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME_COLORS.white,
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
    color: APP_COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MapScreen;
