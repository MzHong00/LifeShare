import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { APP_COLORS, THEME_COLORS, TYPOGRAPHY } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'error' | 'outline';
  size?: 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * 프로젝트 전역에서 사용되는 공용 버튼 컴포넌트입니다.
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) => {
  const isPrimary = variant === 'primary';
  const isError = variant === 'error';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary || isError ? THEME_COLORS.white : APP_COLORS.primary}
        />
      ) : (
        <Text style={[styles.textBase, styles[`${variant}Text`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  lg: {
    height: 56,
    width: '100%',
  },
  md: {
    height: 48,
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: APP_COLORS.primary,
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  secondary: {
    backgroundColor: APP_COLORS.primaryLight,
  },
  error: {
    backgroundColor: APP_COLORS.error,
  },
  outline: {
    backgroundColor: THEME_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  disabled: {
    backgroundColor: APP_COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  textBase: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
  },
  primaryText: {
    color: THEME_COLORS.white,
  },
  secondaryText: {
    color: APP_COLORS.primary,
  },
  errorText: {
    color: THEME_COLORS.white,
  },
  outlineText: {
    color: APP_COLORS.textSecondary,
  },
});
