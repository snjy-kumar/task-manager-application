import express from 'express';
import {
    createTeam,
    getMyTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    inviteUser,
    acceptInvitation,
    removeMember,
    updateMemberRole,
    leaveTeam,
    cancelInvitation
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import Joi from 'joi';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation schemas
const createTeamSchema = Joi.object({
    name: Joi.string().required().max(100),
    description: Joi.string().max(500).allow('')
});

const updateTeamSchema = Joi.object({
    name: Joi.string().max(100),
    description: Joi.string().max(500).allow(''),
    settings: Joi.object({
        allowMemberInvite: Joi.boolean(),
        taskApprovalRequired: Joi.boolean()
    })
});

const inviteUserSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'member').default('member')
});

const updateMemberRoleSchema = Joi.object({
    role: Joi.string().valid('admin', 'member').required()
});

// Team routes
router.post('/', validate(createTeamSchema), createTeam);
router.get('/', getMyTeams);
router.get('/:teamId', getTeamById);
router.put('/:teamId', validate(updateTeamSchema), updateTeam);
router.delete('/:teamId', deleteTeam);

// Member management
router.post('/:teamId/invite', validate(inviteUserSchema), inviteUser);
router.post('/accept-invite/:token', acceptInvitation);
router.delete('/:teamId/members/:memberId', removeMember);
router.put('/:teamId/members/:memberId/role', validate(updateMemberRoleSchema), updateMemberRole);
router.post('/:teamId/leave', leaveTeam);
router.delete('/:teamId/invites/:inviteId', cancelInvitation);

export default router;
