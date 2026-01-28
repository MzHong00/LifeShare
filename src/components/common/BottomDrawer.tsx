import { type ReactNode, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomDrawerProps {
  children: ReactNode;
  /** 바텀시트의 스냅 포인트들 (위쪽부터 순서대로 비율 0~1) */
  snapPoints: number[];
  /** 초기 시작 인덱스 (snapPoints의 인덱스) */
  initialIndex?: number;
  /** 스타일 커스텀 */
  style?: ViewStyle;
}

/**
 * 드래그하여 높이 조절이 가능한 범용 바텀시트 컴포넌트
 */
export const BottomDrawer = ({
  children,
  snapPoints,
  initialIndex = 1,
  style,
}: BottomDrawerProps) => {
  // 실제 Y축 픽셀 값으로 변환
  const points = snapPoints.map(p => SCREEN_HEIGHT * p);

  const translateY = useRef(new Animated.Value(points[initialIndex])).current;
  const lastTranslateY = useRef(points[initialIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        const nextY = lastTranslateY.current + gesture.dy;
        // 최상단/최하단 바운더리 제한
        if (
          nextY >= points[0] - 50 &&
          nextY <= points[points.length - 1] + 50
        ) {
          translateY.setValue(nextY);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const currentY = lastTranslateY.current + gesture.dy;
        const velocity = gesture.vy;

        // 민감도 설정: 속도가 빠르거나 거리가 일정 이상이면 다음 포인트로 이동
        const VELOCITY_THRESHOLD = 0.2;
        const DRAG_THRESHOLD = 50;

        let destY = points.reduce((prev, curr) => {
          return Math.abs(curr - currentY) < Math.abs(prev - currentY)
            ? curr
            : prev;
        });

        // 위로 빠르게 드래그하거나 일정 거리 이상 올렸을 때
        if (velocity < -VELOCITY_THRESHOLD || gesture.dy < -DRAG_THRESHOLD) {
          const nextPoints = points
            .filter(p => p < lastTranslateY.current)
            .reverse();
          if (nextPoints.length > 0) destY = nextPoints[0];
        }
        // 아래로 빠르게 드래그하거나 일정 거리 이상 내렸을 때
        else if (velocity > VELOCITY_THRESHOLD || gesture.dy > DRAG_THRESHOLD) {
          const nextPoints = points.filter(p => p > lastTranslateY.current);
          if (nextPoints.length > 0) destY = nextPoints[0];
        }

        Animated.spring(translateY, {
          toValue: destY,
          useNativeDriver: true,
          bounciness: 4,
          speed: 12,
        }).start();

        lastTranslateY.current = destY;
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }, style]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
});
