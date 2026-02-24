import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Modal,
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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [path, setPath] = useState<LocationPoint[]>([]);
  const [pathColor, setPathColor] = useState<string>('#3182F6');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();

  // 데이터 불러오기 (수정 모드일 때만)
  useEffect(() => {
    if (!isEditMode || !storyId) {
      // 새 스토리 작성 시 랜덤 색상 지정
      const randomColor =
        PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
      setPathColor(randomColor);
      return;
    }

    const story = stories.find(s => s.id === storyId);
    if (!story)
      return showModal({
        type: 'alert',
        title: '에러',
        message: '스토리 정보를 불러올 수 없습니다.',
        onConfirm: () => navigation.goBack(),
      });

    setTitle(story.title);
    setDescription(story.description || '');
    setDate(formatDate(story.date, 'YYYY-MM-DD'));
    setPath(story.path || []);
    setPathColor(story.pathColor || '#3182F6');
    setThumbnailUrl(story.thumbnailUrl);
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
      updateStory(storyId, {
        title,
        description,
        thumbnailUrl,
        path,
        pathColor,
      });
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
        date: new Date(date).toISOString(),
        path,
        pathColor,
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
            style={[styles.modalButton, { backgroundColor: COLORS.background }]}
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
              onPress={() => setIsCalendarVisible(true)}
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
              onPress={() => setIsMapVisible(true)}
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

      {/* Date Picker Modal */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCalendarVisible(false)}
        >
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>날짜 선택</Text>
              <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              current={date}
              onDayPress={day => {
                setDate(day.dateString);
                setIsCalendarVisible(false);
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
        </TouchableOpacity>
      </Modal>

      {/* Map Picker Modal */}
      <Modal
        visible={isMapVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMapVisible(false)}
      >
        <StoryMapPicker
          path={path}
          pathColor={pathColor}
          onSelect={setPath}
          onClose={() => setIsMapVisible(false)}
        />
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: '100%',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 10 },
    }),
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
