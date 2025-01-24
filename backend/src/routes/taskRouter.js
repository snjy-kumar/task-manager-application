import express from 'express'


import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/taskController.js'

const router = express.Router()

router.post("/tasks", createTask) // Create a new task #DONE
router.get("/tasks", getTasks) // Get all tasks #DONE
router.get("/task/:id", getTask) // Get a task #DONE
router.put("/task/:id", updateTask) // Update a task #DONE
router.delete("/task/:id", deleteTask) // Delete a task #DONE


export default router