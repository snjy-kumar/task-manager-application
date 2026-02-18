import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        default: 'member'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const teamInviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'expired'],
        default: 'pending'
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [100, "Name cannot exceed 100 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, "Description cannot exceed 500 characters"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [teamMemberSchema],
    invites: [teamInviteSchema],
    settings: {
        allowMemberInvite: {
            type: Boolean,
            default: false
        },
        taskApprovalRequired: {
            type: Boolean,
            default: false
        }
    }
}, {timestamps: true});

// Index for faster queries
teamSchema.index({ owner: 1 });
teamSchema.index({ 'members.user': 1 });
teamSchema.index({ 'invites.email': 1 });
teamSchema.index({ 'invites.token': 1 });

// Static method to check if user is team member
teamSchema.statics.isMember = async function(teamId, userId) {
    const team = await this.findById(teamId);
    if (!team) return false;
    return team.members.some(m => m.user.toString() === userId.toString()) || 
           team.owner.toString() === userId.toString();
};

// Static method to get user role in team
teamSchema.statics.getUserRole = async function(teamId, userId) {
    const team = await this.findById(teamId);
    if (!team) return null;
    if (team.owner.toString() === userId.toString()) return 'owner';
    const member = team.members.find(m => m.user.toString() === userId.toString());
    return member ? member.role : null;
};

const Team = mongoose.model("Team", teamSchema);

export default Team;

