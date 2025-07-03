import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import NotificationSettings from '../models/notification.model.js';
import Event from '../models/event.model.js';
import transporter from '../config/nodemailer.js';
import crypto from 'crypto';
import User from '../models/user.models.js';
import AccountRecoveryOTP from '../models/accountRecoveryOTPS.model.js';
import { sendEmail } from '../config/cronJob.js';


console.log('Admin code from env:', {
    adminCodeValue: process.env.aveADMIN_SECRET_CODE,
    adminCodeType: typeof process.env.aveADMIN_SECRET_CODE,
    adminCodeLength: process.env.aveADMIN_SECRET_CODE?.length
});

export const register = async (req, res) => {
    try {
        const { userName, email, password, adminCode } = req.body;
        
        // Debug logs
        console.log('Registration attempt details:', {
            userName,
            email,
            adminCodeProvided: adminCode,
            envAdminCode: process.env.aveADMIN_SECRET_CODE,
            adminCodeMatches: adminCode === process.env.aveADMIN_SECRET_CODE,
            adminCodeType: typeof adminCode,
            envCodeType: typeof process.env.aveADMIN_SECRET_CODE
        });

        if (!userName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if this is an admin registration
        if (adminCode) {
            // Trim both codes to ensure no whitespace issues
            const trimmedAdminCode = adminCode.trim();
            const trimmedEnvCode = process.env.aveADMIN_SECRET_CODE.trim();
            
            if (trimmedAdminCode !== trimmedEnvCode) {
                console.log('Admin code mismatch:', {
                    provided: trimmedAdminCode,
                    expected: trimmedEnvCode,
                    length1: trimmedAdminCode.length,
                    length2: trimmedEnvCode.length
                });
                return res.status(403).json({ 
                    success: false, 
                    message: "Invalid admin code" 
                });
            }
        }

        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        }

        // Determine if user is an admin
        const isAdmin = adminCode === process.env.aveADMIN_SECRET_CODE;

        // Set roles based on admin status
        const roles = isAdmin ? ['admin', 'user'] : ['user'];

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with roles
        const user = new User({ 
            userName, 
            email, 
            password: hashedPassword,
            roles,
            isAccountVerified: isAdmin // Auto-verify admin accounts
        });
        await user.save();

        // Set default notification settings for new user
        const defaultNotificationSettings = new NotificationSettings({
            userId: user._id,
            push: true,
            email: true,
            sms: false
        });
        await defaultNotificationSettings.save();

        // Generate token
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie first
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send success response immediately
        res.json({
            success: true,
            message: "Registration Successful",
            user: { id: user._id, userName: user.userName, email: user.email },
            accessToken
        });

        // Define different welcome messages for admins and regular users
        const mailSubject = isAdmin ? 'Welcome, Admin!' : 'Welcome to Event Calendar App';
        const mailText = isAdmin
            ? `Dear ${userName},\n\nWelcome to the Event Calendar App as an administrator! You now have the ability to manage events, users, and oversee platform activities. Log in to your admin dashboard and start managing.\n\nBest,\nEvent Calendar Team`
            : `Welcome, ${userName}!\n\nThank you for signing up for the Event Calendar App. You can now create, view, and manage your events effortlessly. Enjoy your experience!\n\nBest,\nEvent Calendar Team`;
        
        // Call sendEmail directly here
        sendEmail(email, mailSubject, mailText).catch(emailError => {
            console.error("Welcome email failed to send:", emailError);
        });
        

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Register new admin route
export const registerAdmin = async (req, res) => {
    try {
        const { userName, email, password, adminCode } = req.body;

        // Verify admin code
        if (adminCode !== process.env.aveADMIN_SECRET_CODE) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid admin code' 
            });
        }

        // Check if admin already exists (optional improvement)
        const existingAdmin = await User.findOne({ roles: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "An admin already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const admin = new User({
            userName,
            email,
            password: hashedPassword,
            roles: ['admin', 'user'],
            isAccountVerified: true
        });
        
        await admin.save();

        // Set default notification settings for new admin
        const defaultNotificationSettings = new NotificationSettings({
            userId: admin._id,
            push: true,
            email: true,
            sms: false
        });
        await defaultNotificationSettings.save();

        // Send welcome email to the admin
        const mailSubject = 'Welcome, Admin!';
        const mailText = `Dear ${userName},\n\nWelcome to the Event Calendar App as an administrator! You now have the ability to manage events, users, and oversee platform activities. Log in to your admin dashboard and start managing.\n\nBest,\nEvent Calendar Team`;

        sendEmail(email, mailSubject, mailText).catch(emailError => {
            console.error("Welcome email failed to send:", emailError);
        });

        return res.json({ success: true, message: 'Admin created successfully' });
    } catch (error) {
        console.error("Error in registerAdmin:", error);  // Log the error
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Login route
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"  // Account doesn't exist
            });
        }

        // Check if the user is an admin and block them from logging in as a common user
        if (user.roles.includes('admin')) {
            return res.status(403).json({
                success: false,
                message: "Admins cannot log in through this route. Please use the admin login."
            });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ success: false, message: "Your account is inactive. Please contact support." });
        }        

        // Check if account is deleted and within the 7-day recovery period
        if (user.deleted && user.deletedAt && new Date() < user.deletedAt.setDate(user.deletedAt.getDate() + 7)) {
            return res.status(403).json({
                success: false,
                message: "Your account has been temporarily deleted. You can recover it within 7 days using the OTP sent to your email."
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT access token
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Set the cookie with the access token
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });

        // Respond with success
        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                roles: user.roles  // Include roles in response
            },
            accessToken
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Admin login route
export const adminLogin = async (req, res) => {
    try {
        const { email, password, adminCode } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"  // Account doesn't exist
            });
        }

        // Check if the user is an admin
        if (!user.roles.includes('admin')) {
            return res.status(403).json({
                success: false,
                message: "This account is not an admin."
            });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ success: false, message: "Your account is inactive. Please contact support." });
        }        

        // Admin code validation
        if (adminCode !== process.env.aveADMIN_SECRET_CODE) {
            return res.status(403).json({
                success: false,
                message: "Invalid admin code."
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT access token
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Set the cookie with the access token
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });

        // Respond with success
        res.json({
            success: true,
            message: "Admin login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                roles: user.roles  // Include roles in response
            },
            accessToken
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const logout = async (req, res) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            });
    
            return res.json({ success: true, message: "Logged Out" });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
};

// Updated getUser route
export const getUserInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID is missing" });
        }

        // Fetch user details and check if they are an admin
        const userPromise = User.findById(userId).select("userName email isAccountVerified roles").lean();
        const user = await userPromise;
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isAdmin = user.roles?.includes("admin");
        let users = [];

        if (isAdmin) {
            // Fetch all users' data in parallel using Promise.all()
            users = await User.find().select("userName email roles status").lean();
        }

        return res.json({
            success: true,
            user: {
                id: userId,
                userName: user.userName,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                roles: user.roles,
            },
            users: isAdmin ? users : undefined, // Avoid sending empty array if not admin
            message: isAdmin ? "Admin user info and all users retrieved successfully" : "User retrieved successfully"
        });

    } catch (error) {
        console.error("Error retrieving user info:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from authenticated request

        if (!userId) {
            return res.status(401).json({ error: true, message: "Unauthorized: User ID is missing" });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found." });
        }

        // Generate OTP for account recovery (6-digit for consistency with other OTPs)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP before saving
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const otpExpiration = new Date();
        otpExpiration.setDate(otpExpiration.getDate() + 7); // Set expiration to 7 days

        // Save hashed OTP to the database
        await AccountRecoveryOTP.create({
            userId,
            email: user.email,
            otp: hashedOtp,
            type: 'deletion',
            expiration: otpExpiration,
        });

        // Send OTP to the user's email
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                <h2 style="color: #2c3e50;">Account Deletion Scheduled</h2>
                <p style="color: #7f8c8d; font-size: 16px;">We received a request to delete your account. If you didn't make this request, you can simply ignore this email.</p>
                <p style="color: #7f8c8d; font-size: 16px;">To recover your account, please use the following OTP within 7 days:</p>
                <h1 style="letter-spacing: 8px; color: #e74c3c;">${otp}</h1>
                <p style="color: #7f8c8d; font-size: 14px;">This OTP will expire in 7 days. If you wish to recover your account, enter it during the recovery process.</p>
                <small>If you did not request this, please disregard this message. Your account will be permanently deleted after 7 days if not recovered.</small>
            </div>
        `;
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Deletion OTP',
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);

        // Soft delete user by setting the 'deleted' flag and timestamp
        user.deleted = true;
        user.deletedAt = new Date(); // Set the time when the account was marked for deletion
        await user.save();

        // Soft delete related events
        await Event.updateMany(
            { userId },
            { deleted: true, deletedAt: new Date() }
        );

        // Soft delete notification settings
        await NotificationSettings.updateOne(
            { userId },
            { deleted: true, deletedAt: new Date() }
        );

        

        // Clear authentication cookie
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

        return res.json({
            success: true,
            message: "Account marked for deletion. You can recover it within 7 days using the OTP sent to your email."
        });

    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const recoverAccount = async (req, res) => {
    try {
        const { otp, email } = req.body; // OTP and email provided by the user

        if (!otp || !email) {
            return res.status(400).json({ error: true, message: "OTP and email are required." });
        }

        // Find the user by email first
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found." });
        }

        // Find the account recovery OTP for the user's ID
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const recoveryRecord = await AccountRecoveryOTP.findOne({ 
            otp: hashedOtp, 
            userId: user._id,
            type: 'deletion'
        });

        if (!recoveryRecord) {
            return res.status(400).json({ error: true, message: "Invalid OTP." });
        }

        // Check if OTP has expired
        const currentTime = new Date();
        if (currentTime > recoveryRecord.expiration) {
            return res.status(400).json({ error: true, message: "OTP has expired. Your account has been permanently deleted." });
        }

        // Restore the user's account
        user.deleted = false;       // Reset the deleted flag
        user.deletedAt = null;      // Clear the deletion timestamp
        user.isAccountVerified = true;
        await user.save();

        // Delete OTP record after successful recovery
        await AccountRecoveryOTP.deleteOne({ _id: recoveryRecord._id });

        // Send recovery confirmation email
        const recoveryMailSubject = 'Account Recovery Confirmation';
        const recoveryMailText = `Dear ${user.userName},\n\nYour account has been successfully recovered. You can now log in and access all your data.\n\nBest,\nEvent Calendar Team`;

        // Send recovery email after account recovery
        sendEmail(user.email, recoveryMailSubject, recoveryMailText).catch(emailError => {
            console.error("Account recovery email failed to send:", emailError);
        });

        return res.json({ success: true, message: "Your account has been successfully recovered." });

    } catch (error) {
        console.error("Error recovering account:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// export const sendRecoveryOTP = async (req, res) => {

//     try {
//         const { email } = req.body;

//         // Validate email
//         if (!email) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Email is required" 
//             });
//         }

//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: "No account associated with this email" 
//             });
//         }

//         // Check if user is blocked or inactive
//         if (!user.isAccountVerified) {
//             return res.status(403).json({ 
//                 success: false, 
//                 message: "Account is not verified" 
//             });
//         }

//         // Generate 6-digit OTP
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         // Create or update OTP record
//         await AccountRecoveryOTP.findOneAndUpdate(
//             { email, type: 'recovery' }, // ✅ Only update recovery OTPs
//             {
//                 otp,
//                 userId: user._id,
//                 expiration: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
//                 createdAt: new Date(),
//                 type: 'recovery' // ✅ Mark as recovery OTP
//             },
//             { upsert: true, new: true }
//         );        

//         // Send OTP via email
//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: email,
//             subject: 'Account Recovery OTP',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2>Account Recovery</h2>
//                     <p>Your OTP for account recovery is:</p>
//                     <h1 style="letter-spacing: 10px; color: #4a4a4a;">${otp}</h1>
//                     <p>This OTP is valid for 15 minutes. Do not share it with anyone.</p>
//                     <small>If you did not request this, please ignore this email.</small>
//                 </div>
//             `
//         };

//         await transporter.sendMail(mailOptions);

//         return res.json({ 
//             success: true, 
//             message: "Recovery OTP sent to your email" 
//         });

//     } catch (error) {
//         console.error("OTP Send Error:", error);
//         return res.status(500).json({ 
//             success: false, 
//             message: "Failed to send recovery OTP" 
//         });
//     }
// };

export const sendVerifyOtp = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging
        console.log("Received userId:", req.user.id); // Debugging log

        const userId = req.user.id.toString(); // Convert ObjectId to string

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        console.log("Received userId as string:", userId); // Debugging log

        // Check if the user ID is valid MongoDB ObjectId (now as string)
        if (userId.length !== 24) {
            return res.status(400).json({ success: false, message: "Invalid User ID format" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found in database" });
        }

        console.log("User found:", user.email); // Debugging log

        // Check if account is already verified
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        // Check user's email notification settings
        const settings = await NotificationSettings.findOne({ userId });
        if (!settings || !settings.email) {
            return res.status(400).json({
                success: false,
                message: "Email notifications are turned off. Please enable them in your settings."
            });
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Hash OTP for security
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Store OTP and expiry time
        user.verifyOtp = hashedOtp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24-hour expiry

        await user.save();

        if (!user.email) {
            return res.status(400).json({ success: false, message: "User email is missing" });
        }

        console.log("Sending OTP to:", user.email); // Debugging log

        const mailSubject = 'Account Verification OTP';
const mailText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50;">Account Verification OTP</h2>
        <p style="color: #7f8c8d; font-size: 16px;">Your OTP for account verification is:</p>
        <h1 style="letter-spacing: 8px; color: #e74c3c;">${otp}</h1>
        <p style="color: #7f8c8d; font-size: 14px;">This OTP will expire in 24 hours. If you did not request this, please disregard this message.</p>
        <p style="color: #e74c3c;">For your security, please do not share this OTP with anyone.</p>
        <small>If you didn’t make this request, your account remains unverified. Please disregard this message.</small>
    </div>
`;

// Send verification email
sendEmail(user.email, mailSubject, mailText).catch(emailError => {
    console.error("Verification email failed to send:", emailError);
});

        res.status(200).json({ success: true, message: "Verification OTP sent to email" });
    } 
    catch (error) {
        console.error("Error in sendVerifyOtp:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const userId = req.user?.id; // Extract from token

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID is missing" });
        }

        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Hash the provided OTP for comparison
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (!user.verifyOtp || user.verifyOtp !== hashedOtp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // Mark the account as verified (but keep OTP for password reset)
        user.isAccountVerified = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        console.log("Cookies received:", req.cookies); // Debugging

        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        }

        return res.json({ success: true, message: "User is authenticated." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        const notificationSettings = await NotificationSettings.findOne({ userId: user._id });
        if (!notificationSettings || !notificationSettings.email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email notifications must be enabled to reset your password.",
                notificationIssue: true
            });
        }

        // Generate a 6-digit OTP and hash it for security
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        // Delete any existing OTP records for this user and type
        await AccountRecoveryOTP.deleteMany({
            userId: user._id,
            type: "password_reset"
        });

        // Store OTP in a separate collection with 10-minute expiration
        await AccountRecoveryOTP.create({
            userId: user._id,
            email: user.email,
            otp: hashedOtp,
            type: "password_reset",
            expiration: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send OTP email
        await sendEmail(
            email,
            "Password Reset OTP",
            `Hello ${user.userName},\n\nYour OTP for password reset is: ${otp}.\n\nThis OTP expires in 10 minutes.`
        );

        res.status(200).json({ success: true, message: "Password reset OTP sent to email" });
    } catch (error) {
        console.error("Error in sendResetOtp:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required." });
        }

        // Retrieve the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Retrieve OTP record by user ID, email and type
        const otpRecord = await AccountRecoveryOTP.findOne({
            userId: user._id,
            email,
            type: "password_reset",
            expiration: { $gt: new Date() }, // Ensure OTP is not expired
        });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // Hash the input OTP for comparison
        const hashedInputOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");

        // Compare the hashed input OTP to the stored OTP
        if (hashedInputOtp !== otpRecord.otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // Mark OTP as verified but don't delete yet (we'll need it for the reset password step)
        res.status(200).json({ success: true, message: "OTP verified!" });
    } catch (error) {
        console.error("Error in verifyResetOtp:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        console.log("Reset Password Request Body:", req.body);
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "Email, OTP, and new password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        console.log("User found:", Boolean(user), "User has password:", Boolean(user?.password));

        // Retrieve and verify OTP
        const otpRecord = await AccountRecoveryOTP.findOne({
            userId: user._id,
            email,
            type: "password_reset",
            expiration: { $gt: new Date() }, // Ensure OTP is still valid
        });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        const hashedInputOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");

        if (hashedInputOtp !== otpRecord.otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // Hash and update the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        // Delete the used OTP record
        await AccountRecoveryOTP.deleteMany({ userId: user._id, type: "password_reset" });

        res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Get User Notification Settings
export const getNotificationSettings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }

        const userId = req.user.id;
        const settings = await NotificationSettings.findOne({ userId }).lean();

        if (!settings) {
            return res.status(404).json({ success: false, message: "Settings not found." });
        }

        return res.json({ success: true, settings });
    } catch (error) {
        console.error("Error retrieving notification settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Save User Notification Settings
export const saveNotificationSettings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }

        const userId = req.user.id;
        const { push, email, sms } = req.body;

        if (typeof push !== "boolean" || typeof email !== "boolean" || typeof sms !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid input data." });
        }

        const settings = await NotificationSettings.findOneAndUpdate(
            { userId },
            { push, email, sms },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.json({ success: true, settings });
    } catch (error) {
        console.error("Error saving notification settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const checkVerificationStatus = async (req, res) => {
    try {
        const userId = req.user.id;  // User ID is set by userAuth middleware

        // Fetch the user by their ID from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // If the user has the 'admin' role, they are automatically verified
        if (user.roles.includes('admin')) {
            return res.status(200).json({ success: true, isVerified: true });
        }

        // Check if the user's account is verified
        const isVerified = user.isAccountVerified;  // Assuming `isAccountVerified` is the boolean field in your database

        return res.status(200).json({
            success: true,
            isVerified,  // Send the verification status back to the client
        });
    } catch (error) {
        console.error('Error checking verification status:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// Get user theme
export const getTheme = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming authentication middleware sets req.user
        const user = await User.findById(userId);
        res.json({ isNightMode: user.isNightMode });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching theme preference' });
    }
};

// Update user theme
export const saveTheme = async (req, res) => {
    try {
        const userId = req.user.id;
        const { isNightMode } = req.body;
        await User.findByIdAndUpdate(userId, { isNightMode });
        res.json({ success: true, isNightMode });
    } catch (error) {
        res.status(500).json({ message: 'Error updating theme preference' });
    }
};

// Add new controller for managing roles
export const updateUserRoles = async (req, res) => {
    try {
        const { userId, roles } = req.body;

        // Validate roles
        const validRoles = ['user', 'admin', 'moderator'];
        const sanitizedRoles = roles.filter(role => validRoles.includes(role));
        
        // Ensure at least 'user' role is present
        if (!sanitizedRoles.includes('user')) {
            sanitizedRoles.push('user');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { roles: sanitizedRoles },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        return res.json({ 
            success: true, 
            user: updatedUser,
            message: "User roles updated successfully" 
        });
    } catch (error) {
        console.error("Error updating roles:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const user = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};
