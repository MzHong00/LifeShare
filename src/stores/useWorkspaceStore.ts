import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOCK_DATA } from '@/constants/mockData';
import type { Workspace, WorkspaceInvitation } from '@/types/workspace';

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  invitations: WorkspaceInvitation[];
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  createNewWorkspace: (
    name: string,
    type: 'couple' | 'group',
    isMain: boolean,
  ) => string;
  sendInvitation: (
    workspaceId: string,
    workspaceName: string,
    inviterEmail: string,
    inviteeEmail: string,
  ) => void;
  respondToInvitation: (
    invitationId: string,
    status: 'accepted' | 'declined',
  ) => void;
  removeWorkspace: (workspaceId: string) => void;
  updateWorkspaceName: (workspaceId: string, name: string) => void;
  updateMemberProfile: (
    workspaceId: string,
    memberId: string,
    profile: { name: string; avatar?: string },
  ) => void;
  initMockData: () => void;
  clearData: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      currentWorkspace: null,
      workspaces: [],
      invitations: [],
      setCurrentWorkspace: workspace => set({ currentWorkspace: workspace }),
      setWorkspaces: workspaces => set({ workspaces }),
      addWorkspace: workspace =>
        set(state => ({
          workspaces: [...state.workspaces, workspace],
        })),
      createNewWorkspace: (name, type, isMain) => {
        const id = `ws-${Date.now()}`;
        const newWorkspace: Workspace = {
          id,
          name,
          type,
          members: [
            {
              id: 'user-1', // Default to current user's mock ID
              name: '민수', // Default name
              email: 'minsu@example.com',
            },
            {
              id: 'user-2', // Default to current user's mock ID
              name: '영희', // Default name
              email: 'yonghee@example.com',
            },
          ],
        };
        set(state => {
          const nextWorkspaces = [...state.workspaces, newWorkspace];
          return {
            workspaces: nextWorkspaces,
            currentWorkspace:
              state.workspaces.length === 0 || isMain
                ? newWorkspace
                : state.currentWorkspace,
          };
        });
        return id;
      },
      sendInvitation: (
        workspaceId,
        workspaceName,
        inviterEmail,
        inviteeEmail,
      ) => {
        const newInvitation: WorkspaceInvitation = {
          id: `inv-${Date.now()}`,
          workspaceId,
          workspaceName,
          inviterEmail,
          inviteeEmail,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          invitations: [...state.invitations, newInvitation],
        }));
      },
      respondToInvitation: (invitationId, status) => {
        const invitation = get().invitations.find(i => i.id === invitationId);
        if (!invitation) return;

        set(state => ({
          invitations: state.invitations.map(i =>
            i.id === invitationId ? { ...i, status } : i,
          ),
        }));

        if (status === 'accepted') {
          const newWorkspace: Workspace = {
            id: invitation.workspaceId,
            name: invitation.workspaceName,
            type: 'couple', // Default to couple for now
          };
          set(state => ({
            workspaces: [...state.workspaces, newWorkspace],
            currentWorkspace: state.currentWorkspace || newWorkspace,
          }));
        }
      },
      removeWorkspace: workspaceId => {
        set(state => {
          const nextWorkspaces = state.workspaces.filter(
            ws => ws.id !== workspaceId,
          );
          const isRemovingCurrent = state.currentWorkspace?.id === workspaceId;
          return {
            workspaces: nextWorkspaces,
            currentWorkspace: isRemovingCurrent
              ? nextWorkspaces[0] || null
              : state.currentWorkspace,
          };
        });
      },
      updateWorkspaceName: (workspaceId, name) => {
        set(state => {
          const nextWorkspaces = state.workspaces.map(ws =>
            ws.id === workspaceId ? { ...ws, name } : ws,
          );
          const isCurrent = state.currentWorkspace?.id === workspaceId;
          return {
            workspaces: nextWorkspaces,
            currentWorkspace: isCurrent
              ? { ...state.currentWorkspace!, name }
              : state.currentWorkspace,
          };
        });
      },
      updateMemberProfile: (workspaceId, memberId, profile) => {
        set(state => {
          const nextWorkspaces = state.workspaces.map(ws => {
            if (ws.id !== workspaceId) return ws;
            const nextMembers = (ws.members || []).map(m =>
              m.id === memberId ? { ...m, ...profile } : m,
            );
            return { ...ws, members: nextMembers };
          });
          const isCurrent = state.currentWorkspace?.id === workspaceId;
          const nextCurrent = isCurrent
            ? nextWorkspaces.find(ws => ws.id === workspaceId) || null
            : state.currentWorkspace;

          return {
            workspaces: nextWorkspaces,
            currentWorkspace: nextCurrent,
          };
        });
      },
      initMockData: () => {
        set({
          currentWorkspace: MOCK_DATA.workspace,
          workspaces: [
            MOCK_DATA.workspace,
            ...(MOCK_DATA as any).extraWorkspaces,
          ],
          invitations: [],
        });
      },
      clearData: () => {
        set({ currentWorkspace: null, workspaces: [], invitations: [] });
      },
    }),
    {
      name: 'workspace-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
