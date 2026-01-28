import React, { useState, useEffect } from 'react';
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
import { Camera, MapPin, Calendar, Plus, Trash2 } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { useModalStore } from '@/stores/useModalStore';
import { useMemoryStore } from '@/stores/useMemoryStore';

type MemoryEditRouteProp = RouteProp<
  { params: { memoryId: string } },
  'params'
>;

const MemoryEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<MemoryEditRouteProp>();
  const { memoryId } = route.params; // 이제 항상 memoryId가 있다고 가정함

  const { showAlert, showChoice } = useModalStore();
  const { memories, updateMemory, deleteMemory, setSelectedMemoryId } =
    useMemoryStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [location] = useState('현재 위치');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    undefined,
  );

  // 데이터 불러오기
  useEffect(() => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      setTitle(memory.title);
      setDescription(memory.description || '');
      setDate(new Date(memory.date).toLocaleDateString());
      setThumbnailUrl(memory.thumbnailUrl);
    } else {
      // 해당 추억을 찾을 수 없는 경우
      showAlert('에러', '추억 정보를 불러올 수 없습니다.', () => {
        navigation.goBack();
      });
    }
  }, [memoryId, memories, navigation, showAlert]);

  const handleSave = () => {
    if (!title.trim()) {
      showAlert('알림', '추억의 제목을 입력해주세요.');
      return;
    }

    updateMemory(memoryId, { title, description, thumbnailUrl });
    showAlert('성공', '추억이 수정되었습니다.', () => {
      navigation.goBack();
    });
  };

  const handleDelete = () => {
    showChoice(
      '추억 삭제',
      '정말로 이 추억을 삭제하시겠습니까? 삭제된 추억은 복구할 수 없습니다.',
      () => {
        deleteMemory(memoryId);
        setSelectedMemoryId(null); // 지도에서 선택 해제
        showAlert('완료', '추억이 삭제되었습니다.', () => {
          navigation.goBack();
        });
      },
      () => {},
      undefined,
      '삭제',
      '취소',
    );
  };
  const handleSelectImage = () => {
    showChoice(
      '사진 추가',
      '사진을 가져올 방법을 선택해주세요.',
      () => {
        // 카메라 선택 시
        launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
          if (response.assets && response.assets[0].uri) {
            setThumbnailUrl(response.assets[0].uri);
          }
        });
      },
      () => {
        // 갤러리 선택 시
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
          if (response.assets && response.assets[0].uri) {
            setThumbnailUrl(response.assets[0].uri);
          }
        });
      },
      undefined,
      '카메라',
      '갤러리',
    );
  };

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
              placeholder="어떤 추억인가요?"
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

            <TouchableOpacity style={styles.metaItem}>
              <MapPin size={20} color={COLORS.primary} strokeWidth={2.5} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>장소</Text>
                <Text style={styles.metaValue}>{location}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color={COLORS.error} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>수정하기</Text>
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

export default MemoryEditScreen;
