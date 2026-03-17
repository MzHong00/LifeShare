// 이미지 URL(또는 ID)을 기반으로 일관된 랜덤 높이를 결정하는 유틸 함수
export const getDynamicImageHeight = (id: string, thumbnailUrl?: string) => {
  // 같은 사진(URL)이라면 동일한 높이를, 사진이 없다면 ID를 기준으로 해시 생성
  const seedString = thumbnailUrl || id || '';
  const hash = seedString
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const heights = [180, 220, 260, 200, 240];
  return heights[hash % heights.length];
};
