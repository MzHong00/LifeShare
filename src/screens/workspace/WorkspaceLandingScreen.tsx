
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heart, User } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { APP_WORKSPACE } from '@/constants/config';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type RootStackParamList = {
  [NAV_ROUTES.PROFILE.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: undefined;
};

const WorkspaceLandingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <AppSafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate(NAV_ROUTES.PROFILE.NAME)}
        >
          <View style={styles.avatarPlaceholder}>
            <User size={24} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationWrapper}>
          <View style={styles.logoContainer}>
            <Heart size={48} color={COLORS.primary} fill={COLORS.primary} />
          </View>
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.emptyTitle}>
            함께하는 {APP_WORKSPACE.KR}이{'\n'}비어있어요
          </Text>
          <Text style={styles.emptyDescription}>
            우리만의 소중한 기록을 담을{'\n'}첫 번째 {APP_WORKSPACE.KR}을
            만들어볼까요?
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(NAV_ROUTES.WORKSPACE_SETUP.NAME)}
        >
          <Text style={styles.actionButtonText}>
            새로운 {APP_WORKSPACE.KR} 만들기
          </Text>
        </TouchableOpacity>
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.md,
    alignItems: 'flex-end',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  illustrationWrapper: {
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emptyTitle: {
    ...TYPOGRAPHY.header1,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.textPrimary,
  },
  emptyDescription: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionButton: {
    width: '100%',
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default WorkspaceLandingScreen;
