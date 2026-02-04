import { useLayoutEffect, ReactNode } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '@/constants/theme';

interface AppSafeAreaViewProps extends ViewProps {
  children: ReactNode;
  edges?: Edge[];
  title?: string;
  headerShown?: boolean;
  headerRight?: () => ReactNode;
  headerLeft?: () => ReactNode;
}

const BASE_EDGES: Edge[] = ['left', 'right'];

/**
 * 헤더 중복 여백 방지를 위해 'top'이 제외된 기본 SafeAreaView
 * + 내비게이션 헤더 옵션을 프롭으로 직접 제어 가능
 */
export const AppSafeAreaView = ({
  children,
  style,
  edges = ['bottom'],
  title = '',
  headerShown = true,
  headerRight,
  headerLeft,
  ...props
}: AppSafeAreaViewProps) => {
  const navigation = useNavigation();
  const combinedEdges = Array.from(new Set([...BASE_EDGES, ...edges]));

  useLayoutEffect(() => {
    const flattenedStyle = StyleSheet.flatten(style);
    const bgColor = flattenedStyle?.backgroundColor || COLORS.white;

    navigation.setOptions({
      headerShown,
      title,
      headerRight,
      headerLeft,
      headerStyle: {
        backgroundColor: bgColor,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: { fontWeight: '600' },
      cardStyle: { backgroundColor: bgColor },
    });
  }, [navigation, title, headerShown, headerRight, headerLeft, style]);

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
