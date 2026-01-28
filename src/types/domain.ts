export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  assignee: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  profileImage: string;
  status?: string;
  location?: string;
  lastActive?: string;
}
