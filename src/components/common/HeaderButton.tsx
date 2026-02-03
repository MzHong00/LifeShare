import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface HeaderButtonProps {
  label?: string;
  onPress: () => void;
  color?: string;
  icon?: React.ReactNode;
}

/**
 * 네비게이션 헤더 우측 혹은 좌측에 사용되는 공용 라이트 버튼 컴포넌트입니다.
 */
export const HeaderButton = ({
  label,
  onPress,
  color,
  icon,
}: HeaderButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon}
      {label && (
        <Text style={[styles.text, color ? { color } : {}]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.md,
  },
  text: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
