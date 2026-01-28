import { create } from 'zustand';
import type { Memory, LocationPoint } from '@/types';

interface MemoryState {
  isRecording: boolean;
  recordingPath: LocationPoint[];
  memories: Memory[];

  startRecording: () => void;
  stopRecording: () => void;
  addLocationPoint: (point: LocationPoint) => void;
  selectedMemoryId: string | null;
  setSelectedMemoryId: (id: string | null) => void;
  saveMemory: (memoryData: {
    id: string;
    title: string;
    description?: string;
    userId: string;
    workspaceId: string;
  }) => void;
  clearRecording: () => void;
  deleteMemory: (id: string) => void;
  updateMemory: (
    id: string,
    data: { title: string; description?: string; thumbnailUrl?: string },
  ) => void;
}

export const useMemoryStore = create<MemoryState>(set => ({
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

  startRecording: () => set({ isRecording: true, recordingPath: [] }),
  stopRecording: () => set({ isRecording: false }),
  setSelectedMemoryId: id => set({ selectedMemoryId: id }),
  addLocationPoint: point =>
    set(state => ({
      recordingPath: [...state.recordingPath, point],
    })),
  saveMemory: memoryData =>
    set(state => {
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
  clearRecording: () => set({ recordingPath: [], isRecording: false }),
  deleteMemory: id =>
    set(state => ({
      memories: state.memories.filter(m => m.id !== id),
    })),
  updateMemory: (id, data) =>
    set(state => ({
      memories: state.memories.map(m => (m.id === id ? { ...m, ...data } : m)),
    })),
}));
