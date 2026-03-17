import React from 'react';
import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useMasonry } from '@/hooks/useMasonry';

interface MasonryListProps<T> {
  data: T[];
  numColumns?: number;
  getItemHeight: (item: T) => number;
  containerStyle?: StyleProp<ViewStyle>;
  columnStyle?: StyleProp<ViewStyle>;
  keyExtractor?: (item: T, index: number) => string;
  children: (item: T, index: number) => ReactNode;
}

/**
 * Masonry 레이아웃 공통 컴포넌트
 * @param data 렌더링할 데이터 배열
 * @param numColumns 컬럼 개수 (기본 2)
 * @param getItemHeight 아이템별 높이를 계산하는 함수
 * @param children 각 아이템을 렌더링하는 함수 (render props)
 */
export const MasonryList = <T,>({
  data,
  numColumns = 2,
  getItemHeight,
  containerStyle,
  columnStyle,
  keyExtractor,
  children,
}: MasonryListProps<T>) => {
  const columns = useMasonry({ data, numColumns, getItemHeight });

  return (
    <View style={[styles.container, containerStyle]}>
      {columns.map((columnData, colIndex) => (
        <View
          key={`masonry-col-${colIndex}`}
          style={[styles.column, columnStyle]}
        >
          {columnData.map((item, itemIndex) => {
            const key = keyExtractor
              ? keyExtractor(item, itemIndex)
              : (item as { id?: string }).id || `masonry-item-${colIndex}-${itemIndex}`;
            return (
              <React.Fragment key={key}>
                {children(item, itemIndex)}
              </React.Fragment>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
});
