import express from 'express'
import { createUser, logInUser, getAllUsers } from '../controllers/userController.js'


const router = express.Router()

router.post("/register", createUser)
router.post("/login", logInUser)
router.get("/all", getAllUsers)

export default router
