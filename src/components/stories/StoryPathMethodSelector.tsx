import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Route } from 'lucide-react-native';

import { APP_COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { modalActions } from '@/stores/useModalStore';
import { storyActions } from '@/stores/useStoryStore';
import { toastActions } from '@/stores/useToastStore';
import { NAV_ROUTES } from '@/constants/navigation';
import StoryMapPicker from '@/components/stories/StoryMapPicker';
import type { LocationPoint } from '@/types';

interface StoryPathMethodSelectorProps {
  path: LocationPoint[]; // 선택된 경로 포인트 목록
  pathColor: string; // 경로 표시 색상
  onSelectPath: (path: LocationPoint[]) => void; // 경로 선택 후 콜백
  navigation: any; // 네비게이션 객체
}

/**
 * 경로 저장 방식 선택 컴포넌트 (직접 선택 / 실시간 기록)
 */
export const StoryPathMethodSelector = ({
  path,
  pathColor,
  onSelectPath,
  navigation,
}: StoryPathMethodSelectorProps) => {
  const handleManualSelect = () => {
    modalActions.showModal({
      type: 'full',
      title: '경로 직접 선택',
      content: (
        <StoryMapPicker
          path={path}
          pathColor={pathColor}
          onSelect={onSelectPath}
          onClose={() => modalActions.hideModal()}
        />
      ),
    });
  };

  const handleRealtimeRecording = () => {
    modalActions.showModal({
      type: 'confirm',
      title: '실시간 기록 시작',
      message:
        '지금 위치 화면으로 이동하여 이동하는 경로를 기록하시겠습니까?\n작성 중이던 내용은 저장되지 않을 수 있습니다.',
      confirmText: '기록 시작',
      cancelText: '취소',
      onConfirm: () => {
        storyActions.startRecording();
        toastActions.showToast(
          '실시간 위치 기록을 시작합니다.\n이동하신 경로는 스토리로 저장됩니다.',
          'info',
        );
        navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME, {
          screen: NAV_ROUTES.LOCATION.NAME,
        });
      },
    });
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>경로 저장 방식</Text>
      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[styles.input, styles.methodButton]}
          onPress={handleManualSelect}
        >
          <MapPin
            size={24}
            color={APP_COLORS.textSecondary}
            style={styles.methodIcon}
          />
          <Text
            style={[styles.methodText, { color: APP_COLORS.textSecondary }]}
          >
            직접 선택
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.input, styles.methodButton]}
          onPress={handleRealtimeRecording}
        >
          <Route
            size={24}
            color={APP_COLORS.textSecondary}
            style={styles.methodIcon}
          />
          <Text
            style={[styles.methodText, { color: APP_COLORS.textSecondary }]}
          >
            실시간 기록
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  label: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: APP_COLORS.bgGray,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: APP_COLORS.textPrimary,
  },
  methodContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  methodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  methodIcon: {
    marginBottom: 6,
  },
  methodText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
  },
});
