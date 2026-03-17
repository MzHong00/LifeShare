import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, Plus } from 'lucide-react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { APP_COLORS, THEME_COLORS, TYPOGRAPHY } from '@/constants/theme';
import { modalActions } from '@/stores/useModalStore';

interface StoryImageSelectorProps {
  thumbnailUrl?: string; // 선택된 이미지 URI
  onImageSelected: (uri: string) => void; // 이미지 선택 후 콜백
}

/**
 * 스토리 이미지 선택/프리뷰 컴포넌트
 */
export const StoryImageSelector = ({
  thumbnailUrl,
  onImageSelected,
}: StoryImageSelectorProps) => {
  const handleSelectImage = () => {
    modalActions.showModal({
      type: 'none',
      title: '사진 추가',
      message: '사진을 가져올 방법을 선택해주세요.',
      content: (
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: APP_COLORS.primary },
            ]}
            onPress={() => {
              modalActions.hideModal();
              launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
                if (response.assets && response.assets[0].uri) {
                  onImageSelected(response.assets[0].uri);
                }
              });
            }}
          >
            <Text style={styles.modalButtonText}>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: APP_COLORS.primary },
            ]}
            onPress={() => {
              modalActions.hideModal();
              launchImageLibrary(
                { mediaType: 'photo', quality: 0.8 },
                response => {
                  if (response.assets && response.assets[0].uri) {
                    onImageSelected(response.assets[0].uri);
                  }
                },
              );
            }}
          >
            <Text style={styles.modalButtonText}>갤러리</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: APP_COLORS.bgGray }]}
            onPress={() => modalActions.hideModal()}
          >
            <Text
              style={[
                styles.modalButtonText,
                { color: APP_COLORS.textSecondary },
              ]}
            >
              취소
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  };

  return (
    <TouchableOpacity style={styles.photoContainer} onPress={handleSelectImage}>
      {thumbnailUrl ? (
        <Image source={{ uri: thumbnailUrl }} style={styles.selectedImage} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Camera size={32} color={APP_COLORS.textTertiary} />
          <Text style={styles.photoText}>사진 추가하기</Text>
        </View>
      )}
      <View style={styles.addIconBadge}>
        <Plus size={16} color={THEME_COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    width: '100%',
    aspectRatio: 1.2,
    marginBottom: 24,
    position: 'relative',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: APP_COLORS.bgGray,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: APP_COLORS.skeleton,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedImage: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: APP_COLORS.bgGray,
  },
  photoText: {
    ...TYPOGRAPHY.body2,
    color: APP_COLORS.textTertiary,
    fontWeight: '600',
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    color: THEME_COLORS.white,
  },
  modalContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
});
