import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';

import {
  APP_COLORS,
  THEME_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { toastActions } from '@/stores/useToastStore';

const PersonalSettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [inviteRefusalEnabled, setInviteRefusalEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const handlePushToggle = (value: boolean) => {
    setPushEnabled(value);
    toastActions.showToast(
      value ? '알림을 켰습니다' : '알림을 껐습니다',
      value ? 'success' : 'info',
    );
  };

  const handleInviteToggle = (value: boolean) => {
    setInviteRefusalEnabled(value);
    toastActions.showToast(
      value ? '초대 거부 모드를 켰습니다' : '초대 거부 모드를 껐습니다',
      value ? 'success' : 'info',
    );
  };

  const handleMarketingToggle = (value: boolean) => {
    setMarketingEnabled(value);
    toastActions.showToast(
      value ? '마케팅 알림이 켜졌습니다' : '마케팅 알림이 꺼졌습니다',
      'success',
    );
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>푸시 알림</Text>
                <Text style={styles.settingDesc}>
                  활동 관련 알림을 받습니다.
                </Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handlePushToggle}
                trackColor={{
                  false: APP_COLORS.border,
                  true: APP_COLORS.primary,
                }}
                thumbColor={THEME_COLORS.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>마케팅 정보 수신</Text>
                <Text style={styles.settingDesc}>
                  혜택 및 신규 기능 소식을 받습니다.
                </Text>
              </View>
              <Switch
                value={marketingEnabled}
                onValueChange={handleMarketingToggle}
                trackColor={{
                  false: APP_COLORS.border,
                  true: APP_COLORS.primary,
                }}
                thumbColor={THEME_COLORS.white}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보안 및 제한</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>라이프룸 초대 거부</Text>
                <Text style={styles.settingDesc}>
                  새로운 라이프룸 초대를 받지 않습니다.
                </Text>
              </View>
              <Switch
                value={inviteRefusalEnabled}
                onValueChange={handleInviteToggle}
                trackColor={{
                  false: APP_COLORS.border,
                  true: APP_COLORS.primary,
                }}
                thumbColor={THEME_COLORS.white}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.bgGray,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 60,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: SPACING.layout,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: APP_COLORS.textTertiary,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingText: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    ...TYPOGRAPHY.body1,
    color: APP_COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.border,
    marginHorizontal: 20,
    opacity: 0.5,
  },
});

export default PersonalSettingsScreen;
