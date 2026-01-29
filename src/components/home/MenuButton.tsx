import type { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface MenuButtonProps {
  title: string;
  icon: ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

export const MenuButton = ({
  title,
  icon,
  iconBgColor,
  onPress,
}: MenuButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '33.33%',
    paddingVertical: SPACING.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
