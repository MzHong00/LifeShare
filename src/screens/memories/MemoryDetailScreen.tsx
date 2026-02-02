import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Map, Edit3, ChevronLeft } from 'lucide-react-native';

import { COLORS, SPACING } from '@/constants/theme';
import { NAV_ROUTES } from '@/constants/navigation';
import { AppSafeAreaView } from '@/components/common/AppSafeAreaView';
import { useMemoryStore, memoryActions } from '@/stores/useMemoryStore';
import { MemoryBriefInfo } from '@/components/memories/MemoryBriefInfo';

type MemoryDetailRouteProp = RouteProp<
  { params: { memoryId: string } },
  'params'
>;

// MemoryDetailScreen

const MemoryDetailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<MemoryDetailRouteProp>();
  const { memoryId } = route.params;

  const { memories } = useMemoryStore();
  const { setSelectedMemoryId } = memoryActions;
  const [memory, setMemory] = useState<any>(null);

  useEffect(() => {
    const found = memories.find(m => m.id === memoryId);
    if (found) {
      setMemory(found);
    }
  }, [memoryId, memories]);

  if (!memory) return null;

  const handleShowOnMap = () => {
    setSelectedMemoryId(memory.id);
    navigation.navigate(NAV_ROUTES.MAIN_TABS.NAME, {
      screen: NAV_ROUTES.LOCATION.NAME,
    });
  };

  const handleEdit = () => {
    navigation.navigate(NAV_ROUTES.MEMORY_EDIT.NAME, { memoryId: memory.id });
  };

  return (
    <AppSafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>추억 상세보기</Text>
        <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
          <Edit3 size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <MemoryBriefInfo memory={memory} showDecorateBtn={false} />

          {memory.thumbnailUrl && (
            <Image
              source={{ uri: memory.thumbnailUrl }}
              style={styles.detailImage}
              resizeMode="cover"
            />
          )}

          {memory.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionText}>{memory.description}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.mapActionCard}
            onPress={handleShowOnMap}
          >
            <View style={styles.mapActionIcon}>
              <Map size={24} color={COLORS.white} />
            </View>
            <View style={styles.mapActionTextContent}>
              <Text style={styles.mapActionTitle}>지도에서 경로 보기</Text>
              <Text style={styles.mapActionSubtitle}>
                그날 우리의 이동 동선을 확인해보세요
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.skeleton,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  editBtn: {
    padding: 4,
  },
  content: {
    padding: SPACING.layout,
  },
  descriptionSection: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    marginVertical: 24,
  },
  detailImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    marginTop: 16,
    backgroundColor: COLORS.background,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  mapActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 20,
    gap: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: 8,
  },
  mapActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActionTextContent: {
    flex: 1,
  },
  mapActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  mapActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default MemoryDetailScreen;
