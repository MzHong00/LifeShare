import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

const PrivacyPolicyScreen = () => {
  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.title}>개인정보 처리방침</Text>
          <Text style={styles.date}>최종 업데이트: 2026년 2월 4일</Text>

          <Text style={styles.paragraph}>
            라이프쉐어(이하 '회사')는 사용자의 개인정보를 소중하게 생각하며,
            관련 법령에 따라 사용자의 개인정보를 안전하게 보호하고 원활한
            서비스를 제공하기 위해 최선을 다하고 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>1. 수집하는 개인정보 항목</Text>
          <Text style={styles.paragraph}>
            회사는 다음과 같은 개인정보를 수집합니다:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • 계정 정보: 이름, 이메일 주소, 프로필 사진
            </Text>
            <Text style={styles.bulletItem}>
              • 서비스 이용 기록: 접속 로그, 쿠키, 위치 정보(선택 시)
            </Text>
            <Text style={styles.bulletItem}>
              • 결제 정보: 상품 구매 시 필요한 결제 수단 정보
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>2. 개인정보의 이용 목적</Text>
          <Text style={styles.paragraph}>
            수집한 개인정보는 다음과 같은 목적으로 사용됩니다:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 서비스 가입 및 본인 확인</Text>
            <Text style={styles.bulletItem}>
              • 콘텐츠 제공 및 맞춤 서비스 추천
            </Text>
            <Text style={styles.bulletItem}>
              • 신규 기능 안내 및 고객 상담 처리
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>3. 개인정보의 보유 및 이용 기간</Text>
          <Text style={styles.paragraph}>
            회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당
            정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 보존할 필요가 있는
            경우는 예외로 합니다.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            더 자세한 내용은 공식 홈페이지 또는 고객 지원팀을 통해 확인하실 수
            있습니다.
          </Text>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.layout,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    ...TYPOGRAPHY.header1,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginBottom: 20,
  },
  subTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  paragraph: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 8,
    paddingLeft: 8,
  },
  bulletItem: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 4,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: COLORS.background,
    borderRadius: 16,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PrivacyPolicyScreen;
