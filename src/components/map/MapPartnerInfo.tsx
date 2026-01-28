
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Battery,
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

interface MapPartnerInfoProps {
  selectedUser: {
    name: string;
    // 필요한 다른 속성들 추가
  };
  onOpenDirections: () => void;
  recentPlaces: Array<{
    id: string;
    name: string;
    date: string;
    type: string;
  }>;
}

export const MapPartnerInfo = ({
  selectedUser,
  onOpenDirections,
  recentPlaces,
}: MapPartnerInfoProps) => {
  return (
    <>
      <View style={styles.partnerStatusCard}>
        <View style={styles.partnerInfo}>
          <Text style={TYPOGRAPHY.header2}>{selectedUser?.name}</Text>
          <View style={styles.batteryInfo}>
            <Battery size={16} color={COLORS.textTertiary} />
            <Text style={styles.batteryText}>85%</Text>
          </View>
        </View>
        <View style={styles.locationDetail}>
          <MapPin size={20} color={COLORS.primary} />
          <Text style={styles.addressText}>서울특별시 강남구 역삼동</Text>
        </View>
        <View style={styles.timeInfo}>
          <Clock size={16} color={COLORS.textTertiary} />
          <Text style={styles.timeText}>10분 전 확인됨</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onOpenDirections}
        >
          <Navigation size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>경로 찾기</Text>
        </TouchableOpacity>
      </View>

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
    </>
  );
};

const styles = StyleSheet.create({
  partnerStatusCard: {
    paddingHorizontal: SPACING.layout,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  partnerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  batteryInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  batteryText: { ...TYPOGRAPHY.caption, color: COLORS.textTertiary },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  addressText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { ...TYPOGRAPHY.caption, color: COLORS.textTertiary },
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
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  recentSection: {
    paddingHorizontal: SPACING.layout,
    paddingBottom: 40, // MapScreen의 ScrollView 내에서 여유 공간 확보
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  placeInfo: { flex: 1 },
});
