import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  Route,
  Square,
} from 'lucide-react-native';

import { APP_COLORS, THEME_COLORS, SPACING } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { AppPressable } from '@/components/common/AppPressable';

interface MapHeaderProps {
  isRecording: boolean;
  toggleRecording: () => void;
  membersWithLocation: any[];
  moveToUser: (id: string, lat: number, lng: number) => void;
}

export const MapHeader = ({
  isRecording,
  toggleRecording,
  membersWithLocation,
  moveToUser,
}: MapHeaderProps) => {
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);

  return (
    <AppSafeAreaView
      style={styles.floatingHeader}
      edges={['top']}
      headerShown={false}
    >
      <View style={styles.headerContent}>
        {/* 1. 최상단 상태 뱃지 및 헤더 축소/확장 토글 버튼 */}
        <View style={styles.headerTopRow}>
          <View style={styles.statusBadge}>
            <MapPin
              size={10}
              color={APP_COLORS.success}
              fill={APP_COLORS.success}
            />
            <Text style={styles.statusBadgeText}>실시간 업데이트 중</Text>
          </View>
          <AppPressable
            onPress={() => setIsHeaderMinimized(!isHeaderMinimized)}
            style={styles.minimizeBtn}
          >
            {isHeaderMinimized ? (
              <ChevronDown size={18} color={APP_COLORS.textTertiary} />
            ) : (
              <ChevronUp size={18} color={APP_COLORS.textTertiary} />
            )}
          </AppPressable>
        </View>

        {!isHeaderMinimized && (
          <>
            {/* 2. 워크스페이스 멤버 목록 (좌우 스크롤) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.userListScroll}
            >
              {membersWithLocation.map(member => (
                <AppPressable
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
                </AppPressable>
              ))}
            </ScrollView>

            {/* 3. 실시간 스토리 기록 제어 버튼 영역 */}
            <View style={styles.headerActionBar}>
              <AppPressable
                style={[
                  styles.headerActionPill,
                  isRecording && { backgroundColor: THEME_COLORS.red + '15' },
                ]}
                onPress={toggleRecording}
              >
                {isRecording ? (
                  <>
                    <Square
                      size={14}
                      color={THEME_COLORS.red}
                      fill={THEME_COLORS.red}
                    />
                    <Text
                      style={[
                        styles.headerActionText,
                        { color: THEME_COLORS.red },
                      ]}
                    >
                      스토리 기록 종료
                    </Text>
                  </>
                ) : (
                  <>
                    <Route size={14} color={APP_COLORS.primary} />
                    <Text
                      style={[
                        styles.headerActionText,
                        { color: APP_COLORS.primary },
                      ]}
                    >
                      실시간 스토리 기록
                    </Text>
                  </>
                )}
              </AppPressable>
            </View>
          </>
        )}
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  avatarContainer: {
    position: 'relative',
  },
  userNameText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
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
});
