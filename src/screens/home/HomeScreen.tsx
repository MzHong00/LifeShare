import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { APP_COLORS } from '@/constants/theme';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { DDayHero } from '@/components/home/DDayHero';
import { RecentCalendar } from '@/components/home/RecentCalendar';
import { RecentStories } from '@/components/home/RecentStories';

const HomeScreen = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const isFocused = useIsFocused();

  // currentWorkspace는 AppNavigator에서 보장됨
  if (!currentWorkspace) return null;

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* D-Day / Header Section */}
        <DDayHero />

        {/* Today's Agenda */}
        <RecentCalendar />

        {/* Recent Stories */}
        <RecentStories />
      </ScrollView>
    </View>
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
