import dayjs from 'dayjs';

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다.
 */
export const getTodayDateString = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * 시작일로부터 오늘까지의 일수를 계산합니다. (D+X)
 * @param startDate YYYY-MM-DD 형식의 문자열
 * @returns 계산된 일수
 */
export const calculateDDay = (startDate: string): number => {
  if (!startDate) return 0;

  const start = dayjs(startDate).startOf('day');
  const today = dayjs().startOf('day');

  // 날짜 차이에 1을 더함 (오늘이 시작일이면 1일차)
  return today.diff(start, 'day') + 1;
};

/**
 * 날짜 형식을 포맷팅합니다. (예: 2022.08.15)
 * @param dateString YYYY-MM-DD 형식의 문자열
 * @param format 포맷팅 형식 (기본값: YYYY.MM.DD)
 * @returns 포맷팅된 문자열
 */
export const formatDate = (
  dateString: string,
  format: string = 'YYYY.MM.DD',
): string => {
  if (!dateString) return '';
  return dayjs(dateString).format(format);
};
