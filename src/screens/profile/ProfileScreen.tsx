import type { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  LogOut,
  Users,
  ChevronRight,
  ShieldCheck,
  Inbox,
  Check,
  X,
  Crown,
  Pencil,
  Camera,
  UserCog,
} from 'lucide-react-native';

import { COLORS, SPACING } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { authActions } from '@/stores/useAuthStore';
import { useUserStore, userActions } from '@/stores/useUserStore';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import { toastActions } from '@/stores/useToastStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { APP_WORKSPACE } from '@/constants/config';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
  isCritical?: boolean;
  badge?: ReactNode;
}

type RootStackParamList = {
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: undefined;
  [NAV_ROUTES.PLAN_MANAGEMENT.NAME]: undefined;
  [NAV_ROUTES.PRO_UPGRADE.NAME]: undefined;
  [NAV_ROUTES.PRIVACY_POLICY.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_LIST.NAME]: undefined;
  [NAV_ROUTES.PERSONAL_SETTINGS.NAME]: undefined;
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

  const handleEditName = () => {
    let newName = displayUserName;

    modalActions.showModal({
      title: '이름 수정',
      type: 'confirm',
      confirmText: '변경하기',
      content: (
        <View style={styles.modalContent}>
          <TextInput
            style={styles.nameInput}
            defaultValue={displayUserName}
            placeholder="새 이름을 입력하세요"
            onChangeText={text => (newName = text)}
            autoFocus
          />
        </View>
      ),
      onConfirm: () => {
        if (newName.trim()) {
          userActions.updateUser({ name: newName.trim() });
          toastActions.showToast('이름이 성공적으로 변경되었습니다', 'success');
        }
      },
    });
  };

  const handleEditPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.8,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        toastActions.showToast('이미지를 불러오는데 실패했습니다', 'error');
        return;
      }

      const imageUri = result.assets?.[0]?.uri;
      if (imageUri) {
        userActions.updateUser({ profileImage: imageUri });
        toastActions.showToast(
          '프로필 사진이 성공적으로 변경되었습니다',
          'success',
        );
      }
    } catch {
      toastActions.showToast('이미지 처리 중 오류가 발생했습니다', 'error');
    }
  };

  const displayUserName = user?.name || userEmail?.split('@')[0] || '사용자';

  const menuItems: MenuItem[] = [
    {
      id: 'workspace',
      label: `${APP_WORKSPACE.KR} 관리 및 초대`,
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
      icon: <UserCog size={20} color={COLORS.textPrimary} />,
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
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleEditPhoto}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <ProfileAvatar
                  uri={user?.profileImage}
                  name={displayUserName}
                  size={80}
                />
              </View>
              <View style={styles.avatarEditBadge}>
                <Camera size={14} color={COLORS.white} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <TouchableOpacity
                style={styles.nameRow}
                onPress={handleEditName}
                activeOpacity={0.6}
              >
                <Text style={styles.userName}>{displayUserName}</Text>
                <Pencil
                  size={14}
                  color={COLORS.textTertiary}
                  style={styles.pencilIcon}
                />
              </TouchableOpacity>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 32,
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
    alignItems: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pencilIcon: {
    marginLeft: 6,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary, // 토스 블루 포인트 컬러 적용
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white, // 아바타와 경계를 명확히 하는 화이트 보더
    // 입체감을 위한 그림자 추가
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  nameInput: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  photoOptions: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  photoOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  photoOptionText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  photoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
    opacity: 0.5,
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
    shadowColor: COLORS.black,
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
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
