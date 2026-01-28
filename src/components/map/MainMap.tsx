import type { RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region,
} from 'react-native-maps';

import { COLORS } from '@/constants/theme';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import type { Memory, LocationPoint } from '@/types';

interface MainMapProps {
  mapRef: RefObject<MapView | null>;
  myLocation: { latitude: number; longitude: number };
  currentDelta: { latitudeDelta: number; longitudeDelta: number };
  isRecording: boolean;
  recordingPath: LocationPoint[];
  showHistory: boolean;
  memories: Memory[];
  selectedMemoryId: string | null;
  membersWithLocation: any[];
  onMarkerPress: (id: string, lat: number, lng: number) => void;
  onPolylinePress: (id: string) => void;
  onRegionChangeComplete: (region: Region) => void;
}

export const MainMap = ({
  mapRef,
  myLocation,
  currentDelta,
  isRecording,
  recordingPath,
  showHistory,
  memories,
  selectedMemoryId,
  membersWithLocation,
  onMarkerPress,
  onPolylinePress,
  onRegionChangeComplete,
}: MainMapProps) => {
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      showsUserLocation={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      initialRegion={{
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        ...currentDelta,
      }}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {/* Recording Path */}
      {isRecording && recordingPath.length > 1 && (
        <Polyline
          coordinates={recordingPath}
          strokeColor={COLORS.primary}
          strokeWidth={4}
        />
      )}

      {/* History Paths */}
      {showHistory &&
        memories.map(memory => {
          const isSelected = selectedMemoryId === memory.id;
          return (
            <Polyline
              key={memory.id}
              coordinates={memory.path}
              strokeColor={isSelected ? COLORS.primary : COLORS.primary + '40'}
              strokeWidth={isSelected ? 6 : 4}
              tappable={true}
              onPress={() => onPolylinePress(memory.id)}
            />
          );
        })}

      {membersWithLocation.map(member => (
        <Marker
          key={member.id}
          coordinate={member.location}
          onPress={() =>
            onMarkerPress(
              member.id,
              member.location.latitude,
              member.location.longitude,
            )
          }
        >
          <View style={styles.markerContainer}>
            {member.id !== 'user-1' && <View style={styles.pulseEffect} />}
            <View
              style={[
                styles.avatarMarker,
                member.id === 'user-1' && { borderColor: COLORS.primary },
              ]}
            >
              <ProfileAvatar uri={member.avatar} name={member.name} size={44} />
            </View>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { width: '100%', height: '100%' },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  pulseEffect: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
  },
  avatarMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
