export interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  isAllDay: boolean;
  color: string;
  createdAt: string;
}

export type CreateEventData = Omit<CalendarEvent, 'id' | 'createdAt'>;
