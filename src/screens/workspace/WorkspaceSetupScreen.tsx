import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Users, Plus, UserPlus, Heart, Mail, Send } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { APP_WORKSPACE } from '@/constants/config';
import {
  useWorkspaceStore,
  workspaceActions,
} from '@/stores/useWorkspaceStore';
import { modalActions } from '@/stores/useModalStore';
import { getTodayDateString } from '@/utils/date';
import Checkbox from '@/components/common/Checkbox';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';

type RootStackParamList = {
  [NAV_ROUTES.MAIN_TABS.NAME]: undefined;
  [NAV_ROUTES.WORKSPACE_SETUP.NAME]:
    | {
        workspaceId?: string;
        workspaceName?: string;
      }
    | undefined;
};

type WorkspaceSetupRouteProp = RouteProp<
  RootStackParamList,
  typeof NAV_ROUTES.WORKSPACE_SETUP.NAME
>;

interface InitialStageProps {
  onNext: () => void;
}

const InitialStage = ({ onNext }: InitialStageProps) => (
  <View style={styles.content}>
    <View style={styles.mainBody}>
      <View style={styles.iconCircle}>
        <Users size={40} color={COLORS.primary} strokeWidth={2.5} />
      </View>
      <Text style={styles.title}>{APP_WORKSPACE.KR} 만들기</Text>
      <Text style={styles.description}>
        우리만의 새로운 {APP_WORKSPACE.KR}을 만들고{'\n'}파트너를 초대하여
        일상과 기록을 공유하세요.
      </Text>
    </View>

    <View style={styles.footer}>
      <TouchableOpacity style={styles.mainButton} onPress={onNext}>
        <Plus size={20} color={COLORS.white} style={styles.buttonIcon} />
        <Text style={styles.mainButtonText}>
          새로운 {APP_WORKSPACE.KR} 만들기
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface CreateStageProps {
  createSubStep: 'type' | 'name';
  roomType: 'couple' | 'group';
  workspaceName: string;
  startDate: string;
  isFirst: boolean;
  isMain: boolean;
  setRoomType: (type: 'couple' | 'group') => void;
  setWorkspaceName: (name: string) => void;
  setStartDate: (date: string) => void;
  setIsMain: (isMain: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const CreateStage = ({
  createSubStep,
  roomType,
  workspaceName,
  startDate,
  isFirst,
  isMain,
  setRoomType,
  setWorkspaceName,
  setStartDate,
  setIsMain,
  onNext,
  onBack,
  onComplete,
}: CreateStageProps) => (
  <View style={styles.content}>
    <View style={styles.mainBody}>
      {createSubStep === 'type' ? (
        <>
          <Text style={styles.title}>유형 선택</Text>
          <Text style={styles.description}>
            누구와 함께하는 {APP_WORKSPACE.KR}인가요?{'\n'}나중에 변경할 수
            없으니 신중히 골라주세요.
          </Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                roomType === 'couple' && styles.typeButtonActive,
                styles.typeButtonFirst,
              ]}
              onPress={() => setRoomType('couple')}
              activeOpacity={0.8}
            >
              <Heart
                size={24}
                color={
                  roomType === 'couple' ? COLORS.primary : COLORS.textTertiary
                }
                fill={roomType === 'couple' ? COLORS.primary : 'transparent'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  roomType === 'couple' && styles.typeButtonTextActive,
                ]}
              >
                커플 라이프룸
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                roomType === 'group' && styles.typeButtonActive,
              ]}
              onPress={() => setRoomType('group')}
              activeOpacity={0.8}
            >
              <Users
                size={24}
                color={
                  roomType === 'group' ? COLORS.primary : COLORS.textTertiary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  roomType === 'group' && styles.typeButtonTextActive,
                ]}
              >
                단체 라이프룸
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>이름 설정</Text>
          <Text style={styles.description}>
            우리만의 특별한 {APP_WORKSPACE.KR} 이름을{'\n'}지어주세요.
          </Text>

          <TextInput
            style={styles.input}
            placeholder={`${APP_WORKSPACE.KR} 이름을 입력하세요`}
            value={workspaceName}
            onChangeText={setWorkspaceName}
            placeholderTextColor={COLORS.textTertiary}
            autoFocus
          />

          <Text style={[styles.inputLabel, styles.labelMarginTop]}>
            {roomType === 'couple' ? '만난 날짜' : '시작일'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="numeric"
          />

          <Checkbox
            label={`메인 ${APP_WORKSPACE.KR}으로 설정`}
            checked={isFirst || isMain}
            onPress={() => !isFirst && setIsMain(!isMain)}
            disabled={isFirst}
            style={styles.checkboxSpace}
          />
        </>
      )}
    </View>

    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.mainButton}
        onPress={createSubStep === 'type' ? onNext : onComplete}
      >
        <Text style={styles.mainButtonText}>
          {createSubStep === 'type' ? '다음' : '시작하기'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>이전으로</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface InviteStageProps {
  workspaceName: string;
  inviteeEmail: string;
  setInviteeEmail: (email: string) => void;
  onSendInvite: () => void;
  onLater: () => void;
}

const InviteStage = ({
  workspaceName,
  inviteeEmail,
  setInviteeEmail,
  onSendInvite,
  onLater,
}: InviteStageProps) => (
  <View style={styles.content}>
    <View style={styles.mainBody}>
      <View style={styles.iconCircle}>
        <UserPlus size={40} color={COLORS.primary} strokeWidth={2.5} />
      </View>
      <Text style={styles.title}>파트너 초대하기</Text>
      <Text style={styles.description}>
        {workspaceName}이(가) 생성되었습니다!{'\n'}파트너의 이메일을 입력하여
        초대를 보내보세요.
      </Text>

      <View style={styles.inputWrapper}>
        <Mail size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
        <TextInput
          style={styles.emailInput}
          placeholder="파트너의 이메일 주소"
          value={inviteeEmail}
          onChangeText={setInviteeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={COLORS.textTertiary}
        />
      </View>
    </View>

    <View style={styles.footer}>
      <TouchableOpacity style={styles.mainButton} onPress={onSendInvite}>
        <Send size={20} color={COLORS.white} style={styles.buttonIcon} />
        <Text style={styles.mainButtonText}>초대 이메일 보내기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onLater}>
        <Text style={styles.backButtonText}>나중에 하기</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const WorkspaceSetupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<WorkspaceSetupRouteProp>();
  const [step, setStep] = useState<'initial' | 'create' | 'invite'>(
    route.params?.workspaceId ? 'invite' : 'initial',
  );
  const [workspaceName, setWorkspaceName] = useState(
    route.params?.workspaceName || '',
  );
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(
    route.params?.workspaceId || null,
  );
  const [isMain, setIsMain] = useState(true);
  const [roomType, setRoomType] = useState<'couple' | 'group'>('couple');
  const [createSubStep, setCreateSubStep] = useState<'type' | 'name'>('type');
  const [startDate, setStartDate] = useState(getTodayDateString());

  const userEmail = 'user@example.com'; // 임시: 이메일 정보 위치 확인 필요
  const { workspaces } = useWorkspaceStore();
  const { createNewWorkspace, sendInvitation } = workspaceActions;
  const { showModal } = modalActions;

  const completeSetup = () => {
    if (!workspaceName.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: `${APP_WORKSPACE.KR} 이름을 입력해주세요.`,
      });
      return;
    }

    const workspaceId = createNewWorkspace(
      workspaceName,
      roomType,
      isMain,
      startDate,
    );
    setCreatedWorkspaceId(workspaceId);
    setStep('invite');
  };

  const handleSendInvite = () => {
    if (!inviteeEmail.trim()) {
      showModal({
        type: 'alert',
        title: '알림',
        message: '초대할 파트너의 이메일을 입력해주세요.',
      });
      return;
    }

    if (createdWorkspaceId && userEmail) {
      sendInvitation(
        createdWorkspaceId,
        workspaceName,
        userEmail,
        inviteeEmail.trim(),
      );
      showModal({
        type: 'alert',
        title: '알림',
        message: '초대가 전송되었습니다.',
        onConfirm: () => navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME),
      });
    }
  };

  const isFirst = workspaces.length === 0;

  const handleBack = () => {
    if (step === 'create' && createSubStep === 'name') {
      setCreateSubStep('type');
    } else {
      setStep('initial');
      setCreateSubStep('type');
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      {step === 'initial' && <InitialStage onNext={() => setStep('create')} />}
      {step === 'create' && (
        <CreateStage
          createSubStep={createSubStep}
          roomType={roomType}
          workspaceName={workspaceName}
          startDate={startDate}
          isFirst={isFirst}
          isMain={isMain}
          setRoomType={setRoomType}
          setWorkspaceName={setWorkspaceName}
          setStartDate={setStartDate}
          setIsMain={setIsMain}
          onNext={() => {
            setWorkspaceName('');
            setCreateSubStep('name');
          }}
          onBack={handleBack}
          onComplete={completeSetup}
        />
      )}
      {step === 'invite' && (
        <InviteStage
          workspaceName={workspaceName}
          inviteeEmail={inviteeEmail}
          setInviteeEmail={setInviteeEmail}
          onSendInvite={handleSendInvite}
          onLater={() => navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME)}
        />
      )}
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
  },
  mainBody: {
    flex: 1,
    paddingTop: 40,
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.header1,
    fontSize: 28,
    marginBottom: SPACING.md,
    textAlign: 'left',
  },
  description: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 40,
  },
  mainButton: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  outlineButton: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginTop: 8,
  },
  outlineButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  buttonIcon: {
    marginRight: 8,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'left',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  labelMarginTop: {
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: COLORS.textTertiary,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    color: COLORS.textTertiary,
    fontSize: 16,
  },
  checkboxSpace: {
    marginBottom: 32,
    paddingLeft: 4,
  },
  typeSelector: {
    width: '100%',
    marginBottom: 40,
  },
  typeButton: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.background,
    gap: 16,
  },
  typeButtonFirst: {
    marginBottom: 12,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  typeButtonTextActive: {
    color: COLORS.primary,
  },
  inviteCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    marginTop: 8,
  },
  inviteCodeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginBottom: 8,
  },
  inviteCodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inviteCodeText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  copyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  inputWrapper: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  emailInput: {
    flex: 1,
    height: '100%',
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});

export default WorkspaceSetupScreen;
