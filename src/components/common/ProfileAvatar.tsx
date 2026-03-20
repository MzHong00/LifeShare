import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { APP_COLORS, THEME_COLORS } from '@/constants/theme';

interface ProfileAvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  variant?: 'default' | 'elevated';
  style?: ViewStyle;
}

export const ProfileAvatar = ({
  uri,
  name,
  size = 48,
  variant = 'default',
  style,
}: ProfileAvatarProps) => {
  // 프로필 이미지가 없을 때를 대비한 이니셜 추출 (최대 2글자 반환)
  const initials = name ? name.substring(0, 2) : '?';

  // 'elevated' 변형인지 확인합니다. elevated는 하얀 테두리(패딩)와 그림자가 포함된 스타일입니다.
  const isElevated = variant === 'elevated';

  // elevated 스타일일 경우, 내부 아이콘보다 바깥 컨테이너를 8px 더 크게 설정합니다.
  // 이렇게 하면 프로필 이미지 주변으로 자연스럽게 4px의 하얀색 여백 효과(테두리 느낌)가 만들어집니다.
  const outerSize = isElevated ? size + 8 : size;

  // 다양한 조건(uri 존재 여부, variant 종류)에 맞춰 외부 컨테이너 스타일을 조합합니다.
  const containerStyle = [
    styles.container,
    {
      width: outerSize,
      height: outerSize,
      // 컨테이너가 항상 완벽한 원형을 유지하도록 높이/너비의 절반값을 borderRadius로 설정
      borderRadius: outerSize / 2,
    },
    // elevated 모드일 때만 흰 배경과 그림자 스타일을 추가
    isElevated && styles.elevated,

    // uri 데이터가 없을 때 텍스트(이니셜)를 보여주기 위한 배경색 분기 처리:
    // 1. 기본 스타일: 토스 느낌의 연한 파란색(Primary 컬러 기반 15% 투명도) 배경 사용
    !uri && !isElevated && { backgroundColor: APP_COLORS.primary + '15' },
    // 2. elevated 스타일: 하얀 배경 공간에 텍스트를 배치하기 위해 완전 흰 배경 유지
    !uri && isElevated && { backgroundColor: THEME_COLORS.white },

    // 외부에서 주입받은 커스텀 스타일 병합
    style,
  ];

  if (uri) {
    return (
      <View style={containerStyle}>
        {/* 실제 이미지는 외부 래퍼 크기와 관계없이 주입된 size 유지. overflow 처리가 없더라도 borderRadius로 둥글게 깎음 */}
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text
        style={[
          styles.initials,
          {
            // 컨테이너 크기에 비례하여 다이나믹하게 글씨 크기 설정 (약 35%)
            fontSize: size * 0.35,
            color: APP_COLORS.primary,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // elevated인 경우 그림자가 잘리지 않게 visible로 처리
    overflow: 'visible',
  },
  elevated: {
    backgroundColor: THEME_COLORS.white,
    elevation: 2,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  initials: {
    fontWeight: '700',
  },
});
