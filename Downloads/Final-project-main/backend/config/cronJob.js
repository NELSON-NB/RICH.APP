import cron from "node-cron";
import User from "../models/user.models.js";
import Event from "../models/event.model.js";
import NotificationSettings from "../models/notification.model.js";
import transporter from "./nodemailer.js";

// Function to send emails
export const sendEmail = async (to, subject, text) => {
    try {
        if (!to || typeof to !== "string") {
            console.error("Invalid recipient email:", to);
            return; // Exit function early if email is invalid
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};


// Cron Job 1: Mark users inactive after 6 months
const markInactiveJob = cron.schedule("0 0 * * *", async () => {
    console.log("Checking for users to mark as inactive...");
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const inactiveUsers = await User.find({ 
            role: "user",
            lastActive: { $lt: sixMonthsAgo },
            status: "active",
        });

        for (const user of inactiveUsers) {
            user.status = "inactive";
            await user.save();

            // Send notification email
            await sendEmail(
                user.email,
                "Account Inactive Notice",
                `Dear ${user.userName},\n\nYour account has been marked as inactive due to inactivity for the past 6 months. If you wish to continue using your account, please log in.\n\nBest regards,\nEvent Calendar Team`
            );

            console.log(`User ${user.email} marked as inactive.`);
        }
    } catch (error) {
        console.error("Error marking users as inactive:", error);
    }
});

// Cron Job 2: Soft delete users after 12 months of inactivity
const softDeleteJob = cron.schedule("0 0 * * *", async () => {
    console.log("Checking for users to soft delete...");
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const usersToDelete = await User.find({
            role: "user",
            lastActive: { $lt: twelveMonthsAgo },
            status: "inactive",
            deleted: false, 
        });

        for (const user of usersToDelete) {
            user.deleted = true;
            user.deletedAt = new Date();
            await user.save();

            // Send OTP email for account recovery
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await sendEmail(
                user.email,
                "Account Deletion Warning",
                `Dear ${user.userName},\n\nYour account has been scheduled for deletion due to inactivity. If you wish to recover it, use the following OTP within 7 days:\n\nOTP: ${otp}\n\nBest regards,\nEvent Calendar Team`
            );

            console.log(`User ${user.email} soft deleted.`);
        }
    } catch (error) {
        console.error("Error soft deleting users:", error);
    }
});

// Cron Job 3: Permanently delete users after 7-day recovery period
const deleteExpiredAccountsJob = cron.schedule("0 0 * * *", async () => {
    console.log("Checking for expired deletions...");
    try {
        const now = new Date();
        const expiredDeletions = await User.find({
            deleted: true,
            deletedAt: { $lt: new Date(now - 7 * 24 * 60 * 60 * 1000) },
        });

        for (const user of expiredDeletions) {
            await User.deleteOne({ _id: user._id });
            await Event.deleteMany({ userId: user._id });
            await NotificationSettings.deleteOne({ userId: user._id });

            await sendEmail(
                user.email,
                "Account Permanently Deleted",
                `Dear ${user.userName},\n\nYour account has been permanently deleted due to inactivity. If you believe this was a mistake, please contact us immediately.\n\nBest regards,\nEvent Calendar Team`
            );

            console.log(`User ${user.email} permanently deleted.`);
        }
    } catch (error) {
        console.error("Error during expired deletion check:", error);
    }
});

// Start all cron jobs
markInactiveJob.start();
softDeleteJob.start();
deleteExpiredAccountsJob.start();

// ✅ Export as an object
export default {
    markInactiveJob,
    softDeleteJob,
    deleteExpiredAccountsJob,
};
