import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MessageCircle, Home, MapPin, Calendar } from 'lucide-react-native';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

const styles = StyleSheet.create({
  iconEnabled: {
    opacity: 1,
  },
  iconDisabled: {
    opacity: 0.4,
  },
});

export const ChatIconWrapper = ({
  color,
  size,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => {
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  return (
    <View style={currentWorkspace ? styles.iconEnabled : styles.iconDisabled}>
      <MessageCircle color={color} size={size} strokeWidth={2.3} />
    </View>
  );
};

export const HomeIconWrapper = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <Home color={color} size={size} strokeWidth={2.3} />;

export const MapIconWrapper = ({
  color,
  size,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => {
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);
  return (
    <View style={currentWorkspace ? styles.iconEnabled : styles.iconDisabled}>
      <MapPin color={color} size={size} strokeWidth={2.3} />
    </View>
  );
};
export const CalendarIconWrapper = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <Calendar color={color} size={size} strokeWidth={2.3} />;
