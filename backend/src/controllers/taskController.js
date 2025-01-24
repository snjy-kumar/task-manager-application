import Task from '../models/task.model.js'
import User from '../models/user.model.js'

const createTask = async (req, res) => {
    const { description, title, userId, status='Pending', dueDate } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(!title || !description || !userId || !dueDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const task = await Task.create({title, description, status, user: userId, dueDate});  
        user.tasks.push(task._id);
        await user.save();
        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to Create Task', error });
    }
}


const getTasks = async (req, res) => {
    try {
        const task = await Task.find();
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });   
    }
}

const getTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById({_id: id});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    try {
        const task = await Task.findById({_id: id});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.title = title
        task.description = description
        task.status = status
        task.priority = priority
        task.dueDate = dueDate
       await task.save();
       return res.status(200).json({message: 'Task updated successfully', task});
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


const deleteTask = async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const task = await Task.findById(id);
        // console.log(task);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { createTask, getTasks, getTask, updateTask, deleteTask }