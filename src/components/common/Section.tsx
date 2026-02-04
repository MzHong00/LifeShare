import type { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

import { COLORS, SPACING } from '@/constants/theme';

interface SectionProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}

export const Section = ({ title, children, style }: SectionProps) => {
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.layout,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textTertiary,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
