export interface Todo {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  assigneeId?: string; // Member ID from workspace. If undefined, it might be unassigned or for everyone.
  dueDate?: string; // ISO string for the date part (YYYY-MM-DD)
  createdAt: string;
}
