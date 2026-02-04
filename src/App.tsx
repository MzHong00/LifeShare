import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/lib/reactNativeCalendars';
import { GoogleOAuthService } from '@/businesses/oauth/google/googleOAuthService';
import AppNavigator from '@/navigations/AppNavigator';
import CustomModal from '@/components/common/CustomModal';
import { Toast } from '@/components/common/Toast';

const queryClient = new QueryClient();
GoogleOAuthService.initGoogleOAuth();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

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

export default App;
