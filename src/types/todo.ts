export interface Todo {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  assigneeId?: string; // Member ID from workspace. If undefined, it might be unassigned or for everyone.
  startDate: string; // ISO string (YYYY-MM-DD)
  endDate: string; // ISO string (YYYY-MM-DD)
  color?: string; // Optional color for the todo/event
  createdAt: string;
}
