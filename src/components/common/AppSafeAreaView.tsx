import type { ReactNode } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface AppSafeAreaViewProps extends ViewProps {
  children: ReactNode;
  edges?: Edge[]; // 추가할 엣지 (예: ['top', 'bottom'])
}

// 좌우(L/R)는 기본 포함 (가로모드 대응)
const BASE_EDGES: Edge[] = ['left', 'right'];

/**
 * 헤더 중복 여백 방지를 위해 'top'이 제외된 기본 SafeAreaView
 * - 기본: left, right 적용
 * - 추가: edges 프롭으로 top, bottom 등 추가 가능
 */
export const AppSafeAreaView = ({
  children,
  style,
  edges = [],
  ...props
}: AppSafeAreaViewProps) => {
  // 기본 L/R 엣지에 전달받은 엣지를 합쳐서 중복 제거 (left, right)
  const combinedEdges = Array.from(new Set([...BASE_EDGES, ...edges]));

  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={combinedEdges}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
