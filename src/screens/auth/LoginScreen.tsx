import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { APP_BRAND_NAME } from '@/constants/config';
import { authActions } from '@/stores/useAuthStore';
import { userActions } from '@/stores/useUserStore';
import { workspaceActions } from '@/stores/useWorkspaceStore';
import { GoogleOAuthService } from '@/businesses/oauth/google/googleOAuthService';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { GoogleIcon, KakaoIcon } from '@/components/common/SocialIcons';

const LoginScreen = () => {
  const handleSocialLogin = (method: 'google' | 'kakao') => {
    const mockEmail =
      method === 'google' ? 'google_user@gmail.com' : 'kakao_user@kakao.com';

    // 1. 인증 토큰 저장
    authActions.setTokens('social-access-token', 'social-refresh-token');

    // 2. 사용자 정보 저장
    userActions.setUser({
      name: mockEmail.split('@')[0],
      profileImage: undefined,
    });

    workspaceActions.clearData();
  };

  return (
    <AppSafeAreaView style={styles.container} headerShown={false}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Heart size={48} color={COLORS.primary} fill={COLORS.primary} />
          </View>
          <Text style={styles.title}>{APP_BRAND_NAME.KR}</Text>
          <Text style={styles.subtitle}>
            우리의 소중한 일상을 함께 나누는 공간
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.socialButton, styles.kakaoButton]}
            activeOpacity={0.8}
            onPress={() => handleSocialLogin('kakao')}
          >
            <KakaoIcon size={24} />
            <Text style={styles.kakaoButtonText}>카카오톡으로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            activeOpacity={0.8}
            onPress={() => GoogleOAuthService.loginGoogleOAuth()}
          >
            <GoogleIcon size={22} />
            <Text style={styles.googleButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            로그인 시 {APP_BRAND_NAME.KR}의 이용약관 및{'\n'}개인정보 처리방침에
            동의하게 됩니다.
          </Text>
        </View>
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    // iOS Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Android Shadow
    elevation: 5,
  },
  title: {
    ...TYPOGRAPHY.header1,
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  socialButton: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  googleButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kakaoButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3C1E1E',
    marginLeft: 10,
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
