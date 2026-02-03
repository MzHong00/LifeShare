import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import {
  HomeIconWrapper,
  MapIconWrapper,
  ChatIconWrapper,
} from '@/components/navigation/TabIcons';
import ChatScreen from '@/screens/chat/ChatScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import MapScreen from '@/screens/map/MapScreen';

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName={NAV_ROUTES.HOME.NAME}
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#191F28',
        tabBarInactiveTintColor: '#8B95A1',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: insets.bottom > 0 ? 0 : 4,
        },
        tabBarBadgeStyle: {
          minWidth: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tab.Screen
        name={NAV_ROUTES.CHAT.NAME}
        component={ChatScreen}
        options={{
          tabBarLabel: NAV_ROUTES.CHAT.TITLE,
          tabBarIcon: ChatIconWrapper,
          tabBarBadge: 1,
        }}
      />
      <Tab.Screen
        name={NAV_ROUTES.HOME.NAME}
        component={HomeScreen}
        options={{
          tabBarLabel: NAV_ROUTES.HOME.TITLE,
          tabBarIcon: HomeIconWrapper,
        }}
      />
      <Tab.Screen
        name={NAV_ROUTES.LOCATION.NAME}
        component={MapScreen}
        options={{
          tabBarLabel: NAV_ROUTES.LOCATION.TITLE,
          tabBarIcon: MapIconWrapper,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;
