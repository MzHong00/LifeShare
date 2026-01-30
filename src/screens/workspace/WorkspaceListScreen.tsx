import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import {
  Plus,
  ArrowLeftRight,
  UserPlus,
  Trash2,
  Edit3,
  Heart,
  Users,
  User,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { APP_WORKSPACE } from '@/constants/config';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useModalStore } from '@/stores/useModalStore';
import { calculateDDay, formatDate } from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type RootStackParamList = {
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]:
    | {
        workspaceId?: string;
        workspaceName?: string;
      }
    | undefined;
};

const WorkspaceListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const workspaces = useWorkspaceStore(state => state.workspaces);
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  const setCurrentWorkspace = useWorkspaceStore(
    state => state.setCurrentWorkspace,
  );
  const removeWorkspace = useWorkspaceStore(state => state.removeWorkspace);
  const updateWorkspaceName = useWorkspaceStore(
    state => state.updateWorkspaceName,
  );
  const updateMemberProfile = useWorkspaceStore(
    state => state.updateMemberProfile,
  );
  const { showModal } = useModalStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);
  const [newName, setNewName] = useState('');

  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [invitingWorkspace, setInvitingWorkspace] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [switchingWorkspace, setSwitchingWorkspace] = useState<any>(null);

  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [viewingMembersWorkspace, setViewingMembersWorkspace] =
    useState<any>(null);

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editingProfileWorkspace, setEditingProfileWorkspace] =
    useState<any>(null);
  const [profileName, setProfileName] = useState('');

  const userEmail = 'user@example.com'; // 임시: 이메일 정보 위치 확인 필요
  const sendInvitation = useWorkspaceStore(state => state.sendInvitation);

  const handleSwitch = (workspace: any) => {
    if (currentWorkspace?.id === workspace.id) return;
    setSwitchingWorkspace(workspace);
    setSwitchModalVisible(true);
  };

  const confirmSwitch = () => {
    if (switchingWorkspace) {
      setCurrentWorkspace(switchingWorkspace);
      setSwitchModalVisible(false);
      setSwitchingWorkspace(null);
    }
  };

  const handleRemove = (workspace: any) => {
    showModal({
      type: 'confirm',
      title: '연결 해지',
      message: `'${workspace.name}' ${APP_WORKSPACE.KR}과의 연결을 해지하시겠습니까?\n데이터는 삭제되지 않지만 목록에서 제거됩니다.`,
      onConfirm: () => removeWorkspace(workspace.id),
    });
  };

  const handleEditName = (workspace: any) => {
    setEditingWorkspace(workspace);
    setNewName(workspace.name);
    setEditModalVisible(true);
  };

  const saveName = () => {
    if (!newName.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '공간 이름을 입력해주세요.',
      });
      return;
    }
    updateWorkspaceName(editingWorkspace.id, newName.trim());
    setEditModalVisible(false);
    setEditingWorkspace(null);
  };

  const handleInvite = (workspace: any) => {
    setInvitingWorkspace(workspace);
    setInviteEmail('');
    setInviteModalVisible(true);
  };

  const sendDirectInvite = () => {
    if (!inviteEmail.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '초대할 파트너의 이메일을 입력해주세요.',
      });
      return;
    }

    if (!userEmail) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '로그인 정보가 없습니다.',
      });
      return;
    }

    sendInvitation(
      invitingWorkspace.id,
      invitingWorkspace.name,
      userEmail,
      inviteEmail.trim(),
    );

    showModal({
      type: 'alert',
      title: '알림',
      message: '초대가 전송되었습니다.',
    });
    setInviteModalVisible(false);
    setInvitingWorkspace(null);
  };

  const handleViewMembers = (workspace: any) => {
    setViewingMembersWorkspace(workspace);
    setMemberModalVisible(true);
  };

  const handleEditProfile = (workspace: any) => {
    const myProfile = (workspace.members || []).find(
      (m: any) => m.id === 'user-1',
    );
    setEditingProfileWorkspace(workspace);
    setProfileName(myProfile?.name || '민수');
    setProfileModalVisible(true);
  };

  const saveProfile = () => {
    if (!profileName.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '이름을 입력해주세요.',
      });
      return;
    }
    updateMemberProfile(editingProfileWorkspace.id, 'user-1', {
      name: profileName.trim(),
    });
    setProfileModalVisible(false);
    setEditingProfileWorkspace(null);
    showModal({
      type: 'alert',
      title: '알림',
      message: '활동명이 변경되었습니다.',
    });
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>내 {APP_WORKSPACE.KR} 목록</Text>
            <TouchableOpacity
              onPress={() => {
                useWorkspaceStore.getState().initMockData();
                showModal({
                  type: 'alert',
                  title: '알림',
                  message: '목업 데이터로 초기화되었습니다.',
                });
              }}
            >
              <Text style={styles.resetText}>목업 초기화</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            현재 참여 중인 공간들을 관리할 수 있습니다.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {workspaces.map(ws => (
            <View
              key={ws.id}
              style={[
                styles.workspaceCard,
                currentWorkspace?.id === ws.id && styles.activeCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconWrapper}>
                  {ws.type === 'couple' ? (
                    <Heart
                      size={20}
                      color={COLORS.primary}
                      fill={COLORS.primary}
                    />
                  ) : (
                    <Users size={20} color={COLORS.primary} />
                  )}
                </View>
                <View style={styles.wsInfo}>
                  <Text style={styles.wsName}>{ws.name}</Text>
                  <View style={styles.wsSubInfo}>
                    <Text style={styles.wsType}>
                      {ws.type === 'couple' ? '커플' : '단체'} 라이프룸
                    </Text>
                    {ws.startDate && (
                      <>
                        <View style={styles.dot} />
                        <Text style={styles.wsDate}>
                          {formatDate(ws.startDate)}~
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                {ws.type === 'couple' && ws.startDate && (
                  <View style={styles.ddayBadge}>
                    <Text style={styles.ddayText}>
                      D+{calculateDDay(ws.startDate)}
                    </Text>
                  </View>
                )}
                {currentWorkspace?.id === ws.id && ws.type !== 'couple' && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>사용 중</Text>
                  </View>
                )}
              </View>

              {/* 멤버 프로필 섹션 */}
              <TouchableOpacity
                style={styles.membersSection}
                onPress={() => handleViewMembers(ws)}
                activeOpacity={0.7}
              >
                <View style={styles.memberAvatars}>
                  {(() => {
                    const members =
                      ws.members && ws.members.length > 0
                        ? ws.members
                        : [{ id: 'me', name: '나', avatar: null }];
                    const displayMembers = members.slice(0, 3);
                    const remainingCount = members.length - 3;

                    return (
                      <>
                        {displayMembers.map((member: any, idx: number) => (
                          <View
                            key={member.id + idx}
                            style={[
                              styles.avatarBorder,
                              idx === 0
                                ? styles.firstAvatar
                                : styles.stackedAvatar,
                            ]}
                          >
                            {member.avatar ? (
                              <Image
                                source={{ uri: member.avatar }}
                                style={styles.miniAvatarImage}
                              />
                            ) : (
                              <View
                                style={[
                                  styles.miniAvatar,
                                  { backgroundColor: COLORS.primaryLight },
                                ]}
                              >
                                <Text style={styles.avatarInitial}>
                                  {member.name.charAt(0)}
                                </Text>
                              </View>
                            )}
                          </View>
                        ))}
                        {remainingCount > 0 && (
                          <View
                            style={[
                              styles.avatarBorder,
                              styles.stackedAvatar,
                              styles.moreBadge,
                            ]}
                          >
                            <Text style={styles.moreText}>
                              +{remainingCount}
                            </Text>
                          </View>
                        )}
                      </>
                    );
                  })()}
                </View>
                <View style={styles.membersTextWrapper}>
                  <Text style={styles.membersCount} numberOfLines={1}>
                    {ws.members && ws.members.length > 0
                      ? `${ws.members.length}명 (${ws.members
                          .map((m: any) => m.name)
                          .join(', ')})`
                      : '나홀로 참여 중 (파트너 초대)'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleSwitch(ws)}
                  disabled={currentWorkspace?.id === ws.id}
                >
                  <ArrowLeftRight
                    size={20}
                    color={
                      currentWorkspace?.id === ws.id
                        ? COLORS.border
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.actionLabel,
                      currentWorkspace?.id === ws.id && styles.disabledLabel,
                    ]}
                  >
                    전환
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleEditName(ws)}
                >
                  <Edit3 size={20} color={COLORS.textSecondary} />
                  <Text style={styles.actionLabel}>이름</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleInvite(ws)}
                >
                  <UserPlus size={20} color={COLORS.textSecondary} />
                  <Text style={styles.actionLabel}>초대</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleEditProfile(ws)}
                >
                  <User size={20} color={COLORS.textSecondary} />
                  <Text style={styles.actionLabel}>프로필</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleRemove(ws)}
                >
                  <Trash2 size={20} color={COLORS.error} />
                  <Text style={[styles.actionLabel, { color: COLORS.error }]}>
                    해지
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(NAV_ROUTES.WORKSPACE_SETUP.NAME)}
        >
          <Plus size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>
            새로운 {APP_WORKSPACE.KR} 생성
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 이름 수정 모달 */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>이름 변경</Text>
            <Text style={styles.modalDescription}>
              새로운 {APP_WORKSPACE.KR} 이름을 입력해주세요.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="공간 이름 입력"
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={saveName}
              >
                <Text style={styles.modalSaveText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 초대 모달 */}
      <Modal
        visible={inviteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>파트너 초대</Text>
            <Text style={styles.modalDescription}>
              '{invitingWorkspace?.name}'에 초대할 파트너의 이메일을
              입력해주세요.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder="파트너 이메일 입력"
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setInviteModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={sendDirectInvite}
              >
                <Text style={styles.modalSaveText}>초대 보내기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 전환 확인 모달 */}
      <Modal
        visible={switchModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSwitchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconWrapperLarge}>
              <ArrowLeftRight size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.modalTitle}>공간 전환</Text>
            <Text style={styles.modalDescription}>
              '{switchingWorkspace?.name}'으로{'\n'}지금 바로 이동할까요?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setSwitchModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={confirmSwitch}
              >
                <Text style={styles.modalSaveText}>전환하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 전체 멤버 보기 모달 */}
      <Modal
        visible={memberModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMemberModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.memberModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>전체 멤버</Text>
              <Text style={styles.modalSubtitle}>
                {viewingMembersWorkspace?.name}
              </Text>
            </View>

            <ScrollView style={styles.memberListScroll}>
              {(viewingMembersWorkspace?.members || []).map((member: any) => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberAvatarWrapper}>
                    {member.avatar ? (
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.memberAvatarFull}
                      />
                    ) : (
                      <View style={styles.memberAvatarPlaceholder}>
                        <Text style={styles.avatarInitial}>
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberNameFull}>{member.name}</Text>
                    {member.id === 'user-1' && (
                      <View style={styles.meTag}>
                        <Text style={styles.meTagText}>나</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMemberModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 활동명 수정 모달 */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>활동명 설정</Text>
            <Text style={styles.modalDescription}>
              '{editingProfileWorkspace?.name}'에서 사용할{'\n'}나의 이름을
              입력해주세요.
            </Text>

            <View style={styles.profileInputSection}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput
                style={styles.modalInput}
                value={profileName}
                onChangeText={setProfileName}
                placeholder="이름 입력"
                autoFocus
                selectTextOnFocus
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={saveProfile}
              >
                <Text style={styles.modalSaveText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    ...TYPOGRAPHY.header2,
    fontSize: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resetText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },
  description: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textTertiary,
  },
  listContainer: {
    gap: 16,
    marginBottom: 32,
  },
  workspaceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  activeCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wsInfo: {
    flex: 1,
  },
  wsName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  wsType: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  activeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  wsSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textTertiary,
    marginHorizontal: 6,
  },
  wsDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  ddayBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ddayText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  profileInputSection: {
    width: '100%',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  disabledLabel: {
    color: COLORS.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 18,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  membersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 14,
  },
  memberAvatars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  avatarBorder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.white,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  firstAvatar: {
    marginLeft: 0,
  },
  stackedAvatar: {
    marginLeft: -10,
  },
  miniAvatarImage: {
    width: 32,
    height: 32,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  moreBadge: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  membersTextWrapper: {
    flex: 1,
  },
  membersCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    ...TYPOGRAPHY.header2,
    fontSize: 20,
    marginBottom: 8,
  },
  modalDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtn: {
    backgroundColor: COLORS.background,
  },
  modalSaveBtn: {
    backgroundColor: COLORS.primary,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  iconWrapperLarge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberModalContent: {
    maxHeight: '70%',
    paddingBottom: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  modalSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  memberListScroll: {
    width: '100%',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  memberAvatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    marginRight: 14,
  },
  memberAvatarFull: {
    width: '100%',
    height: '100%',
  },
  memberAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberNameFull: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  meTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  meTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  closeButton: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default WorkspaceListScreen;
