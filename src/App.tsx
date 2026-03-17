import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import '@/lib/reactNativeCalendars';
import { sentry } from '@/lib/sentry';
import { googleOAuthService } from '@/businesses/oauth/google/googleOAuthService';
import AppNavigator from '@/navigations/AppNavigator';
import CustomModal from '@/components/common/CustomModal';
import { Toast } from '@/components/common/Toast';

sentry.init();
googleOAuthService.initGoogleOAuth();
const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // 앱 시작 시 Android 시스템 내비게이션 바 투명화 (Edge-to-Edge)
    if (Platform.OS === 'android') {
      SystemNavigationBar.setNavigationColor('transparent', 'dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor="transparent"
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <AppNavigator />
        <CustomModal />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default sentry.wrap(App);
