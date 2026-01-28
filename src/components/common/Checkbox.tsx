
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';

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
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxActive,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && <Check size={14} color={COLORS.white} strokeWidth={3} />}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
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
    borderColor: COLORS.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxDisabled: {
    backgroundColor: COLORS.textTertiary,
    borderColor: COLORS.textTertiary,
    opacity: 0.6,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelDisabled: {
    color: COLORS.textTertiary,
  },
});

export default Checkbox;
