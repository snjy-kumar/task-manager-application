import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
     
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
    tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task', // Reference to Task schema
    },
  ],
     
}, {timestamps: true})

const User = mongoose.model("Users", userSchema);

export default User;