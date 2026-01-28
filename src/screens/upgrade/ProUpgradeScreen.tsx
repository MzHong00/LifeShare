
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Crown, Users, Map, Cloud, Zap } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

const ProUpgradeScreen = () => {
  const features = [
    {
      icon: <Users size={24} color={COLORS.primary} />,
      title: '무제한 멤버 초대',
      description: '가족, 친구들과 함께 여러 라이프룸을 운영해보세요.',
    },
    {
      icon: <Map size={24} color={COLORS.primary} />,
      title: '정밀 위치 히스토리',
      description: '과거의 모든 이동 경로를 제한 없이 다시 볼 수 있습니다.',
    },
    {
      icon: <Cloud size={24} color={COLORS.primary} />,
      title: '고화질 미디업 업로드',
      description: '소중한 추억을 원본 화질 그대로 클라우드에 보관하세요.',
    },
    {
      icon: <Zap size={24} color={COLORS.primary} />,
      title: '실시간 상태 알림',
      description: '중요한 순간을 놓치지 않도록 더 빠른 알림을 제공합니다.',
    },
  ];

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Crown
              size={40}
              color={COLORS.primary}
              fill={COLORS.primary + '20'}
            />
          </View>
          <Text style={styles.title}>LifeShare Pro</Text>
          <Text style={styles.subtitle}>
            소중한 인연들과 더 깊은 소통을 시작하세요
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>{feature.icon}</View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>LifeShare 추천</Text>
            </View>
            <Text style={styles.pricePeriod}>월간 구독</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>₩5,900</Text>
              <Text style={styles.priceUnit}>/ 월</Text>
            </View>
            <View style={{ height: SPACING.lg }} />
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Pro 플랜 시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerNote}>
          구독은 언제든지 취소할 수 있습니다.{'\n'}결제 시 LifeShare 이용약관 및
          개인정보 처리방침에 동의하게 됩니다.
        </Text>
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
  header: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.header1,
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginVertical: SPACING.xl,
    gap: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    marginTop: SPACING.md,
  },
  priceCard: {
    backgroundColor: '#191F28',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  pricePeriod: {
    color: COLORS.white + '80',
    fontSize: 14,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  priceUnit: {
    fontSize: 16,
    color: COLORS.white + '60',
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: SPACING.xl,
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProUpgradeScreen;
