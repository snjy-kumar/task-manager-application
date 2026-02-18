/**
 * Authentication Service
 * 
 * Business logic for authentication operations.
 * Separates business logic from controller layer.
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import environment from '../config/environment.js';
import logger from '../config/logger.js';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        { 
            email: user.email, 
            id: user._id, 
            role: user.role 
        },
        environment.jwtSecret,
        { expiresIn: '1d' }
    );
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        environment.jwtSecret,
        { expiresIn: '7d' }
    );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, environment.jwtSecret);
    } catch (error) {
        logger.warn(`Token verification failed: ${error.message}`);
        return null;
    }
};

/**
 * Generate password reset token
 */
export const generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    return { resetToken, hashedToken };
};

/**
 * Sanitize user data for response
 */
export const sanitizeUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

/**
 * Check if account is locked
 */
export const isAccountLocked = (user) => {
    return user.lockUntil && user.lockUntil > Date.now();
};

/**
 * Calculate remaining lock time in minutes
 */
export const getRemainingLockTime = (user) => {
    if (!user.lockUntil) return 0;
    return Math.ceil((user.lockUntil - Date.now()) / 60000);
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generatePasswordResetToken,
    sanitizeUser,
    isAccountLocked,
    getRemainingLockTime
};