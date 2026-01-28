
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  User,
  Calendar,
  CheckSquare,
  Heart,
  ChevronRight,
} from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { MOCK_DATA } from '@/constants/mockData';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Section } from '@/components/common/Section';
import { Card } from '@/components/common/Card';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { DDayHero } from '@/components/home/DDayHero';
import { FeatureCard } from '@/components/home/FeatureCard';

type RootStackParamList = {
  [NAV_ROUTES.MAIN_TABS.NAME]: undefined;
  [NAV_ROUTES.CALENDAR.NAME]: undefined;
  [NAV_ROUTES.TODO.NAME]: undefined;
  [NAV_ROUTES.MEMORIES.NAME]: undefined;
  [NAV_ROUTES.PROFILE.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: undefined;
  [NAV_ROUTES.PRO_UPGRADE.NAME]: undefined;
  [NAV_ROUTES.CHAT.NAME]: undefined;
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);

  // currentWorkspace는 AppNavigator에서 보장됨
  if (!currentWorkspace) return null;

  return (
    <AppSafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={TYPOGRAPHY.header1}>{currentWorkspace.name}</Text>
            <Text style={[TYPOGRAPHY.body2, { color: COLORS.textSecondary }]}>
              함께 기록을 시작한 지 1250일
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
          days={MOCK_DATA.workspace.dDay}
          nextEventTitle={MOCK_DATA.workspace.nextEvent.title}
          nextDDay={MOCK_DATA.workspace.nextEvent.remainingDays}
          onPress={() => navigation.navigate(NAV_ROUTES.MEMORIES.NAME)}
        />

        {/* Partner Status */}
        <Section title="">
          <Card onPress={() => {}}>
            <View style={styles.partnerHeader}>
              <Text style={TYPOGRAPHY.body1}>사랑하는 파트너</Text>
              <ChevronRight size={20} color={COLORS.textTertiary} />
            </View>
            <View style={styles.partnerStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{MOCK_DATA.partner.status}</Text>
            </View>
          </Card>
        </Section>

        {/* Main Features */}
        <Section title="함께하는 일상">
          <FeatureCard
            title={NAV_ROUTES.CALENDAR.TITLE}
            description={`다음 일정: ${MOCK_DATA.calendar[0].title}`}
            icon={<Calendar size={24} color={COLORS.textPrimary} />}
            iconBgColor="#F0F0F0"
            onPress={() => navigation.navigate(NAV_ROUTES.CALENDAR.NAME)}
          />
          <FeatureCard
            title={NAV_ROUTES.TODO.TITLE}
            description={`오늘 할 일이 ${
              MOCK_DATA.todos.filter(t => !t.completed).length
            }개 남았어요`}
            icon={<CheckSquare size={24} color={COLORS.primary} />}
            iconBgColor="#EBF4FF"
            onPress={() => navigation.navigate(NAV_ROUTES.TODO.NAME)}
          />
          <FeatureCard
            title={NAV_ROUTES.MEMORIES.TITLE}
            description={`최근 추억: ${MOCK_DATA.memories[0].title}`}
            icon={<Heart size={24} color="#F04452" />}
            iconBgColor="#FFEBF0"
            onPress={() => navigation.navigate(NAV_ROUTES.MEMORIES.NAME)}
          />
        </Section>

        {/* Banner */}
        <Section>
          <Card
            style={styles.banner}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(NAV_ROUTES.PRO_UPGRADE.NAME)}
          >
            <Text style={styles.bannerText}>
              가족, 친구와도 추억을 나누고 싶나요? ✨
            </Text>
            <Text style={[styles.bannerSubText, { color: COLORS.primary }]}>
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
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  partnerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 8,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
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
});

export default HomeScreen;
