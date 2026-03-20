import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { THEME_COLORS } from '@/constants/theme';
import { AppPressable } from '@/components/common/AppPressable';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Card = ({ children, style, onPress }: CardProps) => {
  if (onPress) {
    return (
      <AppPressable style={[styles.card, style]} onPress={onPress}>
        {children}
      </AppPressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
