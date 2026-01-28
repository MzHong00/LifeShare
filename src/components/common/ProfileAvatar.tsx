
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';

interface ProfileAvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const ProfileAvatar = ({
  uri,
  name,
  size = 48,
  style,
}: ProfileAvatarProps) => {
  const initials = name ? name.substring(0, 2) : '?';

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    !uri && { backgroundColor: COLORS.primary + '15' },
    style,
  ];

  if (uri) {
    return (
      <View style={containerStyle}>
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
            fontSize: size * 0.35,
            color: COLORS.primary,
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
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
  },
});
