import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MessageCircle, Home, MapPin } from 'lucide-react-native';

import HomeScreen from '@/screens/home/HomeScreen';
import CalendarScreen from '@/screens/calendar/CalendarScreen';
import TodoScreen from '@/screens/todo/TodoScreen';
import ChatScreen from '@/screens/chat/ChatScreen';
import MapScreen from '@/screens/map/MapScreen';
import MemoriesScreen from '@/screens/memories/MemoriesScreen';
import { COLORS } from '@/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#191F28',
        tabBarInactiveTintColor: '#8B95A1',
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: '채팅',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} strokeWidth={2.3} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={2.3} />
          ),
        }}
      />
      <Tab.Screen
        name="Location"
        component={MapScreen}
        options={{
          tabBarLabel: '위치',
          tabBarIcon: ({ color, size }) => (
            <MapPin color={color} size={size} strokeWidth={2.3} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ headerShown: true, title: '캘린더' }}
        />
        <Stack.Screen
          name="Todo"
          component={TodoScreen}
          options={{ headerShown: true, title: '할 일' }}
        />
        <Stack.Screen
          name="Memories"
          component={MemoriesScreen}
          options={{ headerShown: true, title: '추억' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
