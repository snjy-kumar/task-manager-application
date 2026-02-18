/**
 * Authentication Controller
 * 
 * This file provides additional authentication-related controllers.
 * Main auth is handled in userController.js (login, register, logout, etc.)
 * This file can be used for additional auth features like:
 * - Email verification
 * - Password reset
 * - Two-factor authentication
 * - OAuth integration
 */

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import environment from '../config/environment.js';
import logger from '../config/logger.js';
import { BadRequestError, UnauthorizedError, NotFoundError, asyncHandler } from '../middleware/errorHandler.js';
import crypto from 'crypto';

/**
 * Verify JWT token
 */
export const verifyToken = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, environment.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
        throw new UnauthorizedError('Invalid token');
    }

    res.status(200).json({
        success: true,
        valid: true,
        user
    });
});

/**
 * Request password reset (generates token)
 * TODO: Implement email sending
 */
export const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        // Don't reveal if email exists for security
        logger.warn(`Password reset requested for non-existent email: ${email}`);
        return res.status(200).json({
            success: true,
            message: 'If that email exists, a password reset link has been sent'
        });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // TODO: Send email with resetToken
    logger.info(`Password reset requested for: ${email}`);

    res.status(200).json({
        success: true,
        message: 'If that email exists, a password reset link has been sent',
        // Remove this in production - only for development
        ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
});

/**
 * Reset password with token
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        throw new BadRequestError('Token and new password are required');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
        throw new BadRequestError('Invalid or expired reset token');
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for user: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
    });
});

export default {
    verifyToken,
    requestPasswordReset,
    resetPassword
};