import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { NAV_ROUTES } from '@/constants/navigation';
import LoginScreen from '@/screens/auth/LoginScreen';
import CalendarScreen from '@/screens/calendar/CalendarScreen';
import EventCreateScreen from '@/screens/calendar/EventCreateScreen';
import TodoScreen from '@/screens/todo/TodoScreen';
import TodoCreateScreen from '@/screens/todo/TodoCreateScreen';
import StoriesScreen from '@/screens/stories/StoriesScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import ProfileEditScreen from '@/screens/profile/ProfileEditScreen';
import MainTabScreen from '@/screens/main/MainTabScreen';
import WorkspaceLandingScreen from '@/screens/workspace/WorkspaceLandingScreen';
import WorkspaceSetupScreen from '@/screens/workspace/WorkspaceSetupScreen';
import WorkspaceListScreen from '@/screens/workspace/WorkspaceListScreen';
import ProUpgradeScreen from '@/screens/upgrade/ProUpgradeScreen';
import PlanManagementScreen from '@/screens/profile/PlanManagementScreen';
import StoryEditScreen from '@/screens/stories/StoryEditScreen';
import StoryDetailScreen from '@/screens/stories/StoryDetailScreen';
import WorkspaceEditScreen from '@/screens/workspace/WorkspaceEditScreen';
import AnniversaryScreen from '@/screens/home/AnniversaryScreen';
import PrivacyPolicyScreen from '@/screens/profile/PrivacyPolicyScreen';
import PersonalSettingsScreen from '@/screens/profile/PersonalSettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuthStore();
  const { workspaces } = useWorkspaceStore();

  const hasWorkspace = (workspaces || []).length !== 0;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // 1. 미인증 상태
          <Stack.Screen name={NAV_ROUTES.LOGIN.NAME} component={LoginScreen} />
        ) : (
          // 2. 인증된 상태 (로그인 완료)
          <>
            {/* 진입점 설정: 라이프룸 유무에 따른 분기 */}
            {!hasWorkspace ? (
              <Stack.Screen
                name={NAV_ROUTES.WORKSPACE_LANDING.NAME}
                component={WorkspaceLandingScreen}
              />
            ) : (
              <Stack.Screen
                name={NAV_ROUTES.MAIN_TABS.NAME}
                component={MainTabScreen}
              />
            )}

            {/* 메인 기능 화면들 (라이프룸이 있을 때만 유효함) */}
            {hasWorkspace && (
              <>
                <Stack.Screen
                  name={NAV_ROUTES.CALENDAR.NAME}
                  component={CalendarScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.EVENT_CREATE.NAME}
                  component={EventCreateScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.TODO.NAME}
                  component={TodoScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.TODO_CREATE.NAME}
                  component={TodoCreateScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.STORIES.NAME}
                  component={StoriesScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.STORY_EDIT.NAME}
                  component={StoryEditScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.STORY_DETAIL.NAME}
                  component={StoryDetailScreen}
                />
                <Stack.Screen
                  name={NAV_ROUTES.ANNIVERSARY.NAME}
                  component={AnniversaryScreen}
                />
              </>
            )}

            {/* 공통 화면들 (워크스페이스 유무와 상관없이 항상 필요) */}
            <Stack.Screen
              name={NAV_ROUTES.PROFILE.NAME}
              component={ProfileScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.PROFILE_EDIT.NAME}
              component={ProfileEditScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.WORKSPACE_SETUP.NAME}
              component={WorkspaceSetupScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.WORKSPACE_LIST.NAME}
              component={WorkspaceListScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.PRO_UPGRADE.NAME}
              component={ProUpgradeScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.WORKSPACE_EDIT.NAME}
              component={WorkspaceEditScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.PLAN_MANAGEMENT.NAME}
              component={PlanManagementScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.PRIVACY_POLICY.NAME}
              component={PrivacyPolicyScreen}
            />
            <Stack.Screen
              name={NAV_ROUTES.PERSONAL_SETTINGS.NAME}
              component={PersonalSettingsScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
