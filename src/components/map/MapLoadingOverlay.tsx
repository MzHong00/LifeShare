import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { APP_COLORS, TYPOGRAPHY } from '@/constants/theme';

export const MapLoadingOverlay = () => {
  return (
    <View style={styles.mapLoadingContainer}>
      <ActivityIndicator size="large" color={APP_COLORS.primary} />
      <Text style={styles.loadingText}>위치 정보를 불러오는 중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mapLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.skeleton,
  },
  loadingText: {
    marginTop: 12,
    ...TYPOGRAPHY.body2,
  },
});
