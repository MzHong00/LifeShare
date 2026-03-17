import { useMemo } from 'react';

interface UseMasonryProps<T> {
  data: T[];
  numColumns?: number;
  getItemHeight: (item: T) => number;
}

/**
 * 핀터레스트 스타일의 Masonry 레이아웃 데이터 분할을 위한 훅
 * 입력받은 데이터를 지정된 컬럼 수에 맞게 분배하여 균형 잡힌 높이를 유지하게 합니다.
 */
export const useMasonry = <T,>({
  data,
  numColumns = 2,
  getItemHeight,
}: UseMasonryProps<T>) => {
  return useMemo(() => {
    // 지정된 개수만큼 빈 컬럼 배열 생성
    const columns = Array.from({ length: numColumns }, () => [] as T[]);
    // 각 컬럼의 현재 누적 높이 추적
    const columnHeights = new Array(numColumns).fill(0);

    data.forEach(item => {
      const itemHeight = getItemHeight(item);

      // 누적 높이가 가장 낮은 컬럼 인덱스 찾기
      let minHeightColIndex = 0;
      let minHeight = columnHeights[0];

      for (let i = 1; i < numColumns; i++) {
        if (columnHeights[i] < minHeight) {
          minHeight = columnHeights[i];
          minHeightColIndex = i;
        }
      }

      // 가장 낮은 컬럼에 아이템 추가 및 높이 갱신
      columns[minHeightColIndex].push(item);
      columnHeights[minHeightColIndex] += itemHeight;
    });

    return columns;
  }, [data, numColumns, getItemHeight]);
};
