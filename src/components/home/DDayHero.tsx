import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Image as ImageIcon, Heart, Users } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface DDayHeroProps {
  partnerName: string;
  myName: string;
  days: number;
  nextEventTitle: string;
  nextDDay: number;
  backgroundImage?: string;
  workspaceType?: 'couple' | 'group';
  onPress?: () => void;
  onPressNextEvent?: () => void;
}

export const DDayHero = ({
  partnerName,
  myName,
  days,
  nextEventTitle,
  nextDDay,
  backgroundImage,
  workspaceType,
  onPress,
  onPressNextEvent,
}: DDayHeroProps) => {
  const content = (
    <View style={styles.contentContainer}>
      <View style={styles.topRow}>
        <View style={styles.namesContainer}>
          {workspaceType === 'couple' ? (
            <Heart
              size={16}
              color={COLORS.red}
              fill={COLORS.red}
              style={styles.nameIcon}
            />
          ) : (
            <Users
              size={16}
              color={COLORS.textSecondary}
              style={styles.nameIcon}
            />
          )}
          <Text style={[styles.names, backgroundImage && styles.whiteText]}>
            {partnerName} · {myName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[
            styles.editIconWrapper,
            backgroundImage && styles.whiteIconWrapper,
          ]}
        >
          <ImageIcon
            size={18}
            color={backgroundImage ? COLORS.white : COLORS.textTertiary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <View style={styles.daysContainer}>
          <Text style={[styles.days, backgroundImage && styles.whiteText]}>
            {days}
          </Text>
          <Text style={[styles.suffix, backgroundImage && styles.whiteText]}>
            일
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressNextEvent}
          style={[
            styles.nextEventBadge,
            backgroundImage && styles.whiteBadgeWrapper,
          ]}
        >
          <Text
            style={[styles.nextEventText, backgroundImage && styles.whiteText]}
          >
            {nextEventTitle}{' '}
            <Text
              style={[
                styles.dDayHighlight,
                backgroundImage && styles.whiteText,
              ]}
            >
              D-{nextDDay}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {backgroundImage ? (
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.overlay} />
            {content}
          </ImageBackground>
        ) : (
          content
        )}
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
    padding: 0, // 이미지 배경을 위해 패딩 제거
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: COLORS.white,
    borderRadius: 24, // 20에서 24로 살짝 확대
    minHeight: 240,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    minHeight: 240,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  imageStyle: {
    borderRadius: 24,
  },
  contentContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 20,
    justifyContent: 'space-between',
    minHeight: 240,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  namesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameIcon: {
    marginRight: 6,
  },
  names: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  main: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: -10, // 이름과 너무 멀어지지 않게 조정
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  days: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  suffix: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 2,
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  nextEventBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  nextEventText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  dDayHighlight: {
    color: COLORS.primary,
    fontWeight: '800',
    marginLeft: 4,
  },
  whiteText: {
    color: COLORS.white,
  },
  whiteIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  whiteBadgeWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
