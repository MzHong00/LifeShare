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
  CircleHelp,
  Inbox,
  Check,
  X,
  Crown,
} from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useModalStore } from '@/stores/useModalStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
  isCritical?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

type RootStackParamList = {
  [NAV_ROUTES.PROFILE_EDIT.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_LIST.NAME]: undefined;
  [NAV_ROUTES.PLAN_MANAGEMENT.NAME]: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUserStore();
  const userEmail = 'user@example.com'; // 임시: 이메일 정보 위치 확인 필요
  const clearTokens = useAuthStore(state => state.clearTokens);
  const clearData = useWorkspaceStore(state => state.clearData);
  const invitations = useWorkspaceStore(state => state.invitations);
  const respondToInvitation = useWorkspaceStore(
    state => state.respondToInvitation,
  );
  const showConfirm = useModalStore(state => state.showConfirm);

  const pendingInvitations = invitations.filter(
    inv => inv.inviteeEmail === userEmail && inv.status === 'pending',
  );

  const handleInvitationResponse = (
    id: string,
    status: 'accepted' | 'declined',
    name: string,
  ) => {
    const action = status === 'accepted' ? '수락' : '거절';
    showConfirm(
      '초대 확인',
      `'${name}' 라이프룸 초대를 ${action}하시겠습니까?`,
      () => respondToInvitation(id, status),
    );
  };

  const handleLogout = () => {
    showConfirm(
      '로그아웃',
      '정말 로그아웃 하시겠어요?\n데이터가 초기화될 수 있습니다.',
      () => {
        clearTokens();
        clearData();
      },
    );
  };

  const displayUserName = user?.name || userEmail?.split('@')[0] || '사용자';

  const menuItems: MenuSection[] = [
    {
      title: '공간 관리',
      items: [
        {
          id: 'workspace',
          label: '연결 관리 및 초대',
          icon: <Users size={22} color={COLORS.textSecondary} />,
          onPress: () => navigation.navigate(NAV_ROUTES.WORKSPACE_LIST.NAME),
        },
        {
          id: 'plan',
          label: '플랜 관리',
          icon: <Crown size={22} color={COLORS.textSecondary} />,
          onPress: () => navigation.navigate(NAV_ROUTES.PLAN_MANAGEMENT.NAME),
        },
      ],
    },
    {
      title: '설정',
      items: [
        {
          id: 'notifications',
          label: '알림 설정',
          icon: <Bell size={22} color={COLORS.textSecondary} />,
          onPress: () => {},
        },
        {
          id: 'privacy',
          label: '개인정보 보호',
          icon: <ShieldCheck size={22} color={COLORS.textSecondary} />,
          onPress: () => {},
        },
        {
          id: 'help',
          label: '고객센터',
          icon: <CircleHelp size={22} color={COLORS.textSecondary} />,
          onPress: () => {},
        },
      ],
    },
    {
      title: '계정',
      items: [
        {
          id: 'logout',
          label: '로그아웃',
          icon: <LogOut size={22} color={COLORS.error} />,
          onPress: handleLogout,
          isCritical: true,
        },
      ],
    },
  ];

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatar}>
              <User size={32} color={COLORS.primary} strokeWidth={2.5} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{displayUserName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate(NAV_ROUTES.PROFILE_EDIT.NAME)}
            >
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

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

        {/* Menu Sections */}
        {menuItems.map((section, index) => (
          <View key={index}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
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
                  <ChevronRight size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
            {index < menuItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

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
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    ...TYPOGRAPHY.header2,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  divider: {
    height: 10,
    backgroundColor: COLORS.background,
  },
  section: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: 12,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textTertiary,
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  version: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  invitationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  invitationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invitationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  invitationText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  inviterName: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  invitationWorkspace: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: COLORS.background,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
  },
});

export default ProfileScreen;
