import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Heart,
  Calendar,
  Filter,
  Plus,
  Camera,
  Clock,
  Route,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { formatDate } from '@/utils/date';
import type { Memory } from '@/types';

const { width } = Dimensions.get('window');
const columnWidth = (width - SPACING.layout * 2 - SPACING.md) / 2;

interface MemoryItemProps {
  item: Memory;
  onPress: (id: string) => void;
}

/**
 * [MemoryItem] 프리미엄 카드 컴포넌트
 */
const MemoryItem = ({ item, onPress }: MemoryItemProps) => {
  const isHearted = parseInt(item.id, 10) % 3 === 0;

  return (
    <TouchableOpacity
      style={styles.memoryCard}
      onPress={() => onPress(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {item.thumbnailUrl ? (
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Camera size={28} color={COLORS.textTertiary} strokeWidth={1.5} />
          </View>
        )}
        {isHearted && (
          <View style={styles.heartBadge}>
            <Heart size={12} color={COLORS.white} fill={COLORS.white} />
          </View>
        )}
      </View>
      <View style={styles.memoryInfo}>
        <Text style={styles.memoryTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.memoryDate}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * [MemoriesHeader] 통계 및 필터가 포함된 헤더
 */
const MemoriesHeader = ({
  memoryCount,
  pathMemoryCount,
  onAddPress,
}: {
  memoryCount: number;
  pathMemoryCount: number;
  onAddPress: () => void;
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTop}>
      <View>
        <Text style={TYPOGRAPHY.header1}>추억</Text>
        <Text style={styles.subtitle}>소중한 순간들을 기록해요</Text>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={onAddPress}
        activeOpacity={0.7}
      >
        <View style={styles.avatarPlaceholder}>
          <Plus size={24} color={COLORS.primary} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>
    </View>

    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <View
          style={[
            styles.statIconWrapper,
            { backgroundColor: COLORS.primaryLight },
          ]}
        >
          <Clock size={16} color={COLORS.primary} />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>128일</Text>
          <Text style={styles.statSubLabel}>함께한 날</Text>
        </View>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statBox}>
        <View style={[styles.statIconWrapper, styles.pinkIconWrapper]}>
          <Heart size={16} color="#F04452" />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>{memoryCount}개</Text>
          <Text style={styles.statSubLabel}>전체 추억</Text>
        </View>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statBox}>
        <View style={[styles.statIconWrapper, styles.greenIconWrapper]}>
          <Route size={16} color="#34C759" />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>{pathMemoryCount}곳</Text>
          <Text style={styles.statSubLabel}>경로 기록</Text>
        </View>
      </View>
    </View>

    <View style={styles.filterBar}>
      <TouchableOpacity style={styles.filterChip}>
        <Calendar size={14} color={COLORS.textSecondary} />
        <Text style={styles.filterText}>최신순</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterChip}>
        <Filter size={14} color={COLORS.textSecondary} />
        <Text style={styles.filterText}>카테고리</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MemoriesFooter = ({ loading }: { loading: boolean }) => {
  if (!loading) return <View style={styles.footerSpacer} />;
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
  );
};

const MemoriesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { memories } = useMemoryStore();
  const [loading] = useState(false);

  const pathMemoryCount = useMemo(() => {
    return memories.filter(memory => memory.path && memory.path.length > 0)
      .length;
  }, [memories]);

  const handleAddMemory = useCallback(() => {
    navigation.navigate(NAV_ROUTES.MEMORY_EDIT.NAME);
  }, [navigation]);

  const loadMoreMemories = useCallback(() => {
    // API 연동용
  }, []);

  return (
    <AppSafeAreaView style={styles.container}>
      <FlatList
        data={memories}
        renderItem={({ item }) => (
          <MemoryItem
            item={item}
            onPress={id =>
              navigation.navigate(NAV_ROUTES.MEMORY_DETAIL.NAME, {
                memoryId: id,
              })
            }
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <MemoriesHeader
            memoryCount={memories.length}
            pathMemoryCount={pathMemoryCount}
            onAddPress={handleAddMemory}
          />
        }
        ListFooterComponent={<MemoriesFooter loading={loading} />}
        onEndReached={loadMoreMemories}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // 배경색 보정으로 카드 부각
  },
  headerContainer: {
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xs,
    borderRadius: 22,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statTextContainer: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueIconWrapper: {
    backgroundColor: COLORS.primaryLight,
  },
  pinkIconWrapper: {
    backgroundColor: '#FFEEFB',
  },
  greenIconWrapper: {
    backgroundColor: '#E8FAEF',
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.layout,
    justifyContent: 'space-between',
  },
  memoryCard: {
    width: columnWidth,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  imageContainer: {
    width: '100%',
    height: columnWidth * 1.1,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#F4F6F8',
  },
  heartBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(240, 68, 82, 0.8)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryInfo: {
    padding: 14,
  },
  memoryTitle: {
    ...TYPOGRAPHY.body1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  memoryDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerSpacer: {
    height: 40,
  },
});

export default MemoriesScreen;
