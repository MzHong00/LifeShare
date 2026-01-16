import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  Calendar,
  Filter,
  Heart,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

const { width } = Dimensions.get('window');
const columnWidth = (width - SPACING.layout * 2 - SPACING.md) / 2;

const MemoriesScreen = () => {
  const memories = [
    { id: '1', title: '한강 피크닉', date: '2024.03.15', type: 'photo' },
    { id: '2', title: '우리의 첫 캠핑', date: '2024.03.10', type: 'photo' },
    {
      id: '3',
      title: '명동 카페 데이트',
      date: '2024.03.05',
      type: 'location',
    },
    { id: '4', title: '벚꽃 놀이', date: '2024.02.28', type: 'photo' },
    { id: '5', title: '전시회 관람', date: '2024.02.20', type: 'story' },
    { id: '6', title: '1주년 기념일', date: '2024.02.14', type: 'photo' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={TYPOGRAPHY.header1}>추억</Text>
          <Text style={styles.subtitle}>우리의 소중한 순간들</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Camera size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>128</Text>
          <Text style={styles.statLabel}>함께한 날</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>기록된 추억</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>15</Text>
          <Text style={styles.statLabel}>방문한 장소</Text>
        </View>
      </View>

      {/* Filter Bar */}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {memories.map(item => (
            <TouchableOpacity key={item.id} style={styles.memoryCard}>
              <View style={styles.imagePlaceholder}>
                <Heart
                  size={32}
                  color={COLORS.border}
                  fill={item.id === '1' ? '#FFEBF0' : 'transparent'}
                />
              </View>
              <View style={styles.memoryInfo}>
                <Text style={styles.memoryTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.memoryDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Month Section Example */}
        <View style={styles.monthSection}>
          <Text style={styles.sectionTitle}>더 예전 기록</Text>
          <TouchableOpacity style={styles.moreBtn}>
            <Text style={styles.moreBtnText}>2023년 추억 보기</Text>
            <ChevronRight size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.layout,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  scrollContent: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  monthSection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.header2,
    fontSize: 18,
    marginBottom: SPACING.lg,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 16,
  },
  moreBtnText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
  },
});

export default MemoriesScreen;
