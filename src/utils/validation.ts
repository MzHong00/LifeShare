/**
 * 워크스페이스(라이프룸) 이름 유효성 검사
 */
export const validateWorkspaceName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return '이름을 입력해주세요.';
  }
  if (name.length > 10) {
    return '이름은 10자 이내로 입력해주세요.';
  }
  return null;
};

/**
 * 날짜 형식 유효성 검사 (YYYY-MM-DD)
 */
export const validateDateFormat = (date: string): string | null => {
  if (!date) return null; // 필수값이 아닐 경우를 대비해 null 반환

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).';
  }

  // 실제 존재하는 날짜인지 여부는 dayjs 등에서 처리 가능하지만
  // 여기서는 형식 위주로 검사합니다.
  return null;
};
