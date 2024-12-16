import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [100, "Name cannot exceed 100 characters"]
    }, 
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,   
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    deletedAt: {
        type: Date
    },
})

const User = mongoose.model("Users", userSchema);

export default User;