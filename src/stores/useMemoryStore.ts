import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { Memory, LocationPoint } from '@/types';

interface MemoryState {
  isRecording: boolean;
  recordingPath: LocationPoint[];
  memories: Memory[];
  selectedMemoryId: string | null;
}

export const memoryStore = create<MemoryState>(() => ({
  isRecording: false,
  recordingPath: [],
  memories: [
    {
      id: 'mock-1',
      title: '지난 주 데이트',
      date: new Date().toISOString(),
      userId: 'user-1',
      workspaceId: 'ws-1',
      path: [
        { latitude: 37.5, longitude: 127.03, timestamp: Date.now() },
        { latitude: 37.505, longitude: 127.035, timestamp: Date.now() },
        { latitude: 37.51, longitude: 127.04, timestamp: Date.now() },
      ],
    },
  ],
  selectedMemoryId: null,
}));

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useMemoryStore = <T = MemoryState>(
  selector: (state: MemoryState) => T = (state: MemoryState) =>
    state as unknown as T,
) => memoryStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const memoryActions = {
  startRecording: () =>
    memoryStore.setState({ isRecording: true, recordingPath: [] }),
  stopRecording: () => memoryStore.setState({ isRecording: false }),
  setSelectedMemoryId: (id: string | null) =>
    memoryStore.setState({ selectedMemoryId: id }),
  addLocationPoint: (point: LocationPoint) =>
    memoryStore.setState(state => ({
      recordingPath: [...state.recordingPath, point],
    })),
  saveMemory: (memoryData: {
    id: string;
    title: string;
    description?: string;
    userId: string;
    workspaceId: string;
  }) =>
    memoryStore.setState(state => {
      const newMemory: Memory = {
        ...memoryData,
        date: new Date().toISOString(),
        path: state.recordingPath,
      };
      return {
        memories: [newMemory, ...state.memories],
        recordingPath: [],
        isRecording: false,
      };
    }),
  clearRecording: () =>
    memoryStore.setState({ recordingPath: [], isRecording: false }),
  deleteMemory: (id: string) =>
    memoryStore.setState(state => ({
      memories: state.memories.filter(m => m.id !== id),
    })),
  updateMemory: (
    id: string,
    data: { title: string; description?: string; thumbnailUrl?: string },
  ) =>
    memoryStore.setState(state => ({
      memories: state.memories.map(m => (m.id === id ? { ...m, ...data } : m)),
    })),
};
