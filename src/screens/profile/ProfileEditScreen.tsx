import { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Camera } from 'lucide-react-native';

import { COLORS, SPACING } from '@/constants/theme';
import { useUserStore, userActions } from '@/stores/useUserStore';
import { modalActions } from '@/stores/useModalStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { HeaderButton } from '@/components/common/HeaderButton';
import { FormField } from '@/components/common/FormField';

/**
 * [ProfileEditScreen]
 * 사용자 프로필 정보를 수정하는 화면입니다.
 */
const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const { user: userProfile } = useUserStore();
  const { updateUser: updateProfile } = userActions;
  const { showModal } = modalActions;

  const [name, setName] = useState(userProfile?.name || '');
  const [profileImage, setProfileImage] = useState(
    userProfile?.profileImage || '',
  );

  const handleSelectImage = () => {
    showModal({
      type: 'none',
      title: '프로필 사진 수정',
      message: '사진을 가져올 방법을 선택하세요.',
      content: (
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
            onPress={() => {
              modalActions.hideModal();
              launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
                if (response.assets && response.assets[0].uri) {
                  setProfileImage(response.assets[0].uri);
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
                    setProfileImage(response.assets[0].uri);
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
  };

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '이름을 입력해주세요.',
      });
      return;
    }

    updateProfile({ name: name.trim(), profileImage });
    navigation.goBack();
  }, [name, profileImage, updateProfile, navigation, showModal]);

  const renderHeaderRight = useCallback(
    () => <HeaderButton label="완료" onPress={handleSave} />,
    [handleSave],
  );

  return (
    <AppSafeAreaView style={styles.container} headerRight={renderHeaderRight}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.avatarSection}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={handleSelectImage}
                activeOpacity={0.8}
              >
                <ProfileAvatar uri={profileImage} name={name} size={100} />
                <View style={styles.cameraButton}>
                  <Camera size={18} color={COLORS.white} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <FormField
                label="이름"
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
                maxLength={12}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  form: {
    paddingHorizontal: SPACING.layout,
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
});

export default ProfileEditScreen;
