import express from 'express';
import {
    adminLogin,
    checkVerificationStatus,
    deleteAccount,
    getNotificationSettings,
    getTheme,
    getUserInfo,
    isAuthenticated,
    login,
    logout,
    recoverAccount,
    register,
    registerAdmin,
    resetPassword,
    saveNotificationSettings,
    saveTheme,
    // sendRecoveryOTP,
    sendResetOtp,
    sendVerifyOtp,
    updateUserRoles,
    user,
    verifyEmail,
    verifyResetOtp
} from '../controllers/authControllers.js';
import userAuth from '../middleware/userAuth.js';
import roleAuth from '../middleware/roleAuth.js';
import rateLimit from 'express-rate-limit';

const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 3 OTP requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

const authRouter = express.Router();

// Public routes
authRouter.post('/create-account', register);  // Allows users to create an account
authRouter.post('/login', login);  // Allows users to log in
authRouter.post('/logout', logout);  // Allows users to log out
authRouter.post('/send-reset-otp', otpRateLimiter, sendResetOtp);
authRouter.post('/verify-reset-otp', otpRateLimiter, verifyResetOtp);
authRouter.post('/reset-password', otpRateLimiter, resetPassword);

// Protected routes (require authentication)
authRouter.get('/get-user', userAuth, getUserInfo); // Get authenticated user's info
authRouter.delete('/delete-account', userAuth, roleAuth('user', 'admin'), deleteAccount);  // Allow 'user' or 'admin' to delete an account
authRouter.post('/recover-account', recoverAccount);  // Allow 'user' or 'admin' to recover account
// authRouter.post('/send-recover-account-otp', sendRecoveryOTP);  // Allow 'user' or 'admin' to send OTP for recovery
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);  // Allow authenticated users to send verification OTP
authRouter.post('/verify-account', userAuth, verifyEmail);  // Allow authenticated users to verify their account using OTP
authRouter.get('/is-auth', userAuth, isAuthenticated);  // Check if the user is authenticated
authRouter.post('/is-auth', userAuth, isAuthenticated);  // Check if the user is authenticated (POST)
authRouter.get('/get-notification-settings', userAuth, getNotificationSettings);  // Fetch user's notification settings
authRouter.post('/save-notification-settings', userAuth, saveNotificationSettings);  // Save user's notification settings
authRouter.get('/check-verification-status', userAuth, checkVerificationStatus);  // Check verification status of the user's account
authRouter.get('/get-theme', userAuth, getTheme);  // Get the user's theme settings
authRouter.post('/save-theme', userAuth, saveTheme);  // Save the user's theme settings

// Admin only routes
authRouter.post('/update-roles', userAuth, roleAuth('admin'), updateUserRoles);  // Allow admins to update user roles
authRouter.get('/users', userAuth, roleAuth('admin'), user);  // Fetch all users (admin only)

// TEMPORARY ROUTE - REMOVE AFTER CREATING ADMIN
authRouter.post('/create-admin', registerAdmin);  // Temporary route for creating an admin
authRouter.post('/admin-login', adminLogin);  // Temporary route for creating an admin

export default authRouter;
