import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Camera, Calendar, Plus, Trash2, MapPin } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { modalActions } from '@/stores/useModalStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { getTodayDateString, formatDate } from '@/utils/date';

type StoryEditRouteProp = RouteProp<{ params: { storyId?: string } }, 'params'>;

const StoryEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<StoryEditRouteProp>();
  const storyId = route.params?.storyId;
  const isEditMode = !!storyId;

  const { showModal } = modalActions;
  const { stories } = useStoryStore();
  const { addStory, updateStory, deleteStory, setSelectedStoryId } =
    storyActions;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    undefined,
  );

  // 데이터 불러오기 (수정 모드일 때만)
  useEffect(() => {
    if (isEditMode && storyId) {
      const story = stories.find(s => s.id === storyId);
      if (story) {
        setTitle(story.title);
        setDescription(story.description || '');
        setDate(formatDate(story.date));
        setThumbnailUrl(story.thumbnailUrl);
      } else {
        showModal({
          type: 'alert',
          title: '에러',
          message: '스토리 정보를 불러올 수 없습니다.',
          onConfirm: () => navigation.goBack(),
        });
      }
    }
  }, [isEditMode, storyId, stories, navigation, showModal]);

  const handleSave = () => {
    if (!title.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '스토리의 제목을 입력해주세요.',
      });
      return;
    }

    if (isEditMode && storyId) {
      updateStory(storyId, { title, description, thumbnailUrl });
      showModal({
        type: 'alert',
        title: '성공',
        message: '스토리가 수정되었습니다.',
        onConfirm: () => navigation.goBack(),
      });
    } else {
      addStory({
        title,
        description,
        thumbnailUrl,
        date: new Date().toISOString(),
        path: [], // 신규 생성 시에는 경로 없음
      });
      showModal({
        type: 'alert',
        title: '성공',
        message: '새로운 스토리가 기록되었습니다.',
        onConfirm: () => navigation.goBack(),
      });
    }
  };

  const handleDelete = () => {
    if (!storyId) return;

    showModal({
      type: 'confirm',
      title: '스토리 삭제',
      message:
        '정말로 이 스토리를 삭제하시겠습니까? 삭제된 스토리는 복구할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => {
        deleteStory(storyId);
        setSelectedStoryId(null);
        showModal({
          type: 'alert',
          title: '완료',
          message: '스토리가 삭제되었습니다.',
          onConfirm: () => navigation.goBack(),
        });
      },
    });
  };

  const handleSelectImage = useCallback(() => {
    showModal({
      type: 'choice',
      title: '사진 추가',
      message: '사진을 가져올 방법을 선택해주세요.',
      confirmText: '카메라',
      destructiveText: '갤러리',
      cancelText: '취소',
      onConfirm: () => {
        launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
          if (response.assets && response.assets[0].uri) {
            setThumbnailUrl(response.assets[0].uri);
          }
        });
      },
      onDestructive: () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
          if (response.assets && response.assets[0].uri) {
            setThumbnailUrl(response.assets[0].uri);
          }
        });
      },
    });
  }, [showModal]);

  // 네비게이션 헤더 제목 설정
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? '스토리 수정' : '새 스토리 기록',
    });
  }, [isEditMode, navigation]);

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!isEditMode && stories.length <= 3 && (
          <View style={styles.infoBanner}>
            <View style={styles.infoIconWrapper}>
              <MapPin size={16} color={COLORS.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>경로와 함께 기록하고 싶나요?</Text>
              <Text style={styles.infoDescription}>
                이동 경로가 포함된 스토리는 '위치' 탭의 기록하기 버튼을 통해
                만들 수 있어요.
              </Text>
            </View>
          </View>
        )}

        {/* Photo Upload Placeholder */}
        <TouchableOpacity
          style={styles.photoContainer}
          onPress={handleSelectImage}
        >
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.selectedImage}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color={COLORS.textTertiary} />
              <Text style={styles.photoText}>사진 추가하기</Text>
            </View>
          )}
          <View style={styles.addIconBadge}>
            <Plus size={16} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="어떤 스토리인가요?"
              placeholderTextColor={COLORS.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>내용</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="그날의 이야기를 들려주세요 (선택)"
              placeholderTextColor={COLORS.textTertiary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.metaRow}>
            <TouchableOpacity style={styles.metaItem}>
              <Calendar size={20} color={COLORS.primary} strokeWidth={2.5} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>날짜</Text>
                <Text style={styles.metaValue}>{date}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        {isEditMode && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditMode ? '수정하기' : '기록하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.layout,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 1.2,
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.skeleton,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedImage: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: COLORS.background,
  },
  photoText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  formContainer: {
    gap: SPACING.xl,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight + '40', // 25% 투명도
    padding: 16,
    borderRadius: 16,
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    marginBottom: 20,
  },
  infoIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  metaTextContainer: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.skeleton,
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error + '10',
    paddingHorizontal: 20,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
  },
});

export default StoryEditScreen;
