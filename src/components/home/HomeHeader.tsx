import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { calculateDDay } from '@/utils/date';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useUserStore } from '@/stores/useUserStore';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { AppPressable } from '@/components/common/AppPressable';

export const HomeHeader = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = useUserStore();

  if (!currentWorkspace || !user) return null;

  return (
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
      <AppPressable
        style={styles.profileButton}
        onPress={() => navigation.navigate(NAV_ROUTES.PROFILE.NAME)}
      >
        <ProfileAvatar uri={user.profileImage} name={user.name} size={40} />
      </AppPressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: THEME_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerSubTitle: {
    color: APP_COLORS.textSecondary,
  },
});
