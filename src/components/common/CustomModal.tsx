import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModalStore, modalActions } from '@/stores/useModalStore';

const CustomModal = () => {
  const { isVisible, options } = useModalStore();
  const { hideModal } = modalActions;

  const handleConfirm = () => {
    if (options.confirmDisabled) return; // 비활성화 상태면 동작 방지
    hideModal();
    options.onConfirm?.();
  };

  const handleCancel = () => {
    hideModal();
    options.onCancel?.();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible
      transparent
      animationType={options.type === 'full' ? 'slide' : 'fade'}
      onRequestClose={hideModal}
    >
      {options.type === 'full' ? (
        <SafeAreaView style={styles.fullContainer}>
          {options.content}
        </SafeAreaView>
      ) : (
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                {/* 1. 타이틀 영역 */}
                <View style={styles.titleSection}>
                  <Text style={styles.title}>{options.title}</Text>
                  {options.message && (
                    <Text style={styles.message}>{options.message}</Text>
                  )}
                </View>

                {/* 2. 커스텀 콘텐츠 영역 (입력창 등) */}
                {options.content && (
                  <View style={styles.customContentSection}>
                    {options.content}
                  </View>
                )}

                {/* 3. 버튼 영역 (타입에 따른 버튼 구성) */}
                {options.type !== 'none' && (
                  <View style={styles.buttonContainer}>
                    {/* Confirm 타입인 경우 취소 버튼 표시 */}
                    {options.type === 'confirm' && (
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.cancelButtonText}>
                          {options.cancelText || '취소'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* 확인 버튼 (Alert/Confirm 공통) */}
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.confirmButton,
                        options.confirmDisabled && styles.disabledButton,
                      ]}
                      onPress={handleConfirm}
                      activeOpacity={options.confirmDisabled ? 1 : 0.8}
                      disabled={options.confirmDisabled}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          options.confirmDisabled && styles.disabledButtonText,
                        ]}
                      >
                        {options.confirmText || '확인'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: THEME_COLORS.white,
    borderRadius: 40,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: THEME_COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    gap: SPACING.xl,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    ...TYPOGRAPHY.header2,
    color: APP_COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...TYPOGRAPHY.body1,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  customContentSection: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: APP_COLORS.primary,
  },
  cancelButton: {
    backgroundColor: APP_COLORS.bgGray,
  },
  disabledButton: {
    backgroundColor: APP_COLORS.bgGray, // 비활성화 시 배경색 변경
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_COLORS.white,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
  },
  disabledButtonText: {
    color: APP_COLORS.textTertiary, // 비활성화 시 텍스트 색상 변경
  },
  fullContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
});

export default CustomModal;
