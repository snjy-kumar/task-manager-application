import express from 'express'
import { createUser, getUsers } from '../controllers/userController.js'


const router = express.Router()

router.post("/register", createUser)
router.get("/all", getUsers)

export default router