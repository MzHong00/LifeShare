import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Crown,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  History,
} from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type RootStackParamList = {
  [NAV_ROUTES.PRO_UPGRADE.NAME]: undefined;
};

const PlanManagementScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // 가상의 현재 플랜 데이터 (실제로는 스토어에서 가져와야 함)
  const isPro = false;

  const freeBenefits = [
    '라이프룸 1개 생성 및 참여',
    '기본 위치 공유 시스템',
    '최근 24시간 위치 히스토리',
    '표준 화질 미디어 업로드',
  ];

  const proBenefits = [
    '무제한 라이프룸 생성 및 참여',
    '정밀 위치 추적 및 무제한 히스토리',
    '원본 화질 미디어 무제한 업로드',
    '가족/친구 전용 안심 구역 설정',
    '실시간 상태 알림 최우선 전송',
  ];

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Plan Card */}
        <View style={styles.currentPlanCard}>
          <View style={styles.planHeader}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>현재 이용 중인 플랜</Text>
            </View>
            <Text style={styles.planName}>
              {isPro ? 'LifeShare Pro' : 'LifeShare Free'}
            </Text>
          </View>

          <View style={styles.planDivider} />

          <View style={styles.planInfoRow}>
            <Text style={styles.planInfoLabel}>결제 수단</Text>
            <Text style={styles.planInfoValue}>없음</Text>
          </View>
          <View style={styles.planInfoRow}>
            <Text style={styles.planInfoLabel}>다음 결제일</Text>
            <Text style={styles.planInfoValue}>-</Text>
          </View>
        </View>

        {/* Action Section */}
        {!isPro && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => navigation.navigate(NAV_ROUTES.PRO_UPGRADE.NAME)}
          >
            <View style={styles.upgradeContent}>
              <View style={styles.crownIconContainer}>
                <Crown size={20} color={COLORS.white} fill={COLORS.white} />
              </View>
              <View style={styles.upgradeTextContainer}>
                <Text style={styles.upgradeTitle}>Pro 플랜으로 업그레이드</Text>
                <Text style={styles.upgradeSubtitle}>
                  무제한 히스토리와 더 많은 혜택
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Benefits Comparison */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>플랜별 혜택</Text>

          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <Text style={styles.benefitsType}>무료 플랜</Text>
            </View>
            {freeBenefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle2 size={16} color={COLORS.textTertiary} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.benefitsCard, styles.proBenefitsCard]}>
            <View style={styles.benefitsHeader}>
              <Text style={[styles.benefitsType, { color: COLORS.primary }]}>
                Pro 플랜
              </Text>
              <Text style={styles.proLabel}>Premium</Text>
            </View>
            {proBenefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle2 size={16} color={COLORS.primary} />
                <Text style={[styles.benefitText, styles.proBenefitText]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Billing History (Placeholder) */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <History size={20} color={COLORS.textSecondary} />
              <Text style={styles.menuItemLabel}>결제 내역 확인</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <CreditCard size={20} color={COLORS.textSecondary} />
              <Text style={styles.menuItemLabel}>결제 수단 관리</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <ShieldCheck size={20} color={COLORS.textSecondary} />
              <Text style={styles.menuItemLabel}>구독 약관 및 취소 안내</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cancelLink}>
          <Text style={styles.cancelLinkText}>해지하기</Text>
        </TouchableOpacity>
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
    padding: SPACING.layout,
    paddingBottom: SPACING.xl * 2,
  },
  currentPlanCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  planHeader: {
    marginBottom: 20,
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  planName: {
    ...TYPOGRAPHY.header1,
    color: COLORS.textPrimary,
  },
  planDivider: {
    height: 1,
    backgroundColor: COLORS.skeleton,
    marginBottom: 20,
  },
  planInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planInfoLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  planInfoValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#191F28',
    borderRadius: 24,
    padding: 20,
    marginBottom: SPACING.xl,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  crownIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  benefitsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginLeft: 4,
  },
  benefitsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  proBenefitsCard: {
    borderColor: COLORS.primary + '30',
    backgroundColor: COLORS.primary + '05',
  },
  benefitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitsType: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  proLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  proBenefitText: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 8,
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cancelLinkText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    textDecorationLine: 'underline',
  },
});

export default PlanManagementScreen;
