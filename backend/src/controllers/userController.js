import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import environment from '../config/environment.js';
import logger from '../config/logger.js';
import { BadRequestError, UnauthorizedError, LockedError, ConflictError, NotFoundError, asyncHandler } from '../utils/errors.js';

// Account lockout configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * Login user with account lockout protection
 */
export const logInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and select password field (normally hidden)
    const user = await User.findOne({ email }).select('+password +failedLoginAttempts +lockUntil');

    if (!user) {
        logger.warn(`Login attempt for non-existent email: ${email}`);
        throw new BadRequestError('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
        logger.warn(`Locked account login attempt: ${email}`);
        throw new LockedError(`Account locked. Try again in ${remainingTime} minutes.`);
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        // Increment failed attempts
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

        // Lock account if max attempts reached
        if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_TIME);
            await user.save();
            logger.warn(`Account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts: ${email}`);
            throw new LockedError('Account locked due to too many failed attempts. Try again in 15 minutes.');
        }

        await user.save();
        const attemptsRemaining = MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts;
        logger.warn(`Failed login attempt for: ${email} (${attemptsRemaining} attempts remaining)`);
        throw new BadRequestError(`Invalid password. ${attemptsRemaining} attempts remaining.`);
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        environment.jwtSecret,
        { expiresIn: '1d' } // 1 day for better UX
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
        { id: user._id },
        environment.jwtSecret,
        { expiresIn: '7d' }
    );

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token: accessToken
    });
});

/**
 * Register new user with password validation
 */
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        throw new ConflictError('User already exists with this email');
    }

    // Hash password with higher cost factor for production
    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
    });
    await user.save();

    // Generate access token
    const accessToken = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        environment.jwtSecret,
        { expiresIn: '1d' } // 1 day for better UX
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
        { id: user._id },
        environment.jwtSecret,
        { expiresIn: '7d' }
    );

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token: accessToken
    });
});

/**
 * Refresh access token using refresh token from cookie
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new UnauthorizedError('No refresh token provided');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, environment.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        environment.jwtSecret,
        { expiresIn: '1d' } // 1 day for better UX
    );

    logger.debug(`Token refreshed for user: ${user.email}`);

    res.status(200).json({
        success: true,
        token: newAccessToken
    });
});

/**
 * Logout user - clear refresh token cookie
 */
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    logger.info('User logged out');

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * Get all users (admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -failedLoginAttempts -lockUntil');

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.User._id)
        .select('-password -failedLoginAttempts -lockUntil -verificationToken -passwordResetToken -passwordResetExpires')
        .populate('tasks', 'title status priority dueDate');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    res.status(200).json({
        success: true,
        user
    });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findById(req.User._id);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new ConflictError('Email already in use');
        }
        user.email = email.toLowerCase();
    }

    if (name) {
        user.name = name.trim();
    }

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new BadRequestError('Current password and new password are required');
    }

    // Get user with password
    const user = await User.findById(req.User._id).select('+password');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

/**
 * Delete user account
 */
export const deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new BadRequestError('Password is required to delete account');
    }

    // Get user with password
    const user = await User.findById(req.User._id).select('+password');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new BadRequestError('Incorrect password');
    }

    // Delete user and their tasks
    const Task = (await import('../models/task.model.js')).default;
    await Task.deleteMany({ user: user._id });
    await user.deleteOne();

    // Clear cookies
    res.clearCookie('refreshToken');

    logger.info(`Account deleted: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
    });
});
