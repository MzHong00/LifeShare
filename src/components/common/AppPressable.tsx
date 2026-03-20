import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AppPressableProps extends Omit<PressableProps, 'style'> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  activeScale?: number;
}

/**
 * 프로젝트 전역에서 사용되는 공용 Pressable 컴포넌트입니다.
 * TouchableOpacity를 대체하며, 프리미엄한 클릭 피드백(Scale, Opacity)을 제공합니다.
 */
export const AppPressable = ({
  children,
  style,
  pressedStyle,
  activeOpacity = 0.7,
  activeScale = 0.98,
  ...props
}: AppPressableProps) => {
  const getStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => {
      const mergedStyle = [
        style,
        pressed && {
          opacity: activeOpacity,
          transform: [{ scale: activeScale }],
        },
        pressed && pressedStyle,
      ];
      return mergedStyle as StyleProp<ViewStyle>;
    },
    [style, pressedStyle, activeOpacity, activeScale]
  );

  return (
    <Pressable style={getStyle} {...props}>
      {children}
    </Pressable>
  );
};
