import mongoose, { Schema } from 'mongoose';

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['In Progress','Pending', 'Completed', 'Archived'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    dueDate: {
      type: Date,
      required: true,
    },

    assignees: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
    },
  }, { timestamps: true });
  
  const Task = mongoose.model('Task', TaskSchema);
  
export default Task;