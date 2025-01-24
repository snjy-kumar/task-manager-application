import express from 'express'
import { createUser, logInUser, getAllUsers } from '../controllers/userController.js'

import { authMiddleware as protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/register", createUser)
router.post("/login", logInUser)
router.get("/all",protect, getAllUsers)
router.get("/protect", protect, (req, res) => {
    res.status(200).json({message: "Protected route"})
})

export default router
