import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CalendarEvent, CreateEventData } from '@/types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (eventData: CreateEventData) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    set => ({
      events: [],
      addEvent: eventData => {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: `event-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          events: [newEvent, ...state.events],
        }));
      },
      updateEvent: (id, updates) => {
        set(state => ({
          events: state.events.map(event =>
            event.id === id ? { ...event, ...updates } : event,
          ),
        }));
      },
      removeEvent: id => {
        set(state => ({
          events: state.events.filter(event => event.id !== id),
        }));
      },
      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
