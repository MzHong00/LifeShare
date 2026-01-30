import React, { useState, useCallback } from 'react';
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
import { Heart, Calendar, Filter } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { useMemoryStore } from '@/stores/useMemoryStore';
import type { Memory } from '@/types';

const { width } = Dimensions.get('window');
const columnWidth = (width - SPACING.layout * 2 - SPACING.md) / 2;

interface MemoryItemProps {
  item: Memory;
  onPress: (id: string) => void;
}

const MemoryItem = ({ item, onPress }: MemoryItemProps) => (
  <TouchableOpacity style={styles.memoryCard} onPress={() => onPress(item.id)}>
    <View style={styles.imagePlaceholder}>
      {item.thumbnailUrl ? (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <Heart
          size={32}
          color={COLORS.border}
          fill={parseInt(item.id, 10) % 3 === 0 ? '#FFEBF0' : 'transparent'}
        />
      )}
    </View>
    <View style={styles.memoryInfo}>
      <Text style={styles.memoryTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.memoryDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  </TouchableOpacity>
);

const MemoriesHeader = ({ memoryCount }: { memoryCount: number }) => (
  <>
    <View style={styles.header}>
      <View>
        <Text style={TYPOGRAPHY.header1}>추억</Text>
        <Text style={styles.subtitle}>우리의 소중한 순간들</Text>
      </View>
    </View>

    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>128</Text>
        <Text style={styles.statLabel}>함께한 날</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{memoryCount}</Text>
        <Text style={styles.statLabel}>기록된 추억</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>15</Text>
        <Text style={styles.statLabel}>방문한 장소</Text>
      </View>
    </View>

    <View style={styles.filterBar}>
      <TouchableOpacity style={styles.filterItem}>
        <Calendar size={18} color={COLORS.textSecondary} />
        <Text style={styles.filterText}>날짜순</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterItem}>
        <Filter size={18} color={COLORS.textSecondary} />
        <Text style={styles.filterText}>카테고리</Text>
      </TouchableOpacity>
    </View>
  </>
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
  const memories = useMemoryStore(state => state.memories);

  const [loading] = useState(false);

  // 실제 스토어 데이터를 사용하므로 목업 로드 로직 제거
  const loadMoreMemories = useCallback(() => {
    // 향후 실제 API 연동 시 페이징 처리 가능
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
        ListHeaderComponent={<MemoriesHeader memoryCount={memories.length} />}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.layout,
    paddingVertical: SPACING.xl,
    borderRadius: 20,
    marginBottom: SPACING.xl,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.header2,
    color: COLORS.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.layout,
    marginBottom: SPACING.lg,
    gap: 8,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
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
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerSpacer: {
    height: 40,
  },
  memoryCard: {
    width: columnWidth,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: columnWidth,
    backgroundColor: COLORS.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  memoryInfo: {
    padding: SPACING.md,
  },
  memoryTitle: {
    ...TYPOGRAPHY.body1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  memoryDate: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
});

export default MemoriesScreen;
