import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { Story, LocationPoint } from '@/types';

interface StoryState {
  isRecording: boolean;
  recordingPath: LocationPoint[];
  stories: Story[];
  selectedStoryId: string | null;
}

export const storyStore = create<StoryState>(() => ({
  isRecording: false,
  recordingPath: [],
  stories: [
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
  selectedStoryId: null,
}));

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useStoryStore = <T = StoryState>(
  selector: (state: StoryState) => T = (state: StoryState) =>
    state as unknown as T,
) => storyStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const storyActions = {
  startRecording: () =>
    storyStore.setState({ isRecording: true, recordingPath: [] }),
  stopRecording: () => storyStore.setState({ isRecording: false }),
  setSelectedStoryId: (id: string | null) =>
    storyStore.setState({ selectedStoryId: id }),
  addLocationPoint: (point: LocationPoint) =>
    storyStore.setState(state => ({
      recordingPath: [...state.recordingPath, point],
    })),
  saveStory: (storyData: {
    id: string;
    title: string;
    description?: string;
    userId: string;
    workspaceId: string;
  }) =>
    storyStore.setState(state => {
      const newStory: Story = {
        ...storyData,
        date: new Date().toISOString(),
        path: state.recordingPath,
      };
      return {
        stories: [newStory, ...state.stories],
        recordingPath: [],
        isRecording: false,
      };
    }),
  clearRecording: () =>
    storyStore.setState({ recordingPath: [], isRecording: false }),
  deleteStory: (id: string) =>
    storyStore.setState(state => ({
      stories: state.stories.filter(s => s.id !== id),
    })),
  addStory: (data: Omit<Story, 'id' | 'userId' | 'workspaceId'>) =>
    storyStore.setState(state => {
      const newStory: Story = {
        ...data,
        id: Math.random().toString(36).substring(7),
        userId: 'user-1',
        workspaceId: 'ws-1',
      };
      return {
        stories: [newStory, ...state.stories],
      };
    }),
  updateStory: (
    id: string,
    data: { title: string; description?: string; thumbnailUrl?: string },
  ) =>
    storyStore.setState(state => ({
      stories: state.stories.map(s => (s.id === id ? { ...s, ...data } : s)),
    })),
};
