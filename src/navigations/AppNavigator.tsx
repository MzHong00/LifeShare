import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';

import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { COLORS } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import LoginScreen from '@/screens/auth/LoginScreen';
import CalendarScreen from '@/screens/calendar/CalendarScreen';
import EventCreateScreen from '@/screens/calendar/EventCreateScreen';
import TodoScreen from '@/screens/todo/TodoScreen';
import TodoCreateScreen from '@/screens/todo/TodoCreateScreen';
import MemoriesScreen from '@/screens/memories/MemoriesScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import ProfileEditScreen from '@/screens/profile/ProfileEditScreen';
import MainTabScreen from '@/screens/main/MainTabScreen';
import WorkspaceLandingScreen from '@/screens/workspace/WorkspaceLandingScreen';
import WorkspaceSetupScreen from '@/screens/workspace/WorkspaceSetupScreen';
import WorkspaceListScreen from '@/screens/workspace/WorkspaceListScreen';
import ProUpgradeScreen from '@/screens/upgrade/ProUpgradeScreen';
import PlanManagementScreen from '@/screens/profile/PlanManagementScreen';
import MemoryEditScreen from '@/screens/memories/MemoryEditScreen';
import MemoryDetailScreen from '@/screens/memories/MemoryDetailScreen';

const Stack = createStackNavigator();

/**
 * 공통 헤더 스타일 옵션
 */
const COMMON_HEADER_OPTIONS: StackNavigationOptions = {
  title: '',
  headerShown: true,
  headerTitleStyle: { fontWeight: '600' },
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
  },
  cardStyle: { backgroundColor: COLORS.white },
};

const BACKGROUND_COLOR_HEADER_OPTIONS: StackNavigationOptions = {
  ...COMMON_HEADER_OPTIONS,
  headerStyle: {
    ...COMMON_HEADER_OPTIONS.headerStyle,
    backgroundColor: COLORS.background,
  },
  cardStyle: { backgroundColor: COLORS.background },
};

const AppNavigator = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const workspaces = useWorkspaceStore(state => state.workspaces);

  const hasWorkspace = workspaces.length !== 0;

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
                  options={{
                    ...COMMON_HEADER_OPTIONS,
                  }}
                />
                <Stack.Screen
                  name={NAV_ROUTES.EVENT_CREATE.NAME}
                  component={EventCreateScreen}
                  options={{
                    ...COMMON_HEADER_OPTIONS,
                    title: NAV_ROUTES.EVENT_CREATE.TITLE,
                  }}
                />
                <Stack.Screen
                  name={NAV_ROUTES.TODO.NAME}
                  component={TodoScreen}
                  options={{
                    ...COMMON_HEADER_OPTIONS,
                    title: NAV_ROUTES.TODO.TITLE,
                  }}
                />
                <Stack.Screen
                  name={NAV_ROUTES.TODO_CREATE.NAME}
                  component={TodoCreateScreen}
                  options={{
                    ...COMMON_HEADER_OPTIONS,
                    title: NAV_ROUTES.TODO_CREATE.TITLE,
                  }}
                />
                <Stack.Screen
                  name={NAV_ROUTES.MEMORIES.NAME}
                  component={MemoriesScreen}
                  options={{
                    ...BACKGROUND_COLOR_HEADER_OPTIONS,
                  }}
                />
                <Stack.Screen
                  name={NAV_ROUTES.MEMORY_EDIT.NAME}
                  component={MemoryEditScreen}
                  options={{
                    ...COMMON_HEADER_OPTIONS,
                    title: NAV_ROUTES.MEMORY_EDIT.TITLE,
                  }}
                />
                <Stack.Screen
                  name={NAV_ROUTES.MEMORY_DETAIL.NAME}
                  component={MemoryDetailScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}

            {/* 공통 화면들 (워크스페이스 유무와 상관없이 항상 필요) */}
            <Stack.Screen
              name={NAV_ROUTES.PROFILE.NAME}
              component={ProfileScreen}
              options={{
                ...COMMON_HEADER_OPTIONS,
              }}
            />
            <Stack.Screen
              name={NAV_ROUTES.PROFILE_EDIT.NAME}
              component={ProfileEditScreen}
              options={{
                ...COMMON_HEADER_OPTIONS,
                title: NAV_ROUTES.PROFILE_EDIT.TITLE,
              }}
            />
            <Stack.Screen
              name={NAV_ROUTES.WORKSPACE_SETUP.NAME}
              component={WorkspaceSetupScreen}
              options={{
                ...COMMON_HEADER_OPTIONS,
                title: NAV_ROUTES.WORKSPACE_SETUP.TITLE,
              }}
            />
            <Stack.Screen
              name={NAV_ROUTES.WORKSPACE_LIST.NAME}
              component={WorkspaceListScreen}
              options={{
                ...COMMON_HEADER_OPTIONS,
              }}
            />
            <Stack.Screen
              name={NAV_ROUTES.PRO_UPGRADE.NAME}
              component={ProUpgradeScreen}
              options={{
                ...BACKGROUND_COLOR_HEADER_OPTIONS,
              }}
            />
            <Stack.Screen
              name={NAV_ROUTES.PLAN_MANAGEMENT.NAME}
              component={PlanManagementScreen}
              options={{
                ...BACKGROUND_COLOR_HEADER_OPTIONS,
                title: NAV_ROUTES.PLAN_MANAGEMENT.TITLE,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
