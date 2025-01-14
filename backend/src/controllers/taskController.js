import Task from '../models/task.model.js'
import User from '../models/user.model.js'

const createTask = async (req, res) => {
    const { description, userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const task = await Task.create({ description, user: userId });
        user.tasks.push(task._id);
        await user.save();
        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getTask = async (req, res) => {}

const getTasks = async (req, res) => {}

const updateTask = async (req, res) => {}


const deleteTask = async (req, res) => {}

export { createTask, getTasks, getTask, updateTask, deleteTask }