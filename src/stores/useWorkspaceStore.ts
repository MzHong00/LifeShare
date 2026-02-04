import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { mmkvStorage } from '@/lib/storage';
import { MOCK_DATA } from '@/constants/mockData';
import type { Workspace, WorkspaceInvitation } from '@/types/workspace';

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  invitations: WorkspaceInvitation[];
}

export const workspaceStore = create<WorkspaceState>()(
  persist(
    (): WorkspaceState => ({
      currentWorkspace: null,
      workspaces: [],
      invitations: [],
    }),
    {
      name: 'workspace-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useWorkspaceStore = <T = WorkspaceState>(
  selector: (state: WorkspaceState) => T = (state: WorkspaceState) =>
    state as unknown as T,
) => workspaceStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const workspaceActions = {
  setCurrentWorkspace: (workspace: Workspace | null) =>
    workspaceStore.setState({ currentWorkspace: workspace }),
  setWorkspaces: (workspaces: Workspace[]) =>
    workspaceStore.setState({ workspaces }),
  addWorkspace: (workspace: Workspace) =>
    workspaceStore.setState(state => ({
      workspaces: [...state.workspaces, workspace],
    })),
  createNewWorkspace: (
    name: string,
    type: 'couple' | 'group',
    isMain: boolean,
    startDate?: string,
  ) => {
    const id = `ws-${Date.now()}`;
    const newWorkspace: Workspace = {
      id,
      name,
      type,
      startDate,
      members: [
        {
          id: 'user-1',
          name: '민수',
          email: 'minsu@example.com',
        },
        {
          id: 'user-2',
          name: '영희',
          email: 'yonghee@example.com',
        },
      ],
    };

    workspaceStore.setState(state => {
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
    workspaceId: string,
    workspaceName: string,
    inviterEmail: string,
    inviteeEmail: string,
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
    workspaceStore.setState(state => ({
      invitations: [...state.invitations, newInvitation],
    }));
  },
  respondToInvitation: (
    invitationId: string,
    status: 'accepted' | 'declined',
  ) => {
    const state = workspaceStore.getState();
    const invitation = state.invitations.find(i => i.id === invitationId);
    if (!invitation) return;

    workspaceStore.setState(s => ({
      invitations: s.invitations.map(i =>
        i.id === invitationId ? { ...i, status } : i,
      ),
    }));

    if (status === 'accepted') {
      const newWorkspace: Workspace = {
        id: invitation.workspaceId,
        name: invitation.workspaceName,
        type: 'couple',
      };
      workspaceStore.setState(s => ({
        workspaces: [...s.workspaces, newWorkspace],
        currentWorkspace: s.currentWorkspace || newWorkspace,
      }));
    }
  },
  removeWorkspace: (workspaceId: string) => {
    workspaceStore.setState(state => {
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
  updateWorkspaceName: (workspaceId: string, name: string) => {
    workspaceStore.setState(state => {
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
  updateWorkspaceStartDate: (workspaceId: string, startDate: string) => {
    workspaceStore.setState(state => {
      const nextWorkspaces = state.workspaces.map(ws =>
        ws.id === workspaceId ? { ...ws, startDate } : ws,
      );
      const isCurrent = state.currentWorkspace?.id === workspaceId;
      return {
        workspaces: nextWorkspaces,
        currentWorkspace: isCurrent
          ? { ...state.currentWorkspace!, startDate }
          : state.currentWorkspace,
      };
    });
  },
  updateMemberProfile: (
    workspaceId: string,
    memberId: string,
    profile: { name: string; avatar?: string },
  ) => {
    workspaceStore.setState(state => {
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
  updateWorkspaceBackground: (workspaceId: string, uri: string) => {
    workspaceStore.setState(state => {
      const nextWorkspaces = state.workspaces.map(ws =>
        ws.id === workspaceId ? { ...ws, backgroundImage: uri } : ws,
      );
      const isCurrent = state.currentWorkspace?.id === workspaceId;
      const nextCurrent = isCurrent
        ? { ...state.currentWorkspace!, backgroundImage: uri }
        : state.currentWorkspace;

      return {
        workspaces: nextWorkspaces,
        currentWorkspace: nextCurrent,
      };
    });
  },
  initMockData: () => {
    const workspaceWithBg = {
      ...MOCK_DATA.workspace,
      backgroundImage:
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
    };
    workspaceStore.setState({
      currentWorkspace: workspaceWithBg,
      workspaces: [workspaceWithBg, ...(MOCK_DATA as any).extraWorkspaces],
      invitations: [],
    });
  },
  clearData: () => {
    workspaceStore.setState({
      currentWorkspace: null,
      workspaces: [],
      invitations: [],
    });
  },
};
