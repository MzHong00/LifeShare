import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Users, Plus, UserPlus, Heart, Mail, Send } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { APP_WORKSPACE } from '@/constants/config';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
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

  const userEmail = 'user@example.com'; // 임시: 이메일 정보 위치 확인 필요
  const workspaces = useWorkspaceStore(state => state.workspaces);
  const createNewWorkspace = useWorkspaceStore(
    state => state.createNewWorkspace,
  );
  const sendInvitation = useWorkspaceStore(state => state.sendInvitation);

  const completeSetup = () => {
    if (!workspaceName.trim()) {
      Alert.alert('알림', `${APP_WORKSPACE.KR} 이름을 입력해주세요.`);
      return;
    }

    const workspaceId = createNewWorkspace(workspaceName, roomType, isMain);
    setCreatedWorkspaceId(workspaceId);
    setStep('invite');
  };

  const handleSendInvite = () => {
    if (!inviteeEmail.trim()) {
      Alert.alert('알림', '초대할 파트너의 이메일을 입력해주세요.');
      return;
    }

    if (createdWorkspaceId && userEmail) {
      sendInvitation(
        createdWorkspaceId,
        workspaceName,
        userEmail,
        inviteeEmail.trim(),
      );
      Alert.alert('알림', '초대가 전송되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME),
        },
      ]);
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

  const renderInitial = () => (
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
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setStep('create')}
        >
          <Plus size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.mainButtonText}>
            새로운 {APP_WORKSPACE.KR} 만들기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreate = () => (
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
          onPress={
            createSubStep === 'type'
              ? () => {
                  setWorkspaceName('');
                  setCreateSubStep('name');
                }
              : completeSetup
          }
        >
          <Text style={styles.mainButtonText}>
            {createSubStep === 'type' ? '다음' : '시작하기'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>이전으로</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInvite = () => (
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
          <Mail
            size={20}
            color={COLORS.textTertiary}
            style={styles.inputIcon}
          />
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
        <TouchableOpacity style={styles.mainButton} onPress={handleSendInvite}>
          <Send size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.mainButtonText}>초대 이메일 보내기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME)}
        >
          <Text style={styles.backButtonText}>나중에 하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AppSafeAreaView style={styles.container}>
      {step === 'initial' && renderInitial()}
      {step === 'create' && renderCreate()}
      {step === 'invite' && renderInvite()}
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
