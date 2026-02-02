import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CalendarEvent, CreateEventData } from '@/types/calendar';

interface CalendarState {
  events: CalendarEvent[];
}

export const calendarStore = create<CalendarState>()(
  persist(
    (): CalendarState => ({
      events: [],
    }),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useCalendarStore = <T = CalendarState>(
  selector: (state: CalendarState) => T = (state: CalendarState) =>
    state as unknown as T,
) => calendarStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const calendarActions = {
  addEvent: (eventData: CreateEventData) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    calendarStore.setState(state => ({
      events: [newEvent, ...state.events],
    }));
  },
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => {
    calendarStore.setState(state => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, ...updates } : event,
      ),
    }));
  },
  removeEvent: (id: string) => {
    calendarStore.setState(state => ({
      events: state.events.filter(event => event.id !== id),
    }));
  },
  clearEvents: () => calendarStore.setState({ events: [] }),
};
