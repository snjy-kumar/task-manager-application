import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Mail,
    Shield,
    Trash2,
    UserPlus,
    UserMinus,
    Crown,
    Clock,
    X,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import teamService, { Team } from '@/services/teamService';

const TeamManagementPage: React.FC = () => {
    const { success, error } = useToast();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Create team form
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');

    // Invite form
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        setLoading(true);
        try {
            const data = await teamService.getMyTeams();
            setTeams(data);
            if (data.length > 0 && !selectedTeam) {
                setSelectedTeam(data[0]);
            }
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to load teams');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) {
            error('Team name is required');
            return;
        }

        try {
            const newTeam = await teamService.createTeam({
                name: teamName,
                description: teamDescription
            });
            success('Team created successfully');
            setTeams([newTeam, ...teams]);
            setSelectedTeam(newTeam);
            setShowCreateModal(false);
            setTeamName('');
            setTeamDescription('');
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to create team');
        }
    };

    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim() || !selectedTeam) {
            error('Email is required');
            return;
        }

        try {
            await teamService.inviteUser(selectedTeam._id, {
                email: inviteEmail,
                role: inviteRole
            });
            success('Invitation sent successfully');
            setShowInviteModal(false);
            setInviteEmail('');
            setInviteRole('member');
            // Reload team to show new invite
            const updatedTeam = await teamService.getTeamById(selectedTeam._id);
            setSelectedTeam(updatedTeam);
            setTeams(teams.map(t => t._id === updatedTeam._id ? updatedTeam : t));
        } catch (inviteError: any) {
            error(inviteError.response?.data?.message || 'Failed to send invitation');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!selectedTeam) return;
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            const updatedTeam = await teamService.removeMember(selectedTeam._id, memberId);
            success('Member removed successfully');
            setSelectedTeam(updatedTeam);
            setTeams(teams.map(t => t._id === updatedTeam._id ? updatedTeam : t));
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to remove member');
        }
    };

    const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member') => {
        if (!selectedTeam) return;

        try {
            const updatedTeam = await teamService.updateMemberRole(selectedTeam._id, memberId, newRole);
            success('Member role updated successfully');
            setSelectedTeam(updatedTeam);
            setTeams(teams.map(t => t._id === updatedTeam._id ? updatedTeam : t));
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleCancelInvite = async (inviteId: string) => {
        if (!selectedTeam) return;

        try {
            await teamService.cancelInvitation(selectedTeam._id, inviteId);
            success('Invitation cancelled');
            const updatedTeam = await teamService.getTeamById(selectedTeam._id);
            setSelectedTeam(updatedTeam);
            setTeams(teams.map(t => t._id === updatedTeam._id ? updatedTeam : t));
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to cancel invitation');
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;

        try {
            await teamService.deleteTeam(teamId);
            success('Team deleted successfully');
            const newTeams = teams.filter(t => t._id !== teamId);
            setTeams(newTeams);
            setSelectedTeam(newTeams[0] || null);
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to delete team');
        }
    };

    const getRoleBadge = (role: string) => {
        const styles = {
            owner: 'bg-amber-500/15 text-amber-400',
            admin: 'bg-amber-500/10 text-amber-500',
            member: 'bg-gray-100 text-gray-700 dark:bg-gray-700 '
        };
        return styles[role as keyof typeof styles] || styles.member;
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner':
                return <Crown className="w-4 h-4" />;
            case 'admin':
                return <Shield className="w-4 h-4" />;
            default:
                return <Users className="w-4 h-4" />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Team Management
                        </h1>
                        <p className="text-muted-foreground">
                            Create and manage your teams and members
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Team
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
            ) : teams.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No teams yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first team to start collaborating</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Team
                    </Button>
                </div>
            ) : (
                <div className="flex gap-6 flex-1 overflow-hidden">
                    {/* Teams List */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
                            <div className="p-4 border-b border-border">
                                <h3 className="font-semibold text-foreground">Your Teams ({teams.length})</h3>
                            </div>
                            <div className="flex-1 overflow-auto">
                                {teams.map(team => (
                                    <button
                                        key={team._id}
                                        onClick={() => setSelectedTeam(team)}
                                        className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${selectedTeam?._id === team._id ? 'bg-amber-500/10 border-l-4 border-l-amber-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold">
                                                {team.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-foreground truncate">{team.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team Details */}
                    {selectedTeam && (
                        <div className="flex-1 overflow-auto">
                            <div className="bg-card rounded-xl border border-border p-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-2">{selectedTeam.name}</h2>
                                        {selectedTeam.description && (
                                            <p className="text-muted-foreground">{selectedTeam.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowInviteModal(true)}>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Invite
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteTeam(selectedTeam._id)}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span>Created {new Date(selectedTeam.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>Owner: {selectedTeam.owner.name}</span>
                                </div>
                            </div>

                            {/* Members */}
                            <div className="bg-card rounded-xl border border-border mb-6">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-semibold text-foreground">
                                        Members ({selectedTeam.members.length})
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {selectedTeam.members.map(member => (
                                        <div key={member._id} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 font-bold">
                                                    {member.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{member.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                                                    {getRoleIcon(member.role)}
                                                    {member.role}
                                                </span>
                                                {member.role !== 'owner' && (
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={member.role}
                                                            onChange={(e) => handleUpdateRole(member.user._id, e.target.value as 'admin' | 'member')}
                                                            className="text-sm px-2 py-1 border border-border rounded bg-card text-foreground"
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="member">Member</option>
                                                        </select>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRemoveMember(member.user._id)}
                                                            className="text-red-600"
                                                        >
                                                            <UserMinus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pending Invites */}
                            {selectedTeam.invites.filter(i => i.status === 'pending').length > 0 && (
                                <div className="bg-card rounded-xl border border-border">
                                    <div className="p-4 border-b border-border">
                                        <h3 className="font-semibold text-foreground">
                                            Pending Invitations ({selectedTeam.invites.filter(i => i.status === 'pending').length})
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {selectedTeam.invites.filter(i => i.status === 'pending').map(invite => (
                                            <div key={invite._id} className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-foreground">{invite.email}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Invited by {invite.invitedBy.name} • Expires {new Date(invite.expiresAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(invite.role)}`}>
                                                        {invite.role}
                                                    </span>
                                                    <span className="px-2 py-1 bg-amber-500/15 text-amber-400 rounded-full text-xs font-medium">
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        Pending
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCancelInvite(invite._id)}
                                                        className="text-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-foreground mb-4">Create New Team</h3>
                        <form onSubmit={handleCreateTeam}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Team Name *
                                </label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                    placeholder="e.g., Marketing Team"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={teamDescription}
                                    onChange={(e) => setTeamDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                    placeholder="Optional description..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">Create Team</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite User Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-foreground mb-4">Invite Team Member</h3>
                        <form onSubmit={handleInviteUser}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                    placeholder="colleague@example.com"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Role
                                </label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Admins can invite users and manage team settings
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">Send Invitation</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagementPage;
