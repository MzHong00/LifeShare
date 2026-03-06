import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  Camera,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  MapPin,
} from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';

import { COLORS, SPACING, TYPOGRAPHY, PATH_COLORS } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { modalActions } from '@/stores/useModalStore';
import { useStoryStore, storyActions } from '@/stores/useStoryStore';
import { getTodayDateString, formatDate } from '@/utils/date';
import StoryMapPicker from '@/components/stories/StoryMapPicker';
import type { LocationPoint } from '@/types';

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

  // 잘못된 접근 처리 (수정 모드인데 스토리가 없는 경우)
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
      type: 'none',
      title: '사진 추가',
      message: '사진을 가져올 방법을 선택해주세요.',
      content: (
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
            onPress={() => {
              modalActions.hideModal();
              launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
                if (response.assets && response.assets[0].uri) {
                  setThumbnailUrl(response.assets[0].uri);
                }
              });
            }}
          >
            <Text style={styles.modalButtonText}>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
            onPress={() => {
              modalActions.hideModal();
              launchImageLibrary(
                { mediaType: 'photo', quality: 0.8 },
                response => {
                  if (response.assets && response.assets[0].uri) {
                    setThumbnailUrl(response.assets[0].uri);
                  }
                },
              );
            }}
          >
            <Text style={styles.modalButtonText}>갤러리</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: COLORS.bgGray }]}
            onPress={() => modalActions.hideModal()}
          >
            <Text
              style={[styles.modalButtonText, { color: COLORS.textSecondary }]}
            >
              취소
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [showModal]);

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
            <TouchableOpacity
              style={styles.metaItem}
              onPress={() => {
                showModal({
                  type: 'none',
                  title: '날짜 선택',
                  content: (
                    <View style={styles.calendarContainer}>
                      <View style={styles.calendarHeader}>
                        <Text style={styles.calendarTitle}>날짜 선택</Text>
                        <TouchableOpacity
                          onPress={() => modalActions.hideModal()}
                        >
                          <Text style={styles.closeText}>닫기</Text>
                        </TouchableOpacity>
                      </View>
                      <Calendar
                        current={date}
                        onDayPress={day => {
                          setDate(day.dateString);
                          modalActions.hideModal();
                        }}
                        markedDates={{
                          [date]: {
                            selected: true,
                            selectedColor: COLORS.primary,
                            selectedTextColor: COLORS.white,
                          },
                        }}
                        theme={{
                          selectedDayBackgroundColor: COLORS.primary,
                          todayTextColor: COLORS.primary,
                          arrowColor: COLORS.primary,
                          dotColor: COLORS.primary,
                        }}
                      />
                    </View>
                  ),
                });
              }}
            >
              <CalendarIcon
                size={20}
                color={COLORS.primary}
                strokeWidth={2.5}
              />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>날짜</Text>
                <Text style={styles.metaValue}>{date}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.metaItem}
              onPress={() => {
                showModal({
                  type: 'full',
                  title: '경로 설정',
                  content: (
                    <StoryMapPicker
                      path={path}
                      pathColor={pathColor}
                      onSelect={setPath}
                      onClose={() => modalActions.hideModal()}
                    />
                  ),
                });
              }}
            >
              <MapPin size={20} color={COLORS.primary} strokeWidth={2.5} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>경로</Text>
                <Text style={styles.metaValue} numberOfLines={1}>
                  {path.length > 0
                    ? `${path.length}개의 지점 선택됨`
                    : '경로 설정'}
                </Text>
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
    backgroundColor: COLORS.bgGray,
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
    backgroundColor: COLORS.bgGray,
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
    backgroundColor: COLORS.bgGray,
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
    backgroundColor: COLORS.bgGray,
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
  modalButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalContent: {
    paddingHorizontal: 20,
    gap: 10,
  },

  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: '100%',
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarTitle: {
    ...TYPOGRAPHY.header2,
    color: COLORS.textPrimary,
  },
  closeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default StoryEditScreen;
