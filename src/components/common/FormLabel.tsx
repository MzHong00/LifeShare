import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';

interface FormLabelProps {
  children: string;
  style?: TextStyle;
  required?: boolean;
}

/**
 * 폼 필드나 섹션의 제목으로 사용되는 공용 라벨 컴포넌트입니다.
 */
export const FormLabel = ({ children, style, required }: FormLabelProps) => {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginLeft: 4,
  },
  required: {
    color: COLORS.error,
  },
});
