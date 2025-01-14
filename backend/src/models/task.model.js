import mongoose, { Schema } from 'mongoose';

// Task Schema
const TaskSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Task = mongoose.model('Task', TaskSchema);
  
export default Task;