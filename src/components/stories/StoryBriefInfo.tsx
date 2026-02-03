import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Route, Calendar, MapPin, Paintbrush } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import type { Story } from '@/types';

interface StoryBriefInfoProps {
  story: Story;
  showDecorateBtn?: boolean;
}

export const StoryBriefInfo = ({
  story,
  showDecorateBtn = true,
}: StoryBriefInfoProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Route size={20} color={COLORS.primary} style={styles.icon} />
          <Text style={TYPOGRAPHY.header2}>{story.title}</Text>
        </View>

        {showDecorateBtn && (
          <TouchableOpacity
            style={styles.decorateBtn}
            onPress={() =>
              navigation.navigate(NAV_ROUTES.STORY_EDIT.NAME, {
                storyId: story.id,
              })
            }
          >
            <Paintbrush size={14} color={COLORS.primary} />
            <Text style={styles.decorateBtnText}>스토리 꾸미기</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailRow}>
        <Calendar size={16} color={COLORS.textTertiary} />
        <Text style={styles.detailText}>
          {new Date(story.date).toLocaleDateString()}{' '}
          {new Date(story.date).toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <MapPin size={16} color={COLORS.textTertiary} />
        <Text style={styles.detailText}>
          총 {story.path.length}개의 위치 포인트 기록됨
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  decorateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  decorateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
