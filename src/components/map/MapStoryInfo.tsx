import { View, StyleSheet, Image, Text } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { StoryBriefInfo } from '@/components/stories/StoryBriefInfo';
import type { Story } from '@/types';

interface MapStoryInfoProps {
  story: Story;
}

export const MapStoryInfo = ({ story }: MapStoryInfoProps) => {
  return (
    <View style={styles.storyDrawerContent}>
      <StoryBriefInfo story={story} />

      {story.thumbnailUrl && (
        <Image
          source={{ uri: story.thumbnailUrl }}
          style={styles.drawerImage}
          resizeMode="cover"
        />
      )}

      {story.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>{story.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  storyDrawerContent: {
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
