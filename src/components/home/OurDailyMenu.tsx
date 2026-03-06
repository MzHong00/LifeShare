import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar, CheckSquare } from 'lucide-react-native';

import { APP_COLORS, THEME_COLORS, SPACING } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { Card } from '@/components/common/Card';
import { MenuButton } from '@/components/home/MenuButton';

export const OurDailyMenu = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <Card style={styles.menuCard}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>우리의 일상</Text>
      </View>
      <View style={styles.menuGrid}>
        <MenuButton
          title={NAV_ROUTES.CALENDAR.TITLE}
          icon={<Calendar size={18} color={THEME_COLORS.red} />}
          iconBgColor={THEME_COLORS.pinkLight}
          onPress={() => navigation.navigate(NAV_ROUTES.CALENDAR.NAME)}
        />
        <MenuButton
          title={NAV_ROUTES.TODO.TITLE}
          icon={<CheckSquare size={18} color={APP_COLORS.primary} />}
          iconBgColor={APP_COLORS.primaryLight}
          onPress={() => navigation.navigate(NAV_ROUTES.TODO.NAME)}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  menuCard: {
    padding: 0,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuHeader: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
});
