
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface DDayHeroProps {
  partnerName: string;
  myName: string;
  days: number;
  nextEventTitle: string;
  nextDDay: number;
  onPress?: () => void;
}

export const DDayHero = ({
  partnerName,
  myName,
  days,
  nextEventTitle,
  nextDDay,
  onPress,
}: DDayHeroProps) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card} onPress={onPress}>
        <View style={styles.header}>
          <Text style={styles.names}>{partnerName}</Text>
          <Heart size={20} color={COLORS.error} fill={COLORS.error} />
          <Text style={styles.names}>{myName}</Text>
        </View>
        <View style={styles.main}>
          <Text style={styles.days}>{days}</Text>
          <Text style={styles.suffix}>일째</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footer}>
          <Text style={styles.nextEvent}>{nextEventTitle}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>D-{nextDDay}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.layout,
    marginBottom: SPACING.xl,
  },
  card: {
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  names: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  days: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  suffix: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextEvent: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
