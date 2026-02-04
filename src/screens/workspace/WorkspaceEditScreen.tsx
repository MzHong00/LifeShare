import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronRight, Trash2, User, UserPlus } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';

// 캘린더 한국어 설정
LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { APP_WORKSPACE } from '@/constants/config';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { Section } from '@/components/common/Section';
import { useAppModal } from '@/hooks/useAppModal';

type WorkspaceEditRouteProp = RouteProp<
  { params: { workspaceId: string } },
  'params'
>;

const WorkspaceEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<WorkspaceEditRouteProp>();
  const { workspaceId } = route.params;

  const { workspaces } = useWorkspaceStore();
  const { removeWorkspace } = workspaceActions;
  const { openModal, closeModal, updateModal } = useAppModal();

  const workspace = workspaces.find(ws => ws.id === workspaceId);

  if (!workspace) return null;

  const currentName = workspace.name;
  const currentStartDate = workspace.startDate;

  const handleDelete = () => {
    openModal({
      type: 'confirm',
      title: `${APP_WORKSPACE.KR}에서 나가기`,
      message: `정말로 '${workspace?.name}' ${APP_WORKSPACE.KR}에서 나갈까요?\n기존에 기록된 데이터는 삭제되지 않지만 목록에서 사라집니다.`,
      confirmText: '나가기',
      cancelText: '취소',
      onConfirm: () => {
        removeWorkspace(workspaceId);
        navigation.goBack();
      },
    });
  };

  const handleDayPress = (day: DateData) => {
    workspaceActions.updateWorkspaceStartDate(workspaceId, day.dateString);
    closeModal();
  };

  const handleUpdateProfile = (newName: string) => {
    if (!newName.trim()) {
      openModal({
        type: 'alert',
        title: '알림',
        message: '이름을 입력해주세요.',
      });
      return;
    }
    workspaceActions.updateMemberProfile(workspaceId, 'user-1', {
      name: newName.trim(),
    });
    closeModal();
    openModal({
      type: 'alert',
      title: '완료',
      message: '프로필이 수정되었습니다.',
    });
  };

  const handleSendInvite = (email: string) => {
    if (!email.trim() || !email.includes('@')) {
      openModal({
        type: 'alert',
        title: '알림',
        message: '올바른 이메일 주소를 입력해주세요.',
      });
      return;
    }
    workspaceActions.sendInvitation(
      workspaceId,
      workspace?.name || '',
      'user@example.com',
      email.trim(),
    );
    closeModal();
    openModal({
      type: 'alert',
      title: '초대 전송',
      message: '파트너에게 초대 이메일을 보냈습니다.',
    });
  };

  const openWorkspaceNameEditModal = () => {
    let inputName = workspace?.name || '';

    openModal({
      type: 'confirm',
      title: '라이프룸 제목 수정',
      confirmText: '수정하기',
      confirmDisabled: !inputName.trim(),
      content: (
        <View style={styles.modalContentWrapper}>
          <Text style={styles.modalDesc}>이 공간의 이름을 입력해주세요.</Text>
          <TextInput
            style={styles.modalInput}
            defaultValue={inputName}
            onChangeText={text => {
              inputName = text;
              updateModal({ confirmDisabled: !text.trim() });
            }}
            placeholder="제목 입력"
            autoFocus
          />
        </View>
      ),
      onConfirm: () => {
        workspaceActions.updateWorkspaceName(workspaceId, inputName.trim());
      },
    });
  };

  const openProfileEditModal = () => {
    const initialName =
      workspace?.members?.find(m => m.id === 'user-1')?.name || '';
    let inputMemberName = initialName;

    openModal({
      type: 'confirm',
      title: '내 활동 프로필 설정',
      confirmText: '수정하기',
      confirmDisabled: !initialName.trim(), // 초기 이름이 없으면 비활성화
      content: (
        <View style={styles.modalContentWrapper}>
          <Text style={styles.modalDesc}>
            이 공간에서 사용할 이름을 입력해주세요.
          </Text>
          <TextInput
            style={styles.modalInput}
            defaultValue={initialName}
            onChangeText={text => {
              inputMemberName = text;
              updateModal({ confirmDisabled: !text.trim() });
            }}
            placeholder="이름 입력"
            autoFocus
          />
        </View>
      ),
      onConfirm: () => handleUpdateProfile(inputMemberName),
    });
  };

  const openInvitePartnerModal = () => {
    let currentEmail = '';

    openModal({
      type: 'confirm',
      title: '파트너 초대하기',
      confirmText: '초대하기',
      confirmDisabled: true, // 초기값 비활성화
      content: (
        <View style={styles.modalContentWrapper}>
          <Text style={styles.modalDesc}>
            {APP_WORKSPACE.KR}에 소셜 로그인을 통해 가입한 파트너의 이메일
            주소를 입력하면{'\n'}초대 링크가 전송됩니다.
          </Text>
          <TextInput
            style={styles.modalInput}
            onChangeText={text => {
              currentEmail = text;
              const isValid = text.trim().includes('@');
              updateModal({ confirmDisabled: !isValid });
            }}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
        </View>
      ),
      onConfirm: () => handleSendInvite(currentEmail),
    });
  };

  const openCalendarModal = () => {
    openModal({
      type: 'none',
      title: '날짜 선택',
      content: (
        <View style={styles.modalContentWrapper}>
          <Calendar
            current={currentStartDate || undefined}
            onDayPress={handleDayPress}
            monthFormat={'yyyy년 MM월'}
            markedDates={{
              [currentStartDate || '']: {
                selected: true,
                selectedColor: COLORS.primary,
              },
            }}
            theme={{
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: COLORS.white,
              todayTextColor: COLORS.primary,
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textPrimary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '700',
            }}
          />
        </View>
      ),
    });
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 헤더 섹션: 현재 상태 표시 */}
          <View style={styles.headerInfo}>
            <View
              style={[
                styles.typeBadge,
                workspace?.type === 'couple'
                  ? styles.typeBadgeCouple
                  : styles.typeBadgeGroup,
              ]}
            >
              <Text
                style={[
                  styles.typeBadgeText,
                  workspace?.type === 'couple'
                    ? styles.typeTextCouple
                    : styles.typeTextGroup,
                ]}
              >
                {workspace?.type === 'couple' ? '커플' : '단체'}{' '}
                {APP_WORKSPACE.KR}
              </Text>
            </View>
            <TouchableOpacity
              onPress={openWorkspaceNameEditModal}
              activeOpacity={0.7}
            >
              <Text style={styles.headerMainTitle}>{workspace?.name}</Text>
            </TouchableOpacity>
          </View>

          {/* 기본 정보 설정 */}
          <Section title="기본 설정" style={styles.sectionOverride}>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.inputRow}
                activeOpacity={0.6}
                onPress={openWorkspaceNameEditModal}
              >
                <Text style={styles.inputLabel}>라이프룸 제목</Text>
                <Text
                  style={[
                    styles.textInput,
                    !currentName && { color: COLORS.textTertiary },
                  ]}
                >
                  {currentName || '제목 입력'}
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.inputRow}
                activeOpacity={0.6}
                onPress={() => openCalendarModal()}
              >
                <Text style={styles.inputLabel}>함께한 날</Text>
                <Text
                  style={[
                    styles.textInput,
                    !currentStartDate && { color: COLORS.textTertiary },
                  ]}
                >
                  {currentStartDate || '날짜 선택'}
                </Text>
              </TouchableOpacity>
            </View>
          </Section>

          {/* 멤버 및 도구 */}
          <Section title="멤버 및 도구" style={styles.sectionOverride}>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.6}
                onPress={openProfileEditModal}
              >
                <View style={[styles.menuIcon, styles.menuIconProfile]}>
                  <User size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.menuText}>내 활동 프로필 설정</Text>
                <ChevronRight size={18} color={COLORS.border} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.6}
                onPress={openInvitePartnerModal}
              >
                <View style={[styles.menuIcon, styles.menuIconInvite]}>
                  <UserPlus size={18} color="#22C55E" />
                </View>
                <Text style={styles.menuText}>파트너 초대하기</Text>
                <Text style={styles.menuSubText}>
                  {workspace?.members?.length || 0}명 참여 중
                </Text>
                <ChevronRight size={18} color={COLORS.border} />
              </TouchableOpacity>
            </View>
          </Section>

          {/* 위험 구역 */}
          <Section title="위험 구역" style={styles.sectionOverride}>
            <View style={styles.dangerCard}>
              <TouchableOpacity
                style={styles.dangerItem}
                activeOpacity={0.6}
                onPress={handleDelete}
              >
                <View style={styles.dangerTextContent}>
                  <Text style={styles.dangerTitle}>
                    {APP_WORKSPACE.KR}에서 나가기
                  </Text>
                  <Text style={styles.dangerDesc}>
                    데이터는 유지되지만 리스트에서 사라집니다.
                  </Text>
                </View>
                <Trash2 size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </Section>

          <View style={styles.footerInfo}>
            <Text style={styles.footerNote}>
              각 공간의 설정은 해당 공간에 참여한 멤버들끼리만{'\n'}
              공유되며 안전하게 보호됩니다.
            </Text>
          </View>
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40,
  },
  headerInfo: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  typeBadgeCouple: {
    backgroundColor: '#FFF0F0',
  },
  typeBadgeGroup: {
    backgroundColor: '#F0F4FF',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  typeTextCouple: {
    color: '#FF4D4D',
  },
  typeTextGroup: {
    color: COLORS.primary,
  },
  headerMainTitle: {
    ...TYPOGRAPHY.header1,
    fontSize: 26,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionOverride: {
    paddingHorizontal: 0, // Section 컴포넌트 내부 패딩 상쇄 (필요시)
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
      },
      android: { elevation: 2 },
    }),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '400',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconProfile: {
    backgroundColor: '#F0F4FF',
  },
  menuIconInvite: {
    backgroundColor: '#F0FFF4',
  },
  menuIconSwitch: {
    backgroundColor: '#F4F4F4',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  menuSubText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginRight: 8,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 4,
    borderColor: '#FFEBEB',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
      },
      android: { elevation: 2 },
    }),
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  dangerTextContent: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
    marginBottom: 4,
  },
  dangerDesc: {
    fontSize: 12,
    color: COLORS.textTertiary,
    lineHeight: 18,
  },
  footerInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  calendarHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalContentWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  modalTitle: {
    ...TYPOGRAPHY.header2,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textTertiary,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 20,
    width: '100%',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 8,
  },
  modalBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: COLORS.background,
  },
  modalConfirmBtn: {
    backgroundColor: COLORS.primary,
  },
  modalCancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalConfirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default WorkspaceEditScreen;
