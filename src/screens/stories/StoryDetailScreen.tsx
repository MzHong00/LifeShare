import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Map, Edit3, Trash2 } from 'lucide-react-native';

import type { Story } from '@/types';
import { NAV_ROUTES } from '@/constants/navigation';
import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { modalActions } from '@/stores/useModalStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { StoryBriefInfo } from '@/components/stories/StoryBriefInfo';
import { HeaderButton } from '@/components/common/HeaderButton';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { AppPressable } from '@/components/common/AppPressable';

type StoryDetailRouteProp = RouteProp<
  { params: { storyId: string } },
  'params'
>;

const StoryDetailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<StoryDetailRouteProp>();
  const { storyId } = route.params;

  const { stories } = useStoryStore();
  const { setSelectedStoryId, deleteStory } = storyActions;
  const { showModal } = modalActions;
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    const found = stories.find(s => s.id === storyId);
    if (found) {
      setStory(found);
    }
  }, [storyId, stories]);

  const handleShowOnMap = useCallback(() => {
    setSelectedStoryId(story?.id ?? null);
    navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME, {
      screen: NAV_ROUTES.LOCATION.NAME,
    });
  }, [story?.id, setSelectedStoryId, navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate(NAV_ROUTES.STORY_EDIT.NAME, { storyId: story?.id });
  }, [story?.id, navigation]);

  const handleDelete = useCallback(() => {
    if (!story?.id) return;

    showModal({
      type: 'confirm',
      title: '스토리 삭제',
      message:
        '정말로 이 스토리를 삭제하시겠습니까? 삭제된 스토리는 복구할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => {
        deleteStory(story.id);
        setSelectedStoryId(null);
        showModal({
          type: 'alert',
          title: '완료',
          message: '스토리가 삭제되었습니다.',
          onConfirm: () => navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME),
        });
      },
    });
  }, [story?.id, deleteStory, setSelectedStoryId, showModal, navigation]);

  const renderHeaderRight = useCallback(
    () => (
      <View style={styles.headerRight}>
        <HeaderButton
          onPress={handleDelete}
          icon={<Trash2 size={20} color={APP_COLORS.error} />}
        />
        <HeaderButton
          onPress={handleEdit}
          icon={<Edit3 size={20} color={APP_COLORS.textPrimary} />}
        />
      </View>
    ),
    [handleEdit, handleDelete],
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

          <AppPressable
            style={styles.mapActionCard}
            onPress={handleShowOnMap}
          >
            <View style={styles.mapActionIcon}>
              <Map size={24} color={THEME_COLORS.white} />
            </View>
            <View style={styles.mapActionTextContent}>
              <Text style={styles.mapActionTitle}>지도에서 경로 보기</Text>
              <Text style={styles.mapActionSubtitle}>
                그날 우리의 이동 동선을 확인해보세요
              </Text>
            </View>
          </AppPressable>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
  content: {
    padding: SPACING.layout,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginRight: SPACING.sm,
  },
  descriptionSection: {
    backgroundColor: APP_COLORS.bgGray,
    padding: SPACING.lg,
    borderRadius: 16,
    marginVertical: SPACING.xxl,
  },
  detailImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    marginTop: SPACING.lg,
    backgroundColor: APP_COLORS.bgGray,
  },
  descriptionText: {
    ...TYPOGRAPHY.body1,
    color: APP_COLORS.textSecondary,
  },
  mapActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primary,
    padding: SPACING.layout,
    borderRadius: 20,
    gap: SPACING.lg,
    elevation: 4,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: SPACING.sm,
  },
  mapActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: APP_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActionTextContent: {
    flex: 1,
  },
  mapActionTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: THEME_COLORS.white,
    marginBottom: 2,
  },
  mapActionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default StoryDetailScreen;
