import Team from '../models/teams.model.js';
import User from '../models/user.model.js';
import crypto from 'crypto';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/errors.js';

// Create a new team
export const createTeam = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.User._id;

        const team = await Team.create({
            name,
            description,
            owner: userId,
            members: [{
                user: userId,
                role: 'owner',
                joinedAt: new Date()
            }]
        });

        await team.populate('owner', 'name email');
        await team.populate('members.user', 'name email');

        res.status(201).json(ApiResponse.success(team, 'Team created successfully'));
    } catch (error) {
        next(error);
    }
};

// Get all teams for the current user
export const getMyTeams = async (req, res, next) => {
    try {
        const userId = req.User._id;

        const teams = await Team.find({
            $or: [
                { owner: userId },
                { 'members.user': userId }
            ]
        })
        .populate('owner', 'name email')
        .populate('members.user', 'name email')
        .sort({ createdAt: -1 });

        res.json(ApiResponse.success(teams, 'Teams retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// Get team by ID
export const getTeamById = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const userId = req.User._id;

        const team = await Team.findById(teamId)
            .populate('owner', 'name email')
            .populate('members.user', 'name email')
            .populate('invites.invitedBy', 'name email');

        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Check if user is a member
        const isMember = await Team.isMember(teamId, userId);
        if (!isMember) {
            throw new AppError('You do not have access to this team', 403);
        }

        res.json(ApiResponse.success(team, 'Team retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// Update team
export const updateTeam = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { name, description, settings } = req.body;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Check if user is owner or admin
        const role = await Team.getUserRole(teamId, userId);
        if (role !== 'owner' && role !== 'admin') {
            throw new AppError('Only team owner or admin can update team settings', 403);
        }

        if (name) team.name = name;
        if (description !== undefined) team.description = description;
        if (settings) team.settings = { ...team.settings, ...settings };

        await team.save();
        await team.populate('owner', 'name email');
        await team.populate('members.user', 'name email');

        res.json(ApiResponse.success(team, 'Team updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Delete team
export const deleteTeam = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Only owner can delete team
        if (team.owner.toString() !== userId.toString()) {
            throw new AppError('Only team owner can delete the team', 403);
        }

        await Team.findByIdAndDelete(teamId);

        res.json(ApiResponse.success(null, 'Team deleted successfully'));
    } catch (error) {
        next(error);
    }
};

// Invite user to team
export const inviteUser = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { email, role = 'member' } = req.body;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Check permissions
        const userRole = await Team.getUserRole(teamId, userId);
        if (!userRole || (userRole === 'member' && !team.settings.allowMemberInvite)) {
            throw new AppError('You do not have permission to invite users', 403);
        }

        // Check if user is already a member
        const existingMember = team.members.find(m => m.user.email === email);
        if (existingMember) {
            throw new AppError('User is already a team member', 400);
        }

        // Check for existing pending invite
        const existingInvite = team.invites.find(
            i => i.email === email && i.status === 'pending'
        );
        if (existingInvite) {
            throw new AppError('Invitation already sent to this email', 400);
        }

        // Generate invite token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        team.invites.push({
            email,
            role,
            invitedBy: userId,
            status: 'pending',
            token,
            expiresAt
        });

        await team.save();
        await team.populate('invites.invitedBy', 'name email');

        // TODO: Send invitation email here
        // sendInvitationEmail(email, token, team.name);

        res.status(201).json(ApiResponse.success(
            { email, token, expiresAt },
            'Invitation sent successfully'
        ));
    } catch (error) {
        next(error);
    }
};

// Accept invitation
export const acceptInvitation = async (req, res, next) => {
    try {
        const { token } = req.params;
        const userId = req.User._id;

        const team = await Team.findOne({ 'invites.token': token });
        if (!team) {
            throw new AppError('Invalid invitation token', 404);
        }

        const invite = team.invites.find(i => i.token === token);
        if (!invite) {
            throw new AppError('Invitation not found', 404);
        }

        if (invite.status !== 'pending') {
            throw new AppError('Invitation has already been processed', 400);
        }

        if (new Date() > invite.expiresAt) {
            invite.status = 'expired';
            await team.save();
            throw new AppError('Invitation has expired', 400);
        }

        // Add user to team
        team.members.push({
            user: userId,
            role: invite.role,
            joinedAt: new Date()
        });

        invite.status = 'accepted';
        await team.save();
        await team.populate('owner', 'name email');
        await team.populate('members.user', 'name email');

        res.json(ApiResponse.success(team, 'Invitation accepted successfully'));
    } catch (error) {
        next(error);
    }
};

// Remove member from team
export const removeMember = async (req, res, next) => {
    try {
        const { teamId, memberId } = req.params;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Check permissions
        const userRole = await Team.getUserRole(teamId, userId);
        if (userRole !== 'owner' && userRole !== 'admin') {
            throw new AppError('Only team owner or admin can remove members', 403);
        }

        // Cannot remove owner
        if (team.owner.toString() === memberId.toString()) {
            throw new AppError('Cannot remove team owner', 400);
        }

        // Remove member
        team.members = team.members.filter(m => m.user.toString() !== memberId.toString());
        await team.save();
        await team.populate('members.user', 'name email');

        res.json(ApiResponse.success(team, 'Member removed successfully'));
    } catch (error) {
        next(error);
    }
};

// Update member role
export const updateMemberRole = async (req, res, next) => {
    try {
        const { teamId, memberId } = req.params;
        const { role } = req.body;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Only owner can change roles
        if (team.owner.toString() !== userId.toString()) {
            throw new AppError('Only team owner can change member roles', 403);
        }

        // Cannot change owner role
        if (team.owner.toString() === memberId.toString()) {
            throw new AppError('Cannot change owner role', 400);
        }

        const member = team.members.find(m => m.user.toString() === memberId.toString());
        if (!member) {
            throw new AppError('Member not found', 404);
        }

        member.role = role;
        await team.save();
        await team.populate('members.user', 'name email');

        res.json(ApiResponse.success(team, 'Member role updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Leave team
export const leaveTeam = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Owner cannot leave (must delete team instead)
        if (team.owner.toString() === userId.toString()) {
            throw new AppError('Team owner cannot leave. Please delete the team or transfer ownership.', 400);
        }

        team.members = team.members.filter(m => m.user.toString() !== userId.toString());
        await team.save();

        res.json(ApiResponse.success(null, 'Left team successfully'));
    } catch (error) {
        next(error);
    }
};

// Cancel invitation
export const cancelInvitation = async (req, res, next) => {
    try {
        const { teamId, inviteId } = req.params;
        const userId = req.User._id;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new AppError('Team not found', 404);
        }

        // Check permissions
        const userRole = await Team.getUserRole(teamId, userId);
        if (!userRole || userRole === 'member') {
            throw new AppError('You do not have permission to cancel invitations', 403);
        }

        team.invites = team.invites.filter(i => i._id.toString() !== inviteId.toString());
        await team.save();

        res.json(ApiResponse.success(null, 'Invitation cancelled successfully'));
    } catch (error) {
        next(error);
    }
};
