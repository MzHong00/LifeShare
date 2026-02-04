import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { User, Calendar, CheckSquare, Heart } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { MOCK_DATA } from '@/constants/mockData';
import { calculateDDay } from '@/utils/date';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import { Section } from '@/components/common/Section';
import { Card } from '@/components/common/Card';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { DDayHero } from '@/components/home/DDayHero';
import { MenuButton } from '@/components/home/MenuButton';

type RootStackParamList = {
  [NAV_ROUTES.MAIN_TABS.NAME]: undefined;
  [NAV_ROUTES.CALENDAR.NAME]: undefined;
  [NAV_ROUTES.TODO.NAME]: undefined;
  [NAV_ROUTES.STORIES.NAME]: undefined;
  [NAV_ROUTES.PROFILE.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: undefined;
  [NAV_ROUTES.PRO_UPGRADE.NAME]: undefined;
  [NAV_ROUTES.CHAT.NAME]: undefined;
  [NAV_ROUTES.ANNIVERSARY.NAME]: undefined;
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { currentWorkspace } = useWorkspaceStore();
  const { updateWorkspaceBackground } = workspaceActions;
  const { showModal } = modalActions;

  // currentWorkspace는 AppNavigator에서 보장됨
  if (!currentWorkspace) return null;

  return (
    <AppSafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
      headerShown={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={TYPOGRAPHY.header1}>{currentWorkspace.name}</Text>
            <Text style={[TYPOGRAPHY.body2, styles.headerSubTitle]}>
              {currentWorkspace.startDate
                ? `함께 기록을 시작한 지 ${calculateDDay(
                    currentWorkspace.startDate,
                  )}일`
                : '소중한 일상을 기록해보세요'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate(NAV_ROUTES.PROFILE.NAME)}
          >
            <View style={styles.avatarPlaceholder}>
              <User size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* D-Day Section */}
        <DDayHero
          partnerName={currentWorkspace.partnerName || MOCK_DATA.partner.name}
          myName={MOCK_DATA.user.name}
          days={
            currentWorkspace.startDate
              ? calculateDDay(currentWorkspace.startDate)
              : 0
          }
          nextEventTitle={MOCK_DATA.workspace.nextEvent.title}
          nextDDay={MOCK_DATA.workspace.nextEvent.remainingDays}
          backgroundImage={currentWorkspace.backgroundImage}
          onPress={() =>
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
                  updateWorkspaceBackground(
                    currentWorkspace.id,
                    result.assets[0].uri,
                  );
                  showModal({
                    type: 'alert',
                    title: '알림',
                    message: '배경 이미지가 변경되었습니다.',
                  });
                }
              },
            })
          }
          onPressNextEvent={() =>
            navigation.navigate(NAV_ROUTES.ANNIVERSARY.NAME)
          }
        />

        {/* Main Features */}
        <Section>
          <View style={styles.menuGrid}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>우리의 일상</Text>
            </View>
            <MenuButton
              title={NAV_ROUTES.CALENDAR.TITLE}
              icon={<Calendar size={18} color={COLORS.textPrimary} />}
              iconBgColor="#F2F4F6"
              onPress={() => navigation.navigate(NAV_ROUTES.CALENDAR.NAME)}
            />
            <MenuButton
              title={NAV_ROUTES.TODO.TITLE}
              icon={<CheckSquare size={18} color={COLORS.primary} />}
              iconBgColor="#EBF4FF"
              onPress={() => navigation.navigate(NAV_ROUTES.TODO.NAME)}
            />
            <MenuButton
              title={NAV_ROUTES.STORIES.TITLE}
              icon={<Heart size={18} color="#F04452" />}
              iconBgColor="#FFEBF0"
              onPress={() => navigation.navigate(NAV_ROUTES.STORIES.NAME)}
            />
          </View>
        </Section>

        {/* Banner */}
        <Section>
          <Card
            style={styles.banner}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(NAV_ROUTES.PRO_UPGRADE.NAME)}
          >
            <Text style={styles.bannerText}>
              가족, 친구와도 스토리를 나누고 싶나요? ✨
            </Text>
            <Text style={[styles.bannerSubText, styles.bannerPrimaryText]}>
              Pro 플랜으로 업그레이드
            </Text>
          </Card>
        </Section>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  menuHeader: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.xl,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },

  banner: {
    backgroundColor: '#191F28',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  bannerText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerSubText: {
    color: COLORS.textTertiary,
    fontSize: 12,
  },
  setupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  setupIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  setupTextContainer: {
    flex: 1,
  },
  setupTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  setupDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  headerSubTitle: {
    color: COLORS.textSecondary,
  },
  bannerPrimaryText: {
    color: COLORS.primary,
  },
});

export default HomeScreen;
