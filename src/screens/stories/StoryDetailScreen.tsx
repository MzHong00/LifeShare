import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Map, Edit3 } from 'lucide-react-native';

import { COLORS, SPACING } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { StoryBriefInfo } from '@/components/stories/StoryBriefInfo';
import { HeaderButton } from '@/components/common/HeaderButton';

type StoryDetailRouteProp = RouteProp<
  { params: { storyId: string } },
  'params'
>;

const StoryDetailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<StoryDetailRouteProp>();
  const { storyId } = route.params;

  const { stories } = useStoryStore();
  const { setSelectedStoryId } = storyActions;
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    const found = stories.find(s => s.id === storyId);
    if (found) {
      setStory(found);
    }
  }, [storyId, stories]);

  const handleShowOnMap = useCallback(() => {
    setSelectedStoryId(story?.id);
    navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME, {
      screen: NAV_ROUTES.LOCATION.NAME,
    });
  }, [story?.id, setSelectedStoryId, navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate(NAV_ROUTES.STORY_EDIT.NAME, { storyId: story?.id });
  }, [story?.id, navigation]);

  const renderHeaderRight = useCallback(
    () => (
      <HeaderButton
        onPress={handleEdit}
        icon={<Edit3 size={20} color={COLORS.textPrimary} />}
      />
    ),
    [handleEdit],
  );

  if (!story) return null;

  return (
    <AppSafeAreaView style={styles.container} headerRight={renderHeaderRight}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <StoryBriefInfo story={story} showDecorateBtn={false} />

          {story.thumbnailUrl && (
            <Image
              source={{ uri: story.thumbnailUrl }}
              style={styles.detailImage}
              resizeMode="cover"
            />
          )}

          {story.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionText}>{story.description}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.mapActionCard}
            onPress={handleShowOnMap}
          >
            <View style={styles.mapActionIcon}>
              <Map size={24} color={COLORS.white} />
            </View>
            <View style={styles.mapActionTextContent}>
              <Text style={styles.mapActionTitle}>지도에서 경로 보기</Text>
              <Text style={styles.mapActionSubtitle}>
                그날 우리의 이동 동선을 확인해보세요
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.layout,
  },
  descriptionSection: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    marginVertical: 24,
  },
  detailImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    marginTop: 16,
    backgroundColor: COLORS.background,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  mapActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 20,
    gap: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: 8,
  },
  mapActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActionTextContent: {
    flex: 1,
  },
  mapActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  mapActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default StoryDetailScreen;
