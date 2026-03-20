import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image as ImageIcon } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppPressable } from '@/components/common/AppPressable';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { joinValuesWithDot } from '@/utils/format';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { useUserStore } from '@/stores/useUserStore';
import { modalActions } from '@/stores/useModalStore';
import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { calculateDDay } from '@/utils/date';
import { NAV_ROUTES } from '@/constants/navigation';
import { MOCK_DATA } from '@/constants/mockData';

export const DDayHero = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = useUserStore();
  const { updateWorkspaceBackground } = workspaceActions;
  const { showModal } = modalActions;

  if (!currentWorkspace || !user) return null;

  const days = currentWorkspace.startDate
    ? calculateDDay(currentWorkspace.startDate)
    : 0;
  const backgroundImage = currentWorkspace.backgroundImage;

  // 내부적으로 다음 일정 데이터 가져오기
  const nextEventTitle = MOCK_DATA.workspace.nextEvent.title;
  const nextDDay = MOCK_DATA.workspace.nextEvent.remainingDays;

  const handleNextEventPress = () => {
    navigation.navigate(NAV_ROUTES.ANNIVERSARY.NAME);
  };

  const handleBackgroundChange = () => {
    showModal({
      type: 'confirm',
      title: '배경 변경',
      message: '앨범에서 사진을 선택하여 배경을 변경하시겠습니까?',
      confirmText: '앨범에서 선택',
      cancelText: '취소',
      onConfirm: async () => {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });

        if (result.assets && result.assets[0].uri) {
          updateWorkspaceBackground(currentWorkspace.id, result.assets[0].uri);
          showModal({
            type: 'alert',
            title: '알림',
            message: '배경 이미지가 변경되었습니다.',
          });
        }
      },
    });
  };

  // 참여자 이름들을 유틸 함수를 통해 ' · ' 로 연결한 문자열 생성
  const memberNamesString = joinValuesWithDot(
    currentWorkspace.members,
    'name',
    user.name
  );

  const content = (
    <View style={[styles.contentContainer, { paddingTop: insets.top + SPACING.sm }]}>
      
      {/* 1. 최상단 헤더 (타이틀 + 내 프로필) */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={[TYPOGRAPHY.header1, backgroundImage && styles.whiteText]}>
            {currentWorkspace.name}
          </Text>
          <Text style={[TYPOGRAPHY.body2, styles.headerSubTitle, backgroundImage && styles.whiteOpacityText]}>
            {memberNamesString}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <AppPressable onPress={() => navigation.navigate(NAV_ROUTES.PROFILE.NAME)}>
            <ProfileAvatar
              uri={user.profileImage}
              name={user.name}
              size={40}
              variant="elevated"
            />
          </AppPressable>
        </View>
      </View>

      {/* 2. D-Day, 참여자 프로필 및 편집 아이콘 */}
      <View style={styles.main}>
        {/* 참여자 아바타 스택 (클릭 시 모달) */}
        <AppPressable 
          style={styles.participantsContainer}
          onPress={() => {
            showModal({
              type: 'alert',
              title: '참여자 목록',
              content: (
                <View style={styles.modalContent}>
                  {currentWorkspace.members && currentWorkspace.members.length > 0 ? (
                    currentWorkspace.members.map(member => (
                      <View key={member.id} style={styles.participantRow}>
                        <ProfileAvatar uri={member.avatar} name={member.name} size={44} />
                        <View style={styles.participantInfo}>
                          <Text style={styles.participantName}>{member.name}</Text>
                          <Text style={styles.participantEmail}>{member.email}</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.participantRow}>
                      <ProfileAvatar uri={user.profileImage} name={user.name} size={44} />
                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{user.name}</Text>
                        <Text style={styles.participantEmail}>나</Text>
                      </View>
                    </View>
                  )}
                </View>
              ),
              confirmText: '닫기'
            });
          }}
        >
          {currentWorkspace.members && currentWorkspace.members.length > 0 ? (
            currentWorkspace.members.map((member, index) => (
              <View 
                key={member.id} 
                style={[
                  styles.avatarStacked, 
                  index === 0 && styles.firstAvatar,
                  { zIndex: 10 - index }
                ]}
              >
                <ProfileAvatar
                  uri={member.avatar}
                  name={member.name}
                  size={32}
                />
              </View>
            ))
          ) : null}
        </AppPressable>

        <View style={styles.daysRow}>
          <View style={styles.daysContainer}>
            <Text style={[styles.days, backgroundImage && styles.whiteText]}>
              {days}
            </Text>
            <Text style={[styles.suffix, backgroundImage && styles.whiteText]}>
              일
            </Text>
          </View>
          
          {/* 배경 이미지 편집 버튼 */}
          <AppPressable
            onPress={handleBackgroundChange}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.editIconWrapper, backgroundImage && styles.whiteIconWrapper]}
          >
            <ImageIcon
              size={18}
              color={backgroundImage ? THEME_COLORS.white : APP_COLORS.textTertiary}
            />
          </AppPressable>
        </View>
      </View>

      {/* 3. 다음 일정 하단 뱃지 */}
      <View style={styles.footer}>
        <AppPressable
          onPress={handleNextEventPress}
          style={[styles.nextEventBadge, backgroundImage && styles.whiteBadgeWrapper]}
        >
          <Text style={[styles.nextEventText, backgroundImage && styles.whiteText]}>
            {nextEventTitle}{' '}
            <Text style={[styles.dDayHighlight, backgroundImage && styles.whiteText]}>
              D-{nextDDay}
            </Text>
          </Text>
        </AppPressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay} />
          {content}
        </ImageBackground>
      ) : (
        <View style={styles.solidBackground}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  solidBackground: {
    backgroundColor: APP_COLORS.bgGray,
    width: '100%',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
  },
  imageStyle: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  contentContainer: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: SPACING.lg,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubTitle: {
    color: APP_COLORS.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  whiteIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    elevation: 0,
    shadowOpacity: 0,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarStacked: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: THEME_COLORS.white,
  },
  firstAvatar: {
    marginLeft: 0,
  },
  modalContent: {
    paddingTop: 16,
    gap: 16,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  participantEmail: {
    ...TYPOGRAPHY.caption,
    color: APP_COLORS.textSecondary,
    marginTop: 2,
  },
  main: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  daysRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  days: {
    fontSize: 44,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
    letterSpacing: -1,
  },
  suffix: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginLeft: 4,
    marginBottom: 6,
  },
  footer: {
    width: '100%',
    marginTop: 10,
  },
  nextEventBadge: {
    backgroundColor: THEME_COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  nextEventText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    fontSize: 14,
  },
  dDayHighlight: {
    color: APP_COLORS.primary,
    fontWeight: '800',
    marginLeft: 4,
  },
  whiteText: {
    color: THEME_COLORS.white,
  },
  whiteOpacityText: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  whiteBadgeWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    elevation: 0,
    shadowOpacity: 0,
  },
});
