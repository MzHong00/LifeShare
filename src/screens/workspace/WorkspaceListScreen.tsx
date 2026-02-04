import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Plus,
  Heart,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { NAV_ROUTES } from '@/constants/navigation';
import { APP_WORKSPACE } from '@/constants/config';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import { calculateDDay } from '@/utils/date';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type RootStackParamList = {
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]: any;
  [NAV_ROUTES.WORKSPACE_EDIT.NAME]: { workspaceId: string };
};

const WorkspaceListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { workspaces, currentWorkspace } = useWorkspaceStore();
  const { setCurrentWorkspace, initMockData } = workspaceActions;
  const { showModal } = modalActions;

  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [viewingMembersWorkspace, setViewingMembersWorkspace] =
    useState<any>(null);

  const handleSwitch = (workspace: any) => {
    if (currentWorkspace?.id === workspace.id) {
      navigation.navigate(NAV_ROUTES.WORKSPACE_EDIT.NAME, {
        workspaceId: workspace.id,
      });
      return;
    }

    showModal({
      type: 'confirm',
      title: '공간 전환',
      message: `'${workspace.name}'으로 지금 바로 이동할까요?`,
      confirmText: '전환하기',
      cancelText: '취소',
      onConfirm: () => {
        setCurrentWorkspace(workspace);
      },
    });
  };

  const handleEditWorkspace = (workspaceId: string) => {
    navigation.navigate(NAV_ROUTES.WORKSPACE_EDIT.NAME, { workspaceId });
  };

  const handleViewMembers = (workspace: any) => {
    setViewingMembersWorkspace(workspace);
    setMemberModalVisible(true);
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>내 {APP_WORKSPACE.KR} 목록</Text>
            <TouchableOpacity
              onPress={() => {
                initMockData();
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
            참여 중인 라이프룸을 전환하거나 관리할 수 있습니다.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {workspaces.map(ws => {
            const isActive = currentWorkspace?.id === ws.id;
            const dDay =
              ws.type === 'couple' && ws.startDate
                ? calculateDDay(ws.startDate)
                : null;

            return (
              <TouchableOpacity
                key={ws.id}
                style={[styles.workspaceCard]}
                onPress={() => handleSwitch(ws)}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <View style={styles.iconWrapper}>
                    {ws.type === 'couple' ? (
                      <Heart
                        size={20}
                        color={isActive ? COLORS.primary : COLORS.textTertiary}
                        fill={isActive ? COLORS.primary : 'transparent'}
                      />
                    ) : (
                      <Users
                        size={20}
                        color={isActive ? COLORS.primary : COLORS.textTertiary}
                      />
                    )}
                  </View>
                  <View style={styles.wsInfo}>
                    <View style={styles.nameRow}>
                      <Text
                        style={[
                          styles.wsName,
                          isActive && { color: COLORS.primary },
                        ]}
                      >
                        {ws.name}
                      </Text>
                      {dDay !== null && (
                        <View style={styles.ddayTag}>
                          <Text style={styles.ddayTagText}>D+{dDay}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.wsSubInfo}>
                      <Text style={styles.wsType}>
                        {ws.type === 'couple' ? '커플' : '단체'} 라이프룸
                      </Text>
                      {isActive && (
                        <View style={styles.activeLabel}>
                          <View style={styles.activeDot} />
                          <Text style={styles.activeText}>사용 중</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.manageBtn}
                    onPress={() => handleEditWorkspace(ws.id)}
                  >
                    <Settings size={18} color={COLORS.textTertiary} />
                    <Text style={styles.manageBtnText}>관리</Text>
                  </TouchableOpacity>
                </View>

                {/* 멤버 요약 섹션 */}
                <TouchableOpacity
                  style={styles.cardBottom}
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
                                    { backgroundColor: COLORS.skeleton },
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
                  <Text style={styles.memberSummary}>
                    {ws.members?.length || 1}명의 멤버가 함께 기록 중
                  </Text>
                  <ChevronRight size={16} color={COLORS.border} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
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

      {/* 전체 멤버 보기 모달 */}
      <Modal
        visible={memberModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMemberModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMemberModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, styles.memberModalContent]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitleInline}>참여 중인 멤버</Text>
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
                          <Text style={styles.avatarInitialLarge}>
                            {member.name.charAt(0)}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.memberInfoFull}>
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
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 24,
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
    gap: 12,
    marginBottom: 32,
  },
  workspaceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  wsInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  wsName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ddayTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ddayTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  wsSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wsType: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F3FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: 4,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background + '50',
    padding: 12,
    borderRadius: 16,
  },
  memberAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  avatarBorder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    overflow: 'hidden',
  },
  firstAvatar: {
    zIndex: 3,
  },
  stackedAvatar: {
    marginLeft: -8,
  },
  miniAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  moreBadge: {
    backgroundColor: COLORS.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  moreText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  memberSummary: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 18,
    gap: 8,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    width: '100%',
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },
  memberModalContent: {
    maxHeight: '70%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.skeleton,
    borderRadius: 2.5,
    marginBottom: 16,
  },
  modalTitleInline: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  memberListScroll: {
    marginTop: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  memberAvatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
  },
  memberAvatarFull: {
    width: '100%',
    height: '100%',
  },
  memberAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  memberInfoFull: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberNameFull: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  meTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  meTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  closeButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});

export default WorkspaceListScreen;
