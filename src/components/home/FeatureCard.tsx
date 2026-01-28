import type { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

export const FeatureCard = ({
  title,
  description,
  icon,
  iconBgColor,
  onPress,
}: FeatureCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  info: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
