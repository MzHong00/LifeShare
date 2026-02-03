import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '@/constants/theme';
import { FormLabel } from './FormLabel';

interface FormFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  multiline?: boolean;
  required?: boolean;
}

/**
 * 폼 라벨과 입력 필드가 결합된 공용 필드 컴포넌트입니다.
 */
export const FormField = ({
  label,
  value,
  onChangeText,
  maxLength,
  multiline,
  required,
  ...props
}: FormFieldProps) => {
  return (
    <View style={styles.container}>
      <FormLabel required={required}>{label}</FormLabel>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        multiline={multiline}
        placeholderTextColor={COLORS.textTertiary}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
      {maxLength && (
        <View style={styles.footer}>
          <FormLabel
            style={styles.charCount}
          >{`${value.length}/${maxLength}`}</FormLabel>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  footer: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  charCount: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.textTertiary,
    marginBottom: 0,
    marginRight: 4,
  },
});
