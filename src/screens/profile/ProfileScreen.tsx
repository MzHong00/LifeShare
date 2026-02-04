import type { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  LogOut,
  Users,
  ChevronRight,
  User,
  Bell,
  ShieldCheck,
  Inbox,
  Check,
  X,
  Crown,
} from 'lucide-react-native';

import { COLORS, SPACING } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { authActions } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
  isCritical?: boolean;
  badge?: ReactNode;
}

type RootStackParamList = {
  [NAV_ROUTES.PROFILE_EDIT.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_LIST.NAME]: undefined;
  [NAV_ROUTES.PLAN_MANAGEMENT.NAME]: undefined;
  [NAV_ROUTES.PRO_UPGRADE.NAME]: undefined;
  [NAV_ROUTES.PRIVACY_POLICY.NAME]: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUserStore();
  const userEmail = 'user@example.com'; // 임시: 이메일 정보 위치 확인 필요
  const { clearTokens } = authActions;
  const { clearData, respondToInvitation } = workspaceActions;
  const { invitations } = useWorkspaceStore();
  const { showModal } = modalActions;

  const pendingInvitations = invitations.filter(
    inv => inv.inviteeEmail === userEmail && inv.status === 'pending',
  );

  const handleInvitationResponse = (
    id: string,
    status: 'accepted' | 'declined',
    name: string,
  ) => {
    const action = status === 'accepted' ? '수락' : '거절';
    showModal({
      type: 'confirm',
      title: '초대 확인',
      message: `'${name}' 라이프룸 초대를 ${action}하시겠습니까?`,
      onConfirm: () => respondToInvitation(id, status),
    });
  };

  const handleLogout = () => {
    showModal({
      type: 'confirm',
      title: '로그아웃',
      message: '정말 로그아웃 하시겠어요?\n데이터가 초기화될 수 있습니다.',
      onConfirm: () => {
        clearTokens();
        clearData();
      },
    });
  };

  const displayUserName = user?.name || userEmail?.split('@')[0] || '사용자';

  const menuItems: MenuItem[] = [
    {
      id: 'workspace',
      label: '공간 관리 및 초대',
      icon: <Users size={20} color={COLORS.textPrimary} />,
      onPress: () => navigation.navigate(NAV_ROUTES.WORKSPACE_LIST.NAME as any),
    },
    {
      id: 'plan',
      label: '멤버십 및 플랜',
      icon: <Crown size={20} color={COLORS.textPrimary} />,
      onPress: () =>
        navigation.navigate(NAV_ROUTES.PLAN_MANAGEMENT.NAME as any),
      badge: (
        <View style={styles.proBadge}>
          <Crown size={10} color={COLORS.white} fill={COLORS.white} />
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      ),
    },
    {
      id: 'personal_settings',
      label: '개인 설정',
      icon: <Bell size={20} color={COLORS.textPrimary} />,
      onPress: () =>
        navigation.navigate(NAV_ROUTES.PERSONAL_SETTINGS.NAME as any),
    },
    {
      id: 'privacy',
      label: '개인정보 처리방침',
      icon: <ShieldCheck size={20} color={COLORS.textPrimary} />,
      onPress: () => navigation.navigate(NAV_ROUTES.PRIVACY_POLICY.NAME as any),
    },
    {
      id: 'logout',
      label: '로그아웃',
      icon: <LogOut size={20} color={COLORS.error} />,
      onPress: handleLogout,
      isCritical: true,
    },
  ];

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section (Flat) */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={36} color={COLORS.primary} strokeWidth={2.5} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{displayUserName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>

            <TouchableOpacity
              style={styles.editIconBtn}
              onPress={() =>
                navigation.navigate(NAV_ROUTES.PROFILE_EDIT.NAME as any)
              }
            >
              <Text style={styles.editLabel}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Invitations Section */}
        {pendingInvitations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>도착한 초대</Text>
            {pendingInvitations.map(inv => (
              <View key={inv.id} style={styles.invitationCard}>
                <View style={styles.invitationInfo}>
                  <View style={styles.invitationIcon}>
                    <Inbox size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.invitationText}>
                      <Text style={styles.inviterName}>{inv.inviterEmail}</Text>
                      님이
                    </Text>
                    <Text style={styles.invitationWorkspace}>
                      '{inv.workspaceName}'에 초대했습니다.
                    </Text>
                  </View>
                </View>
                <View style={styles.invitationActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.declineBtn]}
                    onPress={() =>
                      handleInvitationResponse(
                        inv.id,
                        'declined',
                        inv.workspaceName,
                      )
                    }
                  >
                    <X size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() =>
                      handleInvitationResponse(
                        inv.id,
                        'accepted',
                        inv.workspaceName,
                      )
                    }
                  >
                    <Check size={18} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Single Menu Card */}
        <View style={styles.menuGroups}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.6}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.iconContainer}>{item.icon}</View>
                    <Text
                      style={[
                        styles.menuItemLabel,
                        item.isCritical && { color: COLORS.error },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.badge}
                    <ChevronRight size={18} color={COLORS.textTertiary} />
                  </View>
                </TouchableOpacity>
                {index < menuItems.length - 1 && (
                  <View style={styles.menuDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>버전 1.0.0 (beta)</Text>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // 바탕을 연한 그레이로 처리하여 카드 부각
  },
  scrollContent: {
    paddingBottom: 60,
  },
  profileSection: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBadge: {
    backgroundColor: '#191F28',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
    marginLeft: 2,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  editIconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  editLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  menuGroups: {
    paddingHorizontal: SPACING.layout,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textTertiary,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 18,
    opacity: 0.5,
  },
  section: {
    paddingHorizontal: SPACING.layout,
    paddingTop: 10,
    marginBottom: 10,
  },
  invitationCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  invitationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invitationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  invitationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  inviterName: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  invitationWorkspace: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: COLORS.white,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  version: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
});

export default ProfileScreen;
