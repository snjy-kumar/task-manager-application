import express from 'express';
import cookieParser from 'cookie-parser';
import {
    createUser,
    logInUser,
    logoutUser,
    refreshAccessToken,
    getAllUsers,
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} from '../controllers/userController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

const router = express.Router();

// Cookie parser for refresh tokens
router.use(cookieParser());

// ===== Public Routes =====
router.post("/register", authLimiter, validate(registerSchema), createUser);
router.post("/login", authLimiter, validate(loginSchema), logInUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);

// ===== Protected Routes =====

// Profile management
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

// Get current user (legacy endpoint)
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            _id: req.User._id,
            name: req.User.name,
            email: req.User.email,
            role: req.User.role,
            createdAt: req.User.createdAt,
            lastLogin: req.User.lastLogin
        }
    });
});

// Admin routes
router.get("/all", protect, getAllUsers);

export default router;
