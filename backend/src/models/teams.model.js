import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [100, "Name cannot exceed 100 characters"]
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {timestamps: true});

const Team = mongoose.model("Team", teamSchema);

export default Team;

