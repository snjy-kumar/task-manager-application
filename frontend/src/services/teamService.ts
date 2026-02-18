import apiClient from './api';

export interface TeamMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface TeamInvite {
  _id: string;
  email: string;
  role: 'admin' | 'member';
  invitedBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: TeamMember[];
  invites: TeamInvite[];
  settings: {
    allowMemberInvite: boolean;
    taskApprovalRequired: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  settings?: {
    allowMemberInvite?: boolean;
    taskApprovalRequired?: boolean;
  };
}

export interface InviteUserData {
  email: string;
  role?: 'admin' | 'member';
}

const teamService = {
  // Create a new team
  createTeam: async (data: CreateTeamData): Promise<Team> => {
    const response = await apiClient.post('/teams', data);
    return response.data.data;
  },

  // Get all teams for current user
  getMyTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get('/teams');
    return response.data.data;
  },

  // Get team by ID
  getTeamById: async (teamId: string): Promise<Team> => {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data.data;
  },

  // Update team
  updateTeam: async (teamId: string, data: UpdateTeamData): Promise<Team> => {
    const response = await apiClient.put(`/teams/${teamId}`, data);
    return response.data.data;
  },

  // Delete team
  deleteTeam: async (teamId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}`);
  },

  // Invite user to team
  inviteUser: async (teamId: string, data: InviteUserData): Promise<{ email: string; token: string; expiresAt: string }> => {
    const response = await apiClient.post(`/teams/${teamId}/invite`, data);
    return response.data.data;
  },

  // Accept invitation
  acceptInvitation: async (token: string): Promise<Team> => {
    const response = await apiClient.post(`/teams/accept-invite/${token}`);
    return response.data.data;
  },

  // Remove member from team
  removeMember: async (teamId: string, memberId: string): Promise<Team> => {
    const response = await apiClient.delete(`/teams/${teamId}/members/${memberId}`);
    return response.data.data;
  },

  // Update member role
  updateMemberRole: async (teamId: string, memberId: string, role: 'admin' | 'member'): Promise<Team> => {
    const response = await apiClient.put(`/teams/${teamId}/members/${memberId}/role`, { role });
    return response.data.data;
  },

  // Leave team
  leaveTeam: async (teamId: string): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/leave`);
  },

  // Cancel invitation
  cancelInvitation: async (teamId: string, inviteId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/invites/${inviteId}`);
  }
};

export default teamService;
