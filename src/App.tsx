import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/lib/reactNativeCalendars';
import { GoogleOAuthService } from '@/businesses/oauth/google/googleOAuthService';
import CustomModal from '@/components/common/CustomModal';
import AppNavigator from '@/navigations/AppNavigator';

const queryClient = new QueryClient();
GoogleOAuthService.initGoogleOAuth();

function App() {
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
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
