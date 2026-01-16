import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  Battery,
  Zap,
  Clock,
  Star,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const recentPlaces = [
    { id: '1', name: '명동 성당 카페', date: '어제 오후 2:00', type: 'cafe' },
    { id: '2', name: '남산 타워', date: '3일 전', type: 'park' },
    { id: '3', name: '강남구청역 이자카야', date: '지난 주말', type: 'food' },
  ];

  return (
    <View style={styles.container}>
      {/* Mock Map Background */}
      <View style={styles.mockMap}>
        <View style={styles.mapCircle} />
        <View
          style={[styles.mapCircle, { width: 400, height: 400, opacity: 0.1 }]}
        />

        {/* Partner Marker */}
        <View style={styles.markerContainer}>
          <View style={styles.pulseEffect} />
          <View style={styles.avatarMarker}>
            <Text style={styles.avatarInitial}>❤️</Text>
          </View>
          <View style={styles.markerLabel}>
            <Text style={styles.markerText}>사랑하는 파트너</Text>
          </View>
        </View>

        {/* My Marker */}
        <View style={[styles.markerContainer, { top: '60%', left: '40%' }]}>
          <View
            style={[styles.avatarMarker, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.avatarInitial}>나</Text>
          </View>
        </View>
      </View>

      {/* Floating Header */}
      <SafeAreaView style={styles.floatingHeader} edges={['top']}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>실시간 위치</Text>
          <View style={styles.statusBadge}>
            <Zap size={14} color={COLORS.success} fill={COLORS.success} />
            <Text style={styles.statusBadgeText}>실시간 업데이트 중</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Sheet Style Content */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Partner Status Card */}
          <View style={styles.partnerStatusCard}>
            <View style={styles.partnerInfo}>
              <Text style={TYPOGRAPHY.header2}>사랑하는 파트너</Text>
              <View style={styles.batteryInfo}>
                <Battery size={16} color={COLORS.textTertiary} />
                <Text style={styles.batteryText}>85%</Text>
              </View>
            </View>
            <View style={styles.locationDetail}>
              <MapPin size={20} color={COLORS.primary} />
              <Text style={styles.addressText}>서울 특별시 강남구 역삼동</Text>
            </View>
            <View style={styles.timeInfo}>
              <Clock size={16} color={COLORS.textTertiary} />
              <Text style={styles.timeText}>10분 전 확인됨</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Navigation size={20} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>경로 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Star size={20} color="#FFAD13" />
              <Text style={styles.actionButtonText}>안심 장소</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Date Spots */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>최근 함께한 장소</Text>
            {recentPlaces.map(place => (
              <TouchableOpacity key={place.id} style={styles.placeItem}>
                <View style={styles.placeIcon}>
                  <MapPin size={20} color={COLORS.textSecondary} />
                </View>
                <View style={styles.placeInfo}>
                  <Text style={TYPOGRAPHY.body1}>{place.name}</Text>
                  <Text style={TYPOGRAPHY.caption}>{place.date}</Text>
                </View>
                <ChevronRight size={18} color={COLORS.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const ChevronRight = ({ size, color }: { size: number; color: string }) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: size / 2,
        height: size / 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: color,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#E8F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.primary,
    opacity: 0.2,
  },
  markerContainer: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    alignItems: 'center',
  },
  pulseEffect: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    top: -12,
  },
  avatarMarker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markerLabel: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 3,
  },
  markerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.header2,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
    marginLeft: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  partnerStatusCard: {
    paddingHorizontal: SPACING.layout,
    marginBottom: SPACING.xl,
  },
  partnerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  addressText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.layout,
    gap: 12,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  recentSection: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  placeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  placeInfo: {
    flex: 1,
  },
});

export default MapScreen;
