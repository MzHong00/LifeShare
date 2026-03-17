import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { APP_COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

export const MapEmptyState = () => {
  return (
    <View style={styles.emptyDrawerContent}>
      <View style={styles.emptyInfoCard}>
        <MapPin size={24} color={APP_COLORS.textTertiary} />
        <Text style={styles.emptyInfoText}>
          위의 멤버 아이콘이나 경로를 눌러{'\n'}상세 정보를 확인해보세요
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyDrawerContent: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyInfoCard: {
    alignItems: 'center',
    gap: 12,
  },
  emptyInfoText: {
    ...TYPOGRAPHY.body2,
    color: APP_COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
