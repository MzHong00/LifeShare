import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Search, Plus } from 'lucide-react-native';

import { NAV_ROUTES } from '@/constants/navigation';
import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { useStoryStore } from '@/stores/useStoryStore';
import { getDynamicImageHeight } from '@/utils/image';
import { MasonryList } from '@/components/common/MasonryList';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { StoryItem } from '@/components/stories/StoryItem';
import { AppPressable } from '@/components/common/AppPressable';

const { width } = Dimensions.get('window');
const columnWidth = (width - SPACING.layout * 2 - SPACING.md) / 2;

const StoriesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { stories } = useStoryStore();
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStory = useCallback(() => {
    navigation.navigate(NAV_ROUTES.STORY_EDIT.NAME);
  }, [navigation]);

  const handleStoryPress = useCallback(
    (id: string) => {
      navigation.navigate(NAV_ROUTES.STORY_DETAIL.NAME, { storyId: id });
    },
    [navigation],
  );

  const filteredStories = useMemo(() => {
    return stories.filter(story =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [stories, searchQuery]);

  return (
    <AppSafeAreaView
      style={styles.container}
      headerShown={false}
      edges={['top']}
    >
      {/* 최상단 검색 & 액션 바 */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={APP_COLORS.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="추억을 검색해보세요"
            placeholderTextColor={APP_COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
        <AppPressable style={styles.rightButton} onPress={handleAddStory}>
          <Plus size={24} color={APP_COLORS.primary} strokeWidth={2.5} />
        </AppPressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MasonryList
          data={filteredStories}
          numColumns={2}
          getItemHeight={story => getDynamicImageHeight(story.id, story.thumbnailUrl) + 60}
          columnStyle={styles.column}
          containerStyle={styles.masonryContainer}
        >
          {item => <StoryItem item={item} onPress={handleStoryPress} />}
        </MasonryList>

        {filteredStories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과나 스토리가 없습니다.</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={APP_COLORS.primary} />
          </View>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.bgWhite,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.grey100,
    borderRadius: 16,
    paddingHorizontal: SPACING.lg,
    height: 48,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: APP_COLORS.textPrimary,
    paddingVertical: 0,
  },
  rightButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primaryLight,
    borderRadius: 24,
  },
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.xs,
    paddingBottom: 100,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    width: columnWidth,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: APP_COLORS.textTertiary,
  },
  loaderContainer: {
    paddingVertical: SPACING.layout,
    alignItems: 'center',
  },
});

export default StoriesScreen;
