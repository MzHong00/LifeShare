
import { View, StyleSheet, Image, Text } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { MemoryBriefInfo } from '@/components/memories/MemoryBriefInfo';
import type { Memory } from '@/types';

interface MapMemoryInfoProps {
  memory: Memory;
}

export const MapMemoryInfo = ({ memory }: MapMemoryInfoProps) => {
  return (
    <View style={styles.memoryDrawerContent}>
      <MemoryBriefInfo memory={memory} />

      {memory.thumbnailUrl && (
        <Image
          source={{ uri: memory.thumbnailUrl }}
          style={styles.drawerImage}
          resizeMode="cover"
        />
      )}

      {memory.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>{memory.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  memoryDrawerContent: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.md,
  },
  drawerImage: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: 20,
    marginTop: 8,
    backgroundColor: COLORS.background,
  },
  descriptionSection: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
});
