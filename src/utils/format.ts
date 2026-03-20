/**
 * 멤버 등의 객체 배열에서 특정 키의 값들을 ' · ' (가운데 점)으로 연결하여 문자열로 반환합니다.
 * 주로 여러 명의 참여자 이름을 표기할 때 사용됩니다.
 * 
 * @param items 값을 추출할 객체 배열
 * @param key 추출할 객체의 키 이름 (예: 'name', 'title')
 * @param fallbackValue 배열이 유효하지 않거나 비어있을 경우 반환할 기본값
 * @returns '아이템1 · 아이템2 · 아이템3' 형태의 문자열
 */
export const joinValuesWithDot = <T, K extends keyof T>(
  items: T[] | undefined | null,
  key: K,
  fallbackValue: string = '',
): string => {
  if (!items || items.length === 0) {
    return fallbackValue;
  }
  
  return items
    .map(item => String(item[key]))
    .filter(Boolean) // 빈 문자열이나 undefined 등은 제외
    .join(' · ');
};
