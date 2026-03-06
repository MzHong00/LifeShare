import { ScrollView, StyleSheet } from 'react-native';

import { APP_COLORS } from '@/constants/theme';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { DDayHero } from '@/components/home/DDayHero';
import { HomeHeader } from '@/components/home/HomeHeader';
import { RecentCalendar } from '@/components/home/RecentCalendar';
import { RecentStories } from '@/components/home/RecentStories';

const HomeScreen = () => {
  const { currentWorkspace } = useWorkspaceStore();

  // currentWorkspace는 AppNavigator에서 보장됨
  if (!currentWorkspace) return null;

  return (
    <AppSafeAreaView
      style={styles.container}
      edges={['top']}
      headerShown={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <HomeHeader />

        {/* D-Day Section */}
        <DDayHero />

        {/* Today's Agenda */}
        <RecentCalendar />

        {/* Recent Stories */}
        <RecentStories />
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.bgWhite,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

export default HomeScreen;
