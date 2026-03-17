import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
  PATH_COLORS,
} from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { modalActions } from '@/stores/useModalStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { getTodayDateString, formatDate } from '@/utils/date';
import type { LocationPoint } from '@/types';

// Sub-components
import { StoryImageSelector } from '@/components/stories/StoryImageSelector';
import { StoryPathMethodSelector } from '@/components/stories/StoryPathMethodSelector';
import { StoryDateSelector } from '@/components/stories/StoryDateSelector';
import { StoryActionButtons } from '@/components/stories/StoryActionButtons';

// 타입 정의
type StoryEditRouteProp = RouteProp<{ params: { storyId?: string } }, 'params'>;

/**
 * 스토리 작성 및 수정 화면
 */
const StoryEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<StoryEditRouteProp>();
  const storyId = route.params?.storyId;
  const isEditMode = !!storyId;

  const { showModal } = modalActions;
  const { stories } = useStoryStore(); // 전역 스토리 목록
  const { addStory, updateStory } = storyActions; // 스토리 조작 액션

  // 수정 모드일 경우 기존 데이터 로드
  const existingStory = useMemo(
    () => (isEditMode ? stories.find(s => s.id === storyId) : null),
    [isEditMode, storyId, stories],
  );

  const [title, setTitle] = useState(existingStory?.title || '');
  const [description, setDescription] = useState(
    existingStory?.description || '',
  );
  const [date, setDate] = useState(
    existingStory
      ? formatDate(existingStory.date, 'YYYY-MM-DD')
      : getTodayDateString(),
  );
  const [path, setPath] = useState<LocationPoint[]>(existingStory?.path || []);
  const [pathColor] = useState<string>(() => {
    if (existingStory?.pathColor) return existingStory.pathColor;
    return PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
  });
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    existingStory?.thumbnailUrl,
  );

  // 잘못된 접근 처리 (수정 모드인데 데이터가 없는 경우)
  useEffect(() => {
    if (isEditMode && !existingStory) {
      showModal({
        type: 'alert',
        title: '에러',
        message: '스토리 정보를 불러올 수 없습니다.',
        onConfirm: () => navigation.goBack(),
      });
    }
  }, [isEditMode, existingStory, navigation, showModal]);

  /**
   * 저장 (기록하기/수정하기) 핸들러
   */
  const handleSave = () => {
    if (!title.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '스토리의 제목을 입력해주세요.',
      });
      return;
    }

    const storyData = {
      title: title.trim(),
      description: description.trim(),
      thumbnailUrl,
      path,
      pathColor,
    };

    if (isEditMode && storyId) {
      updateStory(storyId, storyData);
    } else {
      addStory({
        ...storyData,
        date: new Date(date).toISOString(),
      });
    }

    showModal({
      type: 'alert',
      title: '성공',
      message: isEditMode
        ? '스토리가 수정되었습니다.'
        : '새로운 스토리가 기록되었습니다.',
      onConfirm: () => navigation.goBack(),
    });
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StoryImageSelector
          thumbnailUrl={thumbnailUrl}
          onImageSelected={setThumbnailUrl}
        />

        <View style={styles.formContainer}>
          {/* 경로 설정 (직접/실시간) */}
          <StoryPathMethodSelector
            path={path}
            pathColor={pathColor}
            onSelectPath={setPath}
            navigation={navigation}
          />

          {/* 제목 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="어떤 스토리인가요?"
              placeholderTextColor={APP_COLORS.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 내용 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>내용</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="그날의 이야기를 들려주세요 (선택)"
              placeholderTextColor={APP_COLORS.textTertiary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          {/* 날짜 선택 */}
          <StoryDateSelector date={date} onSelectDate={setDate} />
        </View>
      </ScrollView>

      {/* 하단 저장 버튼 */}
      <StoryActionButtons isEditMode={isEditMode} onSave={handleSave} />
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
  scrollContent: {
    padding: SPACING.layout,
  },
  formContainer: {
    gap: SPACING.xl,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: APP_COLORS.bgGray,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: APP_COLORS.textPrimary,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
});

export default StoryEditScreen;
