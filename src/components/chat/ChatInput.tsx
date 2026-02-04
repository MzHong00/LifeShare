import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Plus, Send, X } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPlusPress?: () => void;
  isActionMenuVisible?: boolean;
}

export const ChatInput = ({
  value,
  onChangeText,
  onSend,
  onPlusPress,
  isActionMenuVisible,
}: ChatInputProps) => {
  return (
    <View style={styles.inputWrapper}>
      <TouchableOpacity style={styles.plusButton} onPress={onPlusPress}>
        {isActionMenuVisible ? (
          <X size={24} color={COLORS.textSecondary} />
        ) : (
          <Plus size={24} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={value}
          onChangeText={onChangeText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !value.trim() && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={!value.trim()}
        >
          <Send size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 0 : SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  plusButton: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    color: COLORS.textPrimary,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textTertiary,
  },
});
