export interface Workspace {
  id: string;
  name: string;
  type: 'couple' | 'group';
  partnerName?: string;
  members?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }[];
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  workspaceName: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}
