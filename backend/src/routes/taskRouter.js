import express from 'express'


import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/taskController.js'

const router = express.Router()

router.post("/create", createTask)
router.get("/all", getTasks)
router.get("/:id", getTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)


export default router