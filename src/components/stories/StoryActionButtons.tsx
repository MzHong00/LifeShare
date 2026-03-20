import { View, Text, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { APP_COLORS, THEME_COLORS, SPACING } from '@/constants/theme';
import { AppPressable } from '@/components/common/AppPressable';

interface StoryActionButtonsProps {
  isEditMode: boolean; // 수정 모드 여부
  onSave: () => void; // 저장 버튼 클릭 시 콜백
  onDelete?: () => void; // 삭제 버튼 클릭 시 콜백 (수정 모드일 때만 표시)
}

/**
 * 하단 저장/삭제 버튼 컴포넌트
 */
export const StoryActionButtons = ({
  isEditMode,
  onSave,
  onDelete,
}: StoryActionButtonsProps) => {
  return (
    <View style={styles.footer}>
      {isEditMode && onDelete && (
        <AppPressable style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={20} color={APP_COLORS.error} />
        </AppPressable>
      )}
      <AppPressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>
          {isEditMode ? '수정하기' : '기록하기'}
        </Text>
      </AppPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    backgroundColor: THEME_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.skeleton,
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveButtonText: {
    color: THEME_COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.error + '10',
    paddingHorizontal: 20,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: APP_COLORS.error + '20',
  },
});
