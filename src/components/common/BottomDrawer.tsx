import React, { useRef } from 'react';
import { StyleSheet, Animated, PanResponder, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';

/**
 * [DRAWER_LOGIC]
 * 하단 드로어의 핵심 동작(로직)을 제어하는 상수들입니다.
 * 이 수치들을 조정하여 드로어의 '느낌'을 바꿀 수 있습니다.
 */
const DRAWER_LOGIC = {
  // 1. 드래그 시작 감도: 사용자가 최소 2px은 움직여야 드래그로 인식합니다. (터치 실수 방지)
  DRAG_START_THRESHOLD: 2,

  // 2. 속도 가중치: 사용자가 손을 뗄 때의 속도(vy)에 곱해지는 값입니다.
  // 이 값이 높을수록 살짝만 위/아래로 튕겨도(Flick) 자석처럼 다음 단계로 확 넘어갑니다.
  FLICK_VELOCITY_WEIGHT: 40,

  // 3. 핸들 노출 높이: 드로어를 가장 아래로 내렸을 때, 화면 하단에 남겨둘 핸들 영역의 높이(px)입니다.
  MIN_VISIBLE_HANDLE_HEIGHT: 30,

  // 4. 초기 숨김 위치: 레이아웃(높이)이 계산되기 전, 시트가 화면에 보이지 않게 멀리 치워두는 값입니다.
  OFFSCREEN_INITIAL_Y: 2000,

  // 5. 애니메이션 댐핑: 스프링 애니메이션이 정착할 때의 튕김 억제 정도입니다. (낮을수록 더 많이 출렁임)
  ANIMATION_SPRING_DAMPING: 25,
};

interface BottomDrawerProps {
  children: React.ReactNode;
  /** 스냅 포인트 비율 배열 (예: [0, 0.5, 1]) */
  snapPoints: number[];
  /** 초기 시작 위치 인덱스 */
  initialIndex?: number;
}

/**
 * [BottomDrawer] 고성능, 고감도 범용 바텀 드로어
 * - 부모의 영역(height: '100%')을 기준으로 자신의 위치를 상대적으로 계산합니다.
 * - 사용자의 제스처 속도를 계산에 포함하여 실제 스마트폰 앱처럼 자연스러운 반응성을 제공합니다.
 */
export const BottomDrawer = ({
  children,
  snapPoints,
  initialIndex = 1,
}: BottomDrawerProps) => {
  // 기기별 상단 노치/하단 홈바 영역 정보를 가져옵니다.
  const insets = useSafeAreaInsets();

  // 컨테이너의 실제 전체 높이를 저장하는 Ref (측정 후 좌표 계산에 사용됨)
  const containerHeight = useRef(0);

  // 실제 화면상에서 위아래로 움직이는 'Y축 이동값'입니다. (Animated 상탯값)
  const translateY = useRef(
    new Animated.Value(DRAWER_LOGIC.OFFSCREEN_INITIAL_Y),
  ).current;

  // 드래그가 끝나고 정착했을 때의 최종 Y 위치를 저장합니다. (다음 드래그의 시작점이 됨)
  const lastTranslateY = useRef(0);

  /**
   * [getPixelSnaps]
   * 비율(0~1)로 된 스냅 포인트들을 화면상의 실제 픽셀 좌표(px)로 변환합니다.
   * - 0번 인덱스: 항상 화면 최상단(안전 영역)에 맞춥니다.
   * - 마지막 인덱스: 항상 화면 최하단(핸들만 보이기)에 맞춥니다.
   * - 나머지: 설정된 비율대로 계산합니다.
   */
  const getPixelSnaps = () =>
    snapPoints.map((p, i) => {
      // 1단계: 최상단 스냅 (Safe Area 상단 위치)
      if (i === 0) return insets.top;

      // 2단계: 최하단 스냅 (전체 높이에서 핸들 높이만 뺀 위치)
      if (i === snapPoints.length - 1) {
        return containerHeight.current - DRAWER_LOGIC.MIN_VISIBLE_HANDLE_HEIGHT;
      }

      // 3단계: 중간 스냅 (사용자가 정의한 비율 적용)
      return containerHeight.current * p;
    });

  /**
   * [panResponder]
   * 사용자의 모든 터치 이벤트를 감지하고 처리하는 핵심 엔진입니다.
   */
  const panResponder = useRef(
    PanResponder.create({
      // 드래그를 가로챌 것인지 결정: 어느 정도 움직였을 때 드래그로 판단할지 설정
      onMoveShouldSetPanResponder: (_, { dy }) =>
        Math.abs(dy) > DRAWER_LOGIC.DRAG_START_THRESHOLD,

      // 사용자가 드래그 중인 상태 (실시간 호출)
      onPanResponderMove: (_, { dy }) => {
        const snaps = getPixelSnaps();
        // '이전 정착지 위치' + '현재 손가락이 움직인 거리(dy)'
        const currentPos = lastTranslateY.current + dy;

        // [범위 제한] 너무 위로 올라가거나 화면 밖으로 완전히 나가지 않게 범위를 제한합니다.
        const clampedY = Math.max(
          snaps[0],
          Math.min(snaps[snaps.length - 1], currentPos),
        );
        translateY.setValue(clampedY);
      },

      // 사용자가 드래그를 마치고 손을 뗀 상태
      onPanResponderRelease: (_, { dy, vy }) => {
        const snaps = getPixelSnaps();

        /**
         * [이동지점 예측] 프리미엄 반응성의 핵심 로직
         * 단순히 현재 위치만 보는 게 아니라, '손을 뗄 때의 속도(vy)'를 계산에 넣습니다.
         * 이렇게 하면 조금만 튕겨도 "아, 사용자가 다음 단계로 넘기려나보다"라고 예측하여 부드럽게 넘어갑니다.
         */
        const predictedTarget =
          lastTranslateY.current + dy + vy * DRAWER_LOGIC.FLICK_VELOCITY_WEIGHT;

        // 예측된 목표 지점과 가장 가까운 스냅 지점을 찾습니다.
        const destination = snaps.reduce((prev, curr) =>
          Math.abs(curr - predictedTarget) < Math.abs(prev - predictedTarget)
            ? curr
            : prev,
        );

        /**
         * [애니메이션 실행]
         * 정해진 목적지(destination)까지 부드러운 스프링 애니메이션으로 이동시킵니다.
         */
        Animated.spring(translateY, {
          toValue: destination,
          useNativeDriver: true, // 네이티브 레벨에서 처리하여 끊김 없는 애니메이션 보장
          damping: DRAWER_LOGIC.ANIMATION_SPRING_DAMPING,
        }).start();

        // 다음 번 드래그를 위해 현재 정착한 위치를 기록합니다.
        lastTranslateY.current = destination;
      },
    }),
  ).current;

  return (
    <Animated.View
      onLayout={e => {
        // [onLayout] 뷰가 그려질 때 자신의 정확한 높이를 측정합니다.

        // 이미 측정이 완료되었다면 다시 수행하지 않습니다.
        if (containerHeight.current > 0) return;

        containerHeight.current = e.nativeEvent.layout.height;
        const snaps = getPixelSnaps();

        // 처음 나타날 때, 설정된 initialIndex 위치로 즉시 이동시킵니다.
        const startPos = snaps[initialIndex];
        translateY.setValue(startPos);
        lastTranslateY.current = startPos;
      }}
      // Animated 이동값(translateY)에 따라 뷰를 수직 이동시킵니다.
      style={[styles.box, { transform: [{ translateY: translateY }] }]}
      // 생성된 PanResponder의 핸들러들을 뷰에 장착합니다.
      {...panResponder.panHandlers}
    >
      {/* 바텀 드로어의 상단 핸들: 시각적으로 드래그 가능하다는 힌트를 줍니다. */}
      <View style={styles.handle} />

      {/* 실제 컴포넌트 내부 내용물들이 들어가는 영역입니다. */}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%', // 부모 레이아웃 전체를 가용 범위로 사용합니다.
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 1000, // 다른 UI보다 위에 보이도록 설정
    elevation: 10, // 안드로이드의 레이어 우선순위 및 그림자
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 12,
  },
  content: {
    flex: 1,
  },
});
