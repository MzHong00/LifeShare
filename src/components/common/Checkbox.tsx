import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { APP_COLORS, THEME_COLORS, TYPOGRAPHY } from '@/constants/theme';
import { AppPressable } from '@/components/common/AppPressable';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const Checkbox = ({
  label,
  checked,
  onPress,
  disabled = false,
  style,
}: CheckboxProps) => {
  return (
    <AppPressable
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxActive,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <Check size={14} color={THEME_COLORS.white} strokeWidth={3} />
        )}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </AppPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: APP_COLORS.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  checkboxDisabled: {
    backgroundColor: APP_COLORS.textTertiary,
    borderColor: APP_COLORS.textTertiary,
    opacity: 0.6,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: APP_COLORS.textSecondary,
    fontWeight: '500',
  },
  labelDisabled: {
    color: APP_COLORS.textTertiary,
  },
});

export default Checkbox;
