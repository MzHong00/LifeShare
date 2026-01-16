import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
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
    ...TYPOGRAPHY.header2,
    marginBottom: SPACING.lg,
  },
});
