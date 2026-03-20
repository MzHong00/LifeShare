import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronRight, MapPin } from 'lucide-react-native';

import { APP_COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useStoryStore } from '@/stores/useStoryStore';
import { formatDate } from '@/utils/date';
import { Card } from '@/components/common/Card';
import { AppPressable } from '@/components/common/AppPressable';

export const RecentStories = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { stories } = useStoryStore();

  const recentStories = stories.slice(0, 5);

  if (recentStories.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>최근 스토리</Text>
        <AppPressable
          style={styles.moreBtn}
          onPress={() => navigation.navigate(NAV_ROUTES.STORIES.NAME)}
        >
          <Text style={styles.moreText}>더보기</Text>
          <ChevronRight size={14} color={APP_COLORS.textSecondary} />
        </AppPressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentStories.map(story => (
          <AppPressable
            key={story.id}
            style={styles.storyWrapper}
            onPress={() =>
              navigation.navigate(NAV_ROUTES.STORY_DETAIL.NAME, {
                storyId: story.id,
              })
            }
          >
            <Card style={styles.storyCard}>
              <View
                style={[
                  styles.storyImagePlaceholder,
                  { backgroundColor: story.pathColor + '20' },
                ]}
              >
                {story.thumbnailUrl ? (
                  <Image
                    source={{ uri: story.thumbnailUrl }}
                    style={styles.image}
                  />
                ) : (
                  <MapPin size={28} color={story.pathColor} />
                )}
              </View>
              <View style={styles.content}>
                <Text style={styles.storyTitle} numberOfLines={1}>
                  {story.title}
                </Text>
                <Text style={styles.storyDate}>
                  {formatDate(story.date, 'MM/DD')}
                </Text>
              </View>
            </Card>
          </AppPressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.header2,
    fontSize: 17,
    color: APP_COLORS.textPrimary,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    ...TYPOGRAPHY.caption,
    color: APP_COLORS.textSecondary,
    marginRight: 2,
  },
  scrollContent: {
    paddingLeft: SPACING.layout,
    paddingRight: SPACING.layout - 12,
    paddingVertical: 16, // Plenty of room for shadows
  },
  storyWrapper: {
    marginRight: 12,
    width: 140,
  },
  storyCard: {
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  storyImagePlaceholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  storyTitle: {
    ...TYPOGRAPHY.body1,
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: 2,
  },
  storyDate: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: APP_COLORS.textTertiary,
  },
});
