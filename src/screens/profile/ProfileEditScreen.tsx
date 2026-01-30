import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Camera } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useUserStore } from '@/stores/useUserStore';
import { useModalStore } from '@/stores/useModalStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';

/**
 * 헤더 우측 완료 버튼 컴포넌트
 * 렌더링 중 정의 에러를 피하기 위해 스크린 외부에 정의합니다.
 */
const HeaderSaveButton = () => {
  const route = useRoute<any>();
  const handleSave = route.params?.handleSave;
  return (
    <TouchableOpacity onPress={() => handleSave?.()} style={styles.headerRight}>
      <Text style={styles.saveButtonText}>완료</Text>
    </TouchableOpacity>
  );
};

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const { user: userProfile, updateUser: updateProfile } = useUserStore();
  const { showModal } = useModalStore();

  const [name, setName] = useState(userProfile?.name || '');
  const [profileImage, setProfileImage] = useState(
    userProfile?.profileImage || '',
  );

  const handleSelectImage = () => {
    showModal({
      type: 'choice',
      title: '프로필 사진 수정',
      message: '사진을 가져올 방법을 선택하세요.',
      confirmText: '카메라',
      destructiveText: '갤러리',
      cancelText: '취소',
      onConfirm: () => {
        launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
          if (response.assets && response.assets[0].uri) {
            setProfileImage(response.assets[0].uri);
          }
        });
      },
      onDestructive: () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
          if (response.assets && response.assets[0].uri) {
            setProfileImage(response.assets[0].uri);
          }
        });
      },
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

  // handleSave 함수를 네비게이션 파라미터에 등록
  useEffect(() => {
    (navigation as any).setParams({ handleSave });
  }, [navigation, handleSave]);

  // 헤더 옵션 설정 (컴포넌트 참조만 전달하여 린트 경고 방지)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderSaveButton,
    });
  }, [navigation]);

  return (
    <AppSafeAreaView style={styles.container}>
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
              <View style={styles.inputGroup}>
                <Text style={styles.label}>이름</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="이름을 입력하세요"
                  placeholderTextColor={COLORS.textTertiary}
                  maxLength={12}
                />
                <Text style={styles.charCount}>{name.length}/12</Text>
              </View>
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
  headerRight: {
    marginRight: SPACING.md,
  },
  saveButtonText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.primary,
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textTertiary,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  charCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
});

export default ProfileEditScreen;
