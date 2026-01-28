import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { useModalStore } from '@/stores/useModalStore';

const CustomModal = () => {
  const { isVisible, options, hideModal } = useModalStore();
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(20));

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
    }
  }, [isVisible, fadeAnim, slideAnim]);

  const handleConfirm = () => {
    hideModal();
    if (options.onConfirm) {
      options.onConfirm();
    }
  };

  const handleCancel = () => {
    hideModal();
    if (options.onCancel) {
      options.onCancel();
    }
  };

  const handleDestructive = () => {
    hideModal();
    if (options.onDestructive) {
      options.onDestructive();
    }
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none">
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
                activeOpacity={0.6}
              >
                <X size={20} color={COLORS.textTertiary} />
              </TouchableOpacity>

              <View style={styles.content}>
                <Text style={styles.title}>{options.title}</Text>
                <Text style={styles.message}>{options.message}</Text>
              </View>

              <View
                style={[
                  styles.buttonContainer,
                  options.type === 'choice' && styles.choiceButtonContainer,
                ]}
              >
                {options.type === 'confirm' && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>
                      {options.cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                {options.type === 'choice' && (
                  <>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleDestructive}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.destructiveButtonText}>
                        {options.destructiveText}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton]}
                      onPress={handleConfirm}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.confirmButtonText]}>
                        {options.confirmText}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {options.type !== 'choice' && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.confirmButton,
                      options.type === 'alert' && styles.fullWidthButton,
                    ]}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.confirmButtonText}>
                      {options.confirmText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingTop: 48, // X 버튼 공간 확보
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    ...TYPOGRAPHY.header2,
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  choiceButtonContainer: {
    flexDirection: 'row',
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceButton: {
    flex: 1,
  },
  choiceConfirmButton: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  lastChoiceButton: {
    borderBottomWidth: 0,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  fullWidthButton: {
    width: '100%',
  },
  confirmButtonText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textTertiary,
  },
  destructiveButtonText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});

export default CustomModal;
