import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다.
 */
export const getTodayDateString = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * 특정 날짜에 일수를 더하거나 뺀 날짜를 YYYY-MM-DD 형식으로 반환합니다.
 */
export const getDateWithOffset = (
  days: number,
  baseDate: string = getTodayDateString(),
): string => {
  return dayjs(baseDate).add(days, 'day').format('YYYY-MM-DD');
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
  dateString: string | null | undefined,
  format: string = 'YYYY.MM.DD',
): string => {
  if (!dateString) return '';
  return dayjs(dateString).format(format);
};

/**
 * 오늘을 기준으로 한 상대적 날짜 레이블을 반환합니다.
 * @param dateStr YYYY-MM-DD 형식의 문자열
 * @returns '오늘까지', '내일까지', 'X일 지연' 등의 문자열
 */
export const getRelativeDateLabel = (dateStr: string): string => {
  if (!dateStr) return '';

  const today = dayjs().startOf('day');
  const target = dayjs(dateStr).startOf('day');
  const diffDays = target.diff(today, 'day');

  if (diffDays === 0) return '오늘까지';
  if (diffDays === 1) return '내일까지';
  if (diffDays === -1) return '어제까지';
  if (diffDays < 0) return `${Math.abs(diffDays)}일 지연`;

  return dayjs(dateStr).format('M/D') + '까지';
};

/**
 * 기준 날짜가 오늘보다 이전인지 확인합니다. (시간 제외)
 */
export const isPastDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return dayjs(dateStr).isBefore(dayjs(), 'day');
};

/**
 * 두 날짜 사이의 모든 날짜 리스트를 반환합니다.
 */
export const getDatesInRange = (
  startOffset: number,
  endOffset: number,
): { date: string; day: string; dateNum: number }[] => {
  const list = [];
  for (let i = startOffset; i <= endOffset; i++) {
    const d = dayjs().add(i, 'day');
    list.push({
      date: d.format('YYYY-MM-DD'),
      day: d.format('ddd'),
      dateNum: d.date(),
    });
  }
  return list;
};

/**
 * 현재 시간을 HH:mm:ss 형식으로 반환합니다.
 */
export const getCurrentTimeString = (): string => {
  return dayjs().format('HH:mm:ss');
};

/**
 * 채팅용 시간 포맷을 반환합니다. (예: 오후 2:33)
 */
export const formatChatTime = (date: string | Date = new Date()): string => {
  return dayjs(date)
    .format('A h:mm')
    .replace('AM', '오전')
    .replace('PM', '오후');
};

/**
 * 현재 ISO 타임스탬프를 반환합니다.
 */
export const getISOTimestamp = (): string => {
  return dayjs().toISOString();
};

/**
 * 날짜 범위를 위해 중간 날짜들을 가져옵니다.
 */
export const getIntermediateDates = (
  startDate: string,
  endDate: string,
): string[] => {
  const dates = [];
  let current = dayjs(startDate).add(1, 'day');
  const last = dayjs(endDate);

  while (current.isBefore(last, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
};
