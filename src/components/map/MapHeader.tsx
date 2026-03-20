import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Search, Minimize2, Maximize2 } from 'lucide-react-native';

import { APP_COLORS, THEME_COLORS, SPACING } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { AppPressable } from '@/components/common/AppPressable';

interface MapHeaderProps {
  membersWithLocation: any[];
  moveToUser: (id: string, lat: number, lng: number) => void;
}

export const MapHeader = ({
  membersWithLocation,
  moveToUser,
}: MapHeaderProps) => {
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);

  return (
    <AppSafeAreaView
      style={styles.floatingHeader}
      edges={['top']}
      headerShown={false}
      pointerEvents="box-none"
    >
      {/* SafeAreaView가 만들어낸 Notch/상태바 패딩(Top) 아래쪽 영역을 기준으로 삼기 위한 래퍼 */}
      <View style={styles.relativeWrapper} pointerEvents="box-none">
        {/* 상태와 관계없이 항상 동일한 절대 위치에 떠있는 버튼 */}
        <AppPressable
          onPress={() => setIsHeaderMinimized(!isHeaderMinimized)}
          style={[
            styles.absoluteToggleBtn,
            isHeaderMinimized && styles.iconOnlyBtnBg,
          ]}
        >
          {isHeaderMinimized ? (
            <Maximize2 size={24} color={APP_COLORS.textSecondary} />
          ) : (
            <Minimize2 size={24} color={APP_COLORS.textSecondary} />
          )}
        </AppPressable>

        {/* 펼쳐졌을 때만 렌더링되는 백그라운드와 콘텐츠 */}
        {!isHeaderMinimized && (
          <View style={styles.headerContent}>
            {/* 절대 위치 버튼과 겹치지 않도록 높이를 잡아주는 투명한 더미 헤더 */}
            <View style={styles.headerTopSpace} />

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
                      size={40}
                      variant="elevated"
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
          </View>
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
  relativeWrapper: {
    position: 'relative',
  },
  // 버튼 위치와 크기를 고정시켜 눌러도 아이콘이 절대 움직이지 않도록 함
  absoluteToggleBtn: {
    position: 'absolute',
    // marginHorizontal: SPACING.layout과 내부 패딩 등을 고려한 절대 우측 여백 계산
    right: SPACING.layout + 12,
    top: SPACING.sm + 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  // 최소화 상태일 때만 들어가는 하얀 배경과 그림자
  iconOnlyBtnBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  headerContent: {
    marginHorizontal: SPACING.layout,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  headerTopSpace: {
    height: 40,
    marginBottom: 4,
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
