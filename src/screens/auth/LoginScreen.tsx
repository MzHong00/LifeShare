import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';

import { APP_BRAND_NAME } from '@/constants/config';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { GoogleOAuthService } from '@/businesses/oauth/google/googleOAuthService';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { GoogleIcon, KakaoIcon } from '@/components/common/SocialIcons';

const LoginScreen = () => {
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
            onPress={() => {}}
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
    backgroundColor: COLORS.kakao,
  },
  googleButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kakaoButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.kakaoText,
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
