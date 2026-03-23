import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Camera } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import type { Story } from '@/types';
import { APP_COLORS, THEME_COLORS, TYPOGRAPHY } from '@/constants/theme';
import { getDynamicImageHeight } from '@/utils/image';
import { formatDate } from '@/utils/date';
import { Card } from '@/components/common/Card';

interface StoryItemProps {
  item: Story;
  onPress: (id: string) => void;
}

/**
 * [StoryItem] 핀터레스트 스타일 뷰를 위한 스토리 카드 (Masonry 대응)
 */
export const StoryItem = ({ item, onPress }: StoryItemProps) => {
  const imageHeight = useMemo(
    () => getDynamicImageHeight(item.id, item.thumbnailUrl),
    [item.id, item.thumbnailUrl],
  );

  return (
    <Card style={styles.storyCard} onPress={() => onPress(item.id)}>
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {item.thumbnailUrl ? (
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Camera
              size={28}
              color={APP_COLORS.textTertiary}
              strokeWidth={1.5}
            />
          </View>
        )}

        {/* Premium Gradient Overlay (Covers bottom half for natural transition) */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.5" stopColor="transparent" stopOpacity="0" />
                <Stop
                  offset="1"
                  stopColor="rgba(0, 0, 0, 0.4)"
                  stopOpacity="0.4"
                />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#grad)" />
          </Svg>
        </View>

        {/* Text Info Layer */}
        <View style={styles.overlayInfo}>
          <Text style={styles.storyTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.storyDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  storyCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
    backgroundColor: APP_COLORS.bgWhite,
    // 그림자 제거 (Masonry에서 깔끔하게 보이기 위함)
    elevation: 0,
    shadowOpacity: 0,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: APP_COLORS.skeleton,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.grey100,
  },
  overlayInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 32,
  },
  storyTitle: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: THEME_COLORS.white,
    marginBottom: 4,
    // 가독성을 위한 미세한 그림자
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  storyDate: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
