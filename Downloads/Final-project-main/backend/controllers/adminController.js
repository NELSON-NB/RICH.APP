import { sendEmail } from "../config/cronJob.js";
import Event from "../models/event.model.js";
import Notification from "../models/notif.model.js";
import NotificationSettings from "../models/notification.model.js";
import User from "../models/user.models.js";
import { getStartDateByTimeRange } from "../utilities.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
    try {
        // Ensure the request is from an authenticated user with admin role
        if (!req.user?.roles?.includes("admin")) {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }

        // Get status filter from query params (case insensitive)
        const statusFilter = req.query.status?.toLowerCase();
        const validStatuses = ["active", "inactive"];
        const filter = validStatuses.includes(statusFilter) ? { status: statusFilter } : {};

        // Fetch users with optimized query
        const users = await User.find(filter).select("userName email roles status").lean();

        return res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete user - Updated to use URL params instead of request body
export const deleteUser = async (req, res) => {
    try {
        // Check authorization
        if (!req.user || !req.user.roles.includes("admin")) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        // Extract userId from URL parameters
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        // Find and delete user
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Delete related notification settings
        await NotificationSettings.deleteOne({ userId });
        
        // Notify user about account deletion
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                <h2 style="color: #e74c3c;">Your Account Has Been Deleted</h2>
                <p style="color: #7f8c8d;">An admin has permanently deleted your account for security reasons. If you believe this was a mistake, please contact support.</p>
                <small>For security, this action is irreversible.</small>
            </div>
        `;
        
        sendEmail(user.email, "Account Deletion Notification", emailContent).catch(err => {
            console.error("Failed to send deletion email:", err);
        });
        
        res.json({ success: true, message: "User permanently deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

// Edit user details - Updated to use URL params and handle request body properly
export const editUser = async (req, res) => {
    try {
        // Check authorization
        if (!req.user || !req.user.roles.includes("admin")) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        // Extract userId from URL parameters
        const { userId } = req.params;
        
        // Extract update fields from request body
        const { userName, roles, status, email } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        // Build update object with only provided fields
        const updateFields = {};
        if (userName) updateFields.userName = userName;
        if (email) updateFields.email = email;
        if (status) updateFields.status = status;
        
        // Handle roles specially to ensure proper format
        if (roles) {
            // Convert string to array if needed (frontend might send comma-separated string)
            updateFields.roles = typeof roles === 'string' 
                ? roles.split(',').map(role => role.trim())
                : roles;
        }
        
        // Find and update the user
        const user = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );
        
        // Handle case when the user is not found
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Return success response with the updated user
        res.json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Error updating user" });
    }
};

// Add a new endpoint for status update to match frontend implementation
// export const updateUserStatus = async (req, res) => {
//     try {
//         // Check authorization
//         if (!req.user || !req.user.roles.includes("admin")) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }
        
//         // Extract userId from URL parameters
//         const { userId } = req.params;
        
//         // Extract status from request body
//         const { status } = req.body;
        
//         if (!userId) {
//             return res.status(400).json({ success: false, message: "User ID is required" });
//         }
        
//         if (!status || !['active', 'inactive'].includes(status)) {
//             return res.status(400).json({ success: false, message: "Valid status (active/inactive) is required" });
//         }
        
//         // Find and update the user status
//         const user = await User.findByIdAndUpdate(
//             userId,
//             { status },
//             { new: true, runValidators: true }
//         );
        
//         // Handle case when the user is not found
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
        
//         // Return success response with the updated user
//         res.json({ success: true, message: "User status updated successfully", user });
//     } catch (error) {
//         console.error("Error updating user status:", error);
//         res.status(500).json({ success: false, message: "Error updating user status" });
//     }
// };







// Add a user without password (user must reset password to log in)
export const addUser = async (req, res) => {
    try {
        if (!req.user || !req.user.roles.includes("admin")) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { userName, email, roles, status } = req.body;

        if (!userName || !email || !roles || !status) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        // Create user WITHOUT a password
        const newUser = new User({ userName, email, roles, status });
        await newUser.save();

        const defaultNotificationSettings = new NotificationSettings({
            userId: newUser._id,
            push: true,
            email: true,
            sms: false
        });
        await defaultNotificationSettings.save();


        // Send an email telling the user to set their password
        await sendEmail(
            email,
            "Welcome! Set Your Password",
            `Hello ${userName},\n\nYour account has been created. Please reset your password to log in.\n\nBest,\nEvent Calendar Team`
        );

        res.status(201).json({ success: true, message: "User added successfully. They must reset their password before logging in.", user: newUser });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ success: false, message: "Error adding user" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        if (!req.user || !req.user.roles.includes("admin")) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { searchTerm } = req.query;
        
        if (!searchTerm) {
            return res.status(400).json({ success: false, message: "Search term is required" });
        }

        const users = await User.find({
            deleted: false,
            $or: [
                { userName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        }).select("-password");

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        res.json({ success: true, users });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ success: false, message: "Error searching users" });
    }
};

export const getUserStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Get today's start (00:00:00) and tomorrow's start (to limit today's range)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 86400000); // Adds 24 hours

        // Get users created today
        const newUsersTodayCount = await User.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        // Get old users (registered more than 1 month ago)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const oldUsers = await User.countDocuments({ createdAt: { $lt: oneMonthAgo } });

        // Get active & inactive users
        const activeUsers = await User.countDocuments({ status: "active" });
        const inactiveUsers = await User.countDocuments({ status: "inactive" });

        res.json({
            success: true,
            statistics: { totalUsers, newUsersToday: newUsersTodayCount, oldUsers, activeUsers, inactiveUsers }
        });
    } catch (error) {
        console.error("Error fetching user statistics:", error);
        res.status(500).json({ success: false, message: 'Error fetching user statistics' });
    }
};

export const getUserRoleDistribution = async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ roles: { $in: ["admin"] } });
        const userCount = await User.countDocuments({ roles: { $in: ["user"] } });

        res.json({
            success: true,
            roles: [
                { name: "Admin", value: adminCount },
                { name: "User", value: userCount },
            ],
        });
    } catch (error) {
        console.error("Error fetching role distribution:", error);
        res.status(500).json({ success: false, message: "Error fetching role distribution" });
    }
};

export const getUserOverview = async (req, res) => {
    try {
        // Initialize separate datasets
        const adminData = Array(12).fill(0);
        const userData = Array(12).fill(0);

        // Fetch all users
        const users = await User.find();

        users.forEach(user => {
            const monthIndex = new Date(user.createdAt).getMonth(); // 0 (Jan) - 11 (Dec)

            if (user.roles.includes("admin")) {
                adminData[monthIndex] += 1;
            } else {
                userData[monthIndex] += 1;
            }
        });

        // Combine them into a single response but keep them distinct
        const formattedData = [];
        for (let i = 0; i < 12; i++) {
            const monthName = new Date(0, i).toLocaleString('default', { month: 'short' });

            formattedData.push({ name: monthName, role: "User", count: userData[i] });
            formattedData.push({ name: monthName, role: "Admin", count: adminData[i] });
        }

        return res.json({
            success: true,
            users: formattedData,
        });
    } catch (error) {
        console.error("Error fetching user overview:", error);
        return res.status(500).json({ success: false, message: "Error fetching user overview" });
    }
};

export const getAllCategoryDistribution = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;
    const { timeRange = 'week' } = req.query; // Default to 'week' if not provided
    
    try {
        // Calculate the start date once based on time range
        const startDate = getStartDateByTimeRange(timeRange);
        
        // Check if the user is an admin
        const isAdmin = req.user?.roles.includes('admin');
        
        // Set up query based on user role
        const query = {
            startDateTime: { $gte: startDate }
        };
        
        // Add userId filter if not admin
        if (!isAdmin) {
            query.userId = userId;
        } else {
            // For admin, get non-admin user IDs (consider caching this for frequent requests)
            const nonAdminUserIds = await User.distinct('_id', { roles: { $nin: ['admin'] } });
            query.userId = { $in: nonAdminUserIds };
        }
        
        // Use aggregation pipeline for better performance
        const pipeline = [
            { $match: query },
            { $group: {
                _id: '$eventType',
                count: { $sum: 1 }
            }}
        ];
        
        const eventTypeCounts = await Event.aggregate(pipeline);
        
        // Define all possible event types
        const allEventTypes = ['work', 'personal', 'vacation', 'meeting'];
        
        // Create a map of event types to counts for easy lookup
        const countsMap = eventTypeCounts.reduce((map, item) => {
            map[item._id || 'undefined'] = item.count;
            return map;
        }, {});
        
        // Format the response data
        const categoryData = allEventTypes.map(type => ({
            name: type,
            value: countsMap[type] || 0
        }));
        
        return res.json({
            success: true,
            categories: categoryData
        });
        
    } catch (error) {
        console.error("Error fetching category distribution:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "An unexpected error occurred"
        });
    }
};
// // Helper function to calculate start date
// function getStartDateByTimeRange(timeRange) {
//     const currentDate = new Date();
    
//     switch (timeRange) {
//         case 'week':
//             return new Date(currentDate.setDate(currentDate.getDate() - 7));
//         case 'month':
//             return new Date(currentDate.setMonth(currentDate.getMonth() - 1));
//         case 'year':
//             return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
//         default:
//             return new Date(0); // No filter, fetch all events
//     }
// }

export const getAllEventStatistics = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;

    try {
        if (req.user?.roles.includes('admin')) {
            const users = await User.find({ roles: { $nin: ['admin'] } });

            let totalEvents = 0;
            let newEventsToday = 0;
            let activeEvents = 0;
            let pastEvents = 0;
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            for (const user of users) {
                const userEvents = await Event.find({ userId: user._id });

                totalEvents += userEvents.length;

                // Count events created today
                newEventsToday += userEvents.filter(event => new Date(event.createdAt) >= startOfToday).length;

                // Active events (ongoing events)
                activeEvents += userEvents.filter(event => 
                    new Date(event.startDateTime) <= today && new Date(event.endDateTime) >= today).length;

                // Past events
                pastEvents += userEvents.filter(event => new Date(event.endDateTime) < today).length;
            }

            const churnRate = totalEvents > 0 ? ((pastEvents / totalEvents) * 100).toFixed(1) + '%' : '0%';

            return res.json({
                success: true,
                statistics: {
                    totalEvents,
                    newEventsToday,
                    activeEvents,
                    pastEvents,
                    churnRate,
                },
            });
        } else {
            const userEvents = await Event.find({ userId });

            const totalEvents = userEvents.length;
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            // Count events created today
            const newEventsToday = userEvents.filter(event => new Date(event.createdAt) >= startOfToday).length;

            // Active events (ongoing events)
            const activeEvents = userEvents.filter(event =>
                new Date(event.startDateTime) <= today && new Date(event.endDateTime) >= today).length;

            // Past events
            const pastEvents = userEvents.filter(event => new Date(event.endDateTime) < today).length;

            const churnRate = totalEvents > 0 ? ((pastEvents / totalEvents) * 100).toFixed(1) + '%' : '0%';

            return res.json({
                success: true,
                statistics: {
                    totalEvents,
                    newEventsToday,
                    activeEvents,
                    pastEvents,
                    churnRate,
                },
            });
        }
    } catch (error) {
        console.error("Error fetching event statistics:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllEventOverview = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;
    
    try {
        let events = [];
        let users = [];
        
        // Get all users if admin
        if (req.user?.roles.includes("admin")) {
            // Fetch all non-admin users
            users = await User.find({ roles: { $nin: ["admin"] } })
                .select('_id userName email');
                
            // Fetch all non-admin users' events
            const userIds = users.map(user => user._id);
            events = await Event.find({ userId: { $in: userIds } });
            
            // Format users for frontend dropdown
            users = users.map(user => ({
                id: user._id,
                name: `${user.userName}`
            }));
        } else {
            // Fetch only the logged-in user's events
            events = await Event.find({ userId });
        }
        
        // Basic structure for the original endpoint (backward compatibility)
        if (!req.query.viewMode) {
            // Initialize structure for all months, weeks, and days
            const months = Array.from({ length: 12 }, (_, i) => {
                const firstDayOfMonth = new Date(new Date().getFullYear(), i, 1);
                const firstMonday = firstDayOfMonth.getDay() === 1
                    ? firstDayOfMonth
                    : new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (1 - firstDayOfMonth.getDay() + 7) % 7));
                
                return {
                    month: new Date(0, i).toLocaleString("default", { month: "short" }),
                    weeks: Array.from({ length: 6 }, (_, j) => ({
                        name: `Week ${j + 1}`,
                        Events: 0,
                        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
                            name: day,
                            Events: 0
                        }))
                    })),
                    firstMonday
                };
            });
            
            // Loop through events and populate months, weeks, and days
            events.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const monthIndex = eventDate.getMonth(); // 0-11
                const firstMonday = months[monthIndex].firstMonday;
                
                // Ensure event is within range before processing
                if (eventDate < firstMonday) return;
                
                const weekIndex = Math.floor((eventDate - firstMonday) / (7 * 24 * 60 * 60 * 1000));
                const dayIndex = (eventDate.getDay() + 6) % 7; // Convert to 0 (Mon) - 6 (Sun)
                
                if (weekIndex >= 0 && weekIndex < months[monthIndex].weeks.length) {
                    months[monthIndex].weeks[weekIndex].Events += 1;
                    
                    if (dayIndex >= 0 && dayIndex <= 6) {
                        months[monthIndex].weeks[weekIndex].days[dayIndex].Events += 1;
                    }
                }
            });
            
            return res.json({
                success: true,
                events: months.map(({ firstMonday, ...rest }) => rest), // Remove `firstMonday` before sending
                users: req.user?.roles.includes("admin") ? users : []
            });
        }
        
        // Enhanced functionality for the new UI
        const { viewMode, year = new Date().getFullYear(), month, userId: filterUserId } = req.query;
        
        // Filter events by user if specified
        if (filterUserId && filterUserId !== "all") {
            events = events.filter(event => event.userId.toString() === filterUserId);
        }
        
        // Filter by year
        const selectedYear = parseInt(year);
        events = events.filter(event => new Date(event.startDateTime).getFullYear() === selectedYear);
        
        // Process data based on view mode
        let formattedData = [];
        
        if (viewMode === "Year") {
            // Group events by month and event type
            const monthlyData = Array.from({ length: 12 }, (_, i) => {
                const monthName = new Date(0, i).toLocaleString("default", { month: "short" });
                return {
                    name: monthName,
                    work: 0,
                    personal: 0,
                    vacation: 0,
                    meeting: 0
                };
            });
            
            events.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const monthIndex = eventDate.getMonth();
                const eventType = event.eventType.toLowerCase();
                
                if (monthlyData[monthIndex] && monthlyData[monthIndex][eventType] !== undefined) {
                    monthlyData[monthIndex][eventType] += 1;
                }
            });
            
            formattedData = monthlyData;
        } 
        else if (viewMode === "Month" && month) {
            // Get month index (0-11) from month name
            const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                .indexOf(month);
            
            if (monthIndex === -1) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid month specified" 
                });
            }
            
            // Filter events for the selected month
            events = events.filter(event => {
                const eventDate = new Date(event.startDateTime);
                return eventDate.getMonth() === monthIndex;
            });
            
            // Group events by week and event type
            const firstDayOfMonth = new Date(selectedYear, monthIndex, 1);
            const numWeeks = Math.ceil((new Date(selectedYear, monthIndex + 1, 0).getDate() + 
                                        firstDayOfMonth.getDay()) / 7);
            
            const weeklyData = Array.from({ length: numWeeks }, (_, i) => ({
                name: `Week ${i + 1}`,
                work: 0,
                personal: 0,
                vacation: 0,
                meeting: 0
            }));
            
            events.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const weekNum = Math.floor((eventDate.getDate() + firstDayOfMonth.getDay() - 1) / 7);
                const eventType = event.eventType.toLowerCase();
                
                if (weekNum >= 0 && weekNum < weeklyData.length && weeklyData[weekNum][eventType] !== undefined) {
                    weeklyData[weekNum][eventType] += 1;
                }
            });
            
            formattedData = weeklyData;
        }
        else if (viewMode === "Week" && month) {
            // Get month index (0-11) from month name
            const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                .indexOf(month);
            
            if (monthIndex === -1) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid month specified" 
                });
            }
            
            // We'll default to the first week if no week is specified
            const weekNumber = parseInt(req.query.week || "1");
            
            // Calculate the date range for the selected week
            const firstDayOfMonth = new Date(selectedYear, monthIndex, 1);
            const firstDayOfWeek = new Date(selectedYear, monthIndex, 
                                          (weekNumber - 1) * 7 + 1 - (firstDayOfMonth.getDay() || 7) + 1);
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            
            // Filter events for the selected week
            events = events.filter(event => {
                const eventDate = new Date(event.startDateTime);
                return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
            });
            
            // Create daily data
            const dailyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
                name: day,
                work: 0,
                personal: 0,
                vacation: 0,
                meeting: 0
            }));
            
            events.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const dayIndex = (eventDate.getDay() + 6) % 7; // Convert to 0 (Mon) - 6 (Sun)
                const eventType = event.eventType.toLowerCase();
                
                if (dayIndex >= 0 && dayIndex < 7 && dailyData[dayIndex][eventType] !== undefined) {
                    dailyData[dayIndex][eventType] += 1;
                }
            });
            
            formattedData = dailyData;
        }
        
        return res.json({
            success: true,
            data: formattedData,
            users: req.user?.roles.includes("admin") ? users : []
        });
        
    } catch (error) {
        console.error("Error fetching event overview:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllEventTypes = async (req, res) => {
    try {
      // Retrieve all distinct event types from the Event model
      const eventTypes = await Event.distinct('eventType');
  
      // If no event types are found, send an appropriate response
      if (!eventTypes || eventTypes.length === 0) {
        return res.status(404).json({ success: false, message: 'No event types found' });
      }
  
      // Send the event types as a response
      return res.status(200).json({ success: true, eventTypes });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getEventOverviewByType = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;
    
    try {
        let events = [];
        let users = [];
        
        // Get all users if admin
        if (req.user?.roles.includes("admin")) {
            // Fetch all non-admin users
            users = await User.find({ roles: { $nin: ["admin"] } })
                .select('_id userName email');
                
            // Fetch all non-admin users' events
            const userIds = users.map(user => user._id);
            events = await Event.find({ userId: { $in: userIds }, deleted: { $ne: true } });
            
            // Format users for frontend dropdown
            users = users.map(user => ({
                id: user._id,
                name: `${user.userName}`
            }));
        } else {
            // Fetch only the logged-in user's events
            events = await Event.find({ userId, deleted: { $ne: true } });
        }

        // Modified events to include eventType for each event
        const eventsWithType = events.map(event => ({
            id: event._id,
            userId: event.userId,
            eventName: event.eventName,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            eventType: event.eventType,
            description: event.description
        }));
        
        // Basic structure for the original endpoint (backward compatibility)
        if (!req.query.viewMode) {
            // Initialize structure for all months, weeks, and days
            const months = Array.from({ length: 12 }, (_, i) => {
                const firstDayOfMonth = new Date(new Date().getFullYear(), i, 1);
                const firstMonday = firstDayOfMonth.getDay() === 1
                    ? firstDayOfMonth
                    : new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (1 - firstDayOfMonth.getDay() + 7) % 7));
                
                return {
                    month: new Date(0, i).toLocaleString("default", { month: "short" }),
                    weeks: Array.from({ length: 6 }, (_, j) => ({
                        name: `Week ${j + 1}`,
                        Events: 0,
                        eventsByType: {
                            work: 0,
                            personal: 0,
                            vacation: 0,
                            meeting: 0
                        },
                        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
                            name: day,
                            Events: 0,
                            eventsByType: {
                                work: 0,
                                personal: 0,
                                vacation: 0,
                                meeting: 0
                            }
                        }))
                    })),
                    firstMonday
                };
            });
            
            // Loop through events and populate months, weeks, and days
            events.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const monthIndex = eventDate.getMonth(); // 0-11
                const firstMonday = months[monthIndex].firstMonday;
                const eventType = event.eventType.toLowerCase();
                
                // Ensure event is within range before processing
                if (eventDate < firstMonday) return;
                
                const weekIndex = Math.floor((eventDate - firstMonday) / (7 * 24 * 60 * 60 * 1000));
                const dayIndex = (eventDate.getDay() + 6) % 7; // Convert to 0 (Mon) - 6 (Sun)
                
                if (weekIndex >= 0 && weekIndex < months[monthIndex].weeks.length) {
                    months[monthIndex].weeks[weekIndex].Events += 1;
                    
                    // Add event type count
                    if (months[monthIndex].weeks[weekIndex].eventsByType[eventType] !== undefined) {
                        months[monthIndex].weeks[weekIndex].eventsByType[eventType] += 1;
                    }
                    
                    if (dayIndex >= 0 && dayIndex <= 6) {
                        months[monthIndex].weeks[weekIndex].days[dayIndex].Events += 1;
                        
                        // Add event type count for the day
                        if (months[monthIndex].weeks[weekIndex].days[dayIndex].eventsByType[eventType] !== undefined) {
                            months[monthIndex].weeks[weekIndex].days[dayIndex].eventsByType[eventType] += 1;
                        }
                    }
                }
            });
            
            return res.json({
                success: true,
                events: months.map(({ firstMonday, ...rest }) => rest), // Remove `firstMonday` before sending
                eventsList: eventsWithType, // Add list of events with their types
                users: req.user?.roles.includes("admin") ? users : []
            });
        }
        
        // Enhanced functionality for the new UI
        const { viewMode, year = new Date().getFullYear(), month, userId: filterUserId } = req.query;
        
        // Filter events by user if specified
        if (filterUserId && filterUserId !== "all") {
            events = events.filter(event => event.userId.toString() === filterUserId);
        }
        
        // Filter by year
        const selectedYear = parseInt(year);
        events = events.filter(event => new Date(event.startDateTime).getFullYear() === selectedYear);
        
        // Process data based on view mode
        let formattedData = [];
        
        if (viewMode === "Year") {
            // Group events by month and event type
            const monthlyData = Array.from({ length: 12 }, (_, i) => {
                const monthName = new Date(0, i).toLocaleString("default", { month: "short" });
                return {
                    name: monthName,
                    work: 0,
                    personal: 0,
                    vacation: 0,
                    meeting: 0
                };
            });
            
            events.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const monthIndex = eventDate.getMonth();
                const eventType = event.eventType.toLowerCase();
                
                if (monthlyData[monthIndex] && monthlyData[monthIndex][eventType] !== undefined) {
                    monthlyData[monthIndex][eventType] += 1;
                }
            });
            
            formattedData = monthlyData;
        } 
        else if (viewMode === "Month" && month) {
            // Get month index (0-11) from month name
            const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                .indexOf(month);
            
            if (monthIndex === -1) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid month specified" 
                });
            }
            
            // Filter events for the selected month
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.startDateTime);
                return eventDate.getMonth() === monthIndex;
            });
            
            // Group events by week and event type
            const firstDayOfMonth = new Date(selectedYear, monthIndex, 1);
            const numWeeks = Math.ceil((new Date(selectedYear, monthIndex + 1, 0).getDate() + 
                                        firstDayOfMonth.getDay()) / 7);
            
            const weeklyData = Array.from({ length: numWeeks }, (_, i) => ({
                name: `Week ${i + 1}`,
                work: 0,
                personal: 0,
                vacation: 0,
                meeting: 0,
                events: [] // Add array to store events for each week
            }));
            
            filteredEvents.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const weekNum = Math.floor((eventDate.getDate() + firstDayOfMonth.getDay() - 1) / 7);
                const eventType = event.eventType.toLowerCase();
                
                if (weekNum >= 0 && weekNum < weeklyData.length && weeklyData[weekNum][eventType] !== undefined) {
                    weeklyData[weekNum][eventType] += 1;
                    
                    // Add event to the week's events array
                    weeklyData[weekNum].events.push({
                        id: event._id,
                        eventName: event.eventName,
                        eventType: event.eventType,
                        startDateTime: event.startDateTime,
                        endDateTime: event.endDateTime
                    });
                }
            });
            
            formattedData = weeklyData;
        }
        else if (viewMode === "Week" && month) {
            // Get month index (0-11) from month name
            const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                .indexOf(month);
            
            if (monthIndex === -1) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid month specified" 
                });
            }
            
            // We'll default to the first week if no week is specified
            const weekNumber = parseInt(req.query.week || "1");
            
            // Calculate the date range for the selected week
            const firstDayOfMonth = new Date(selectedYear, monthIndex, 1);
            const firstDayOfWeek = new Date(selectedYear, monthIndex, 
                                          (weekNumber - 1) * 7 + 1 - (firstDayOfMonth.getDay() || 7) + 1);
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            
            // Filter events for the selected week
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.startDateTime);
                return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
            });
            
            // Create daily data
            const dailyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
                name: day,
                work: 0,
                personal: 0,
                vacation: 0,
                meeting: 0,
                events: [] // Add array to store events for each day
            }));
            
            filteredEvents.forEach(event => {
                const eventDate = new Date(event.startDateTime);
                const dayIndex = (eventDate.getDay() + 6) % 7; // Convert to 0 (Mon) - 6 (Sun)
                const eventType = event.eventType.toLowerCase();
                
                if (dayIndex >= 0 && dayIndex < 7 && dailyData[dayIndex][eventType] !== undefined) {
                    dailyData[dayIndex][eventType] += 1;
                    
                    // Add event to the day's events array
                    dailyData[dayIndex].events.push({
                        id: event._id,
                        eventName: event.eventName,
                        eventType: event.eventType,
                        startDateTime: event.startDateTime,
                        endDateTime: event.endDateTime
                    });
                }
            });
            
            formattedData = dailyData;
        }
        
        return res.json({
            success: true,
            data: formattedData,
            eventsList: eventsWithType, // Add list of events with their types
            users: req.user?.roles.includes("admin") ? users : []
        });
        
    } catch (error) {
        console.error("Error fetching event overview:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllAdminEvents = async (req, res) => {
    try {
        const userId = req.user?.user?._id || req.user?.id;
        
        // If the user is an admin, return events for all users
        let events;
        if (req.user?.roles?.includes('admin')) {
            events = await Event.find(); // Get all events across users
        } else {
            events = await Event.find({ userId }); // Get events only for the authenticated user
        }

        return res.json({ success: true, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get user statuses (Admins only)
export const getUserStatus = async (req, res) => {
    try {
        // Fetch all users with their status
        const users = await User.find().select("userName email status roles");

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching user statuses:", error);
        res.status(500).json({ success: false, message: "Error fetching user statuses" });
    }
};

export const getUserOverviewByRole = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;
    const requestedYear = parseInt(req.query.year, 10) || new Date().getFullYear();

    try {
        let users = [];

        // Get all users if admin
        if (req.user?.roles.includes("admin")) {
            // Fetch all users (both admin and non-admin)
            users = await User.find({ deleted: { $ne: true } }).select('_id userName email roles status createdAt');
        } else {
            // Fetch only the logged-in user
            users = await User.find({ _id: userId, deleted: { $ne: true } }).select('_id userName email roles status createdAt');
        }

        // Initialize structure for all months, weeks, and days for the requested year
        const months = Array.from({ length: 12 }, (_, i) => {
            return {
                month: new Date(0, i).toLocaleString("default", { month: "short" }),
                year: requestedYear,
                usersByRole: {
                    admin: {
                        all: 0,
                        active: 0,
                        inactive: 0
                    },
                    user: {
                        all: 0,
                        active: 0,
                        inactive: 0
                    }
                },
                weeks: Array.from({ length: 6 }, (_, j) => ({
                    name: `Week ${j + 1}`,
                    usersByRole: {
                        admin: {
                            all: 0,
                            active: 0,
                            inactive: 0
                        },
                        user: {
                            all: 0,
                            active: 0,
                            inactive: 0
                        }
                    },
                    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
                        name: day,
                        usersByRole: {
                            admin: {
                                all: 0,
                                active: 0,
                                inactive: 0
                            },
                            user: {
                                all: 0,
                                active: 0,
                                inactive: 0
                            }
                        }
                    }))
                }))
            };
        });

        // Filter users by creation year first
        const usersInYear = users.filter(user => {
            const userCreatedAt = new Date(user.createdAt);
            return userCreatedAt.getFullYear() === requestedYear;
        });

        // Loop through filtered users and populate months, weeks, and days based on their creation date
        usersInYear.forEach(user => {
            const role = user.roles.includes("admin") ? "admin" : "user";
            const status = user.status === "active" ? "active" : "inactive";
            const userCreatedAt = new Date(user.createdAt);
            
            // Get month index from creation date
            const monthIndex = userCreatedAt.getMonth();
            
            // Update monthly counts - ONLY for the month they were created
            months[monthIndex].usersByRole[role].all += 1;
            months[monthIndex].usersByRole[role][status] += 1;
            
            // Calculate first day of this month
            const firstDayOfMonth = new Date(requestedYear, monthIndex, 1);
            
            // Calculate the first Monday of the month for week calculations
            const firstMonday = new Date(firstDayOfMonth);
            const day = firstMonday.getDay();
            const diff = day === 0 ? 1 : day === 1 ? 0 : 1 - day;
            firstMonday.setDate(firstMonday.getDate() + diff);
            
            // Calculate which week of the month the user was created in
            const dayDiff = Math.floor((userCreatedAt - firstMonday) / (24 * 60 * 60 * 1000));
            const weekIndex = Math.max(0, Math.min(5, Math.floor(dayDiff / 7)));
            
            // Update only the specific week the user was created in
            months[monthIndex].weeks[weekIndex].usersByRole[role].all += 1;
            months[monthIndex].weeks[weekIndex].usersByRole[role][status] += 1;
            
            // Calculate which day of the week the user was created
            const dayOfWeek = (userCreatedAt.getDay() + 6) % 7; // Convert to 0 (Mon) - 6 (Sun)
            
            // Update only the specific day the user was created on
            months[monthIndex].weeks[weekIndex].days[dayOfWeek].usersByRole[role].all += 1;
            months[monthIndex].weeks[weekIndex].days[dayOfWeek].usersByRole[role][status] += 1;
        });

        return res.json({
            success: true,
            monthData: months
        });

    } catch (error) {
        console.error("Error fetching user overview:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserStatusSummary = async (req, res) => {
    try {
        // Aggregate data based on user status (Active vs Inactive)
        const statusSummary = await User.aggregate([
            {
                $match: { deleted: false } // Exclude deleted users
            },
            {
                $group: {
                    _id: "$status", // Group by status (active or inactive)
                    count: { $sum: 1 } // Count the number of users for each status
                }
            }
        ]);

        // Prepare a map for easy lookup of status counts
        const statusMap = {
            active: 0,
            inactive: 0
        };

        // Populate the statusMap with the counts from the aggregation
        statusSummary.forEach(item => {
            if (item._id === "active") {
                statusMap.active = item.count;
            } else if (item._id === "inactive") {
                statusMap.inactive = item.count;
            }
        });

        // Format the data for frontend consumption
        const formattedData = [
            { name: "Active", value: statusMap.active },
            { name: "Inactive", value: statusMap.inactive }
        ];

        // Respond with the summary data
        return res.json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching user status summary:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const requestReactivation = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Ensure the user is inactive
        if (user.status !== "inactive") {
            return res.status(400).json({ 
                success: false, 
                message: "Account is already active" 
            });
        }
        
        // Check if request is already submitted
        if (user.reactivationRequested) {
            return res.status(400).json({ 
                success: false, 
                message: "Reactivation request already submitted." 
            });
        }

        // Get notification settings for the user (without authentication)
        const notificationSettings = await NotificationSettings.findOne({ 
            userId: user._id 
        }).lean();

        // Verify email notifications are enabled (needed to inform user of status)
        if (!notificationSettings || !notificationSettings.email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email notifications must be enabled to process reactivation requests.",
                notificationIssue: true
            });
        }

        // Verify push notifications are enabled (needed to notify admin)
        if (!notificationSettings || !notificationSettings.push) {
            return res.status(400).json({ 
                success: false, 
                message: "Push notifications must be enabled to process reactivation requests.",
                notificationIssue: true
            });
        }
        
        // Store reactivation request in the database
        user.reactivationRequested = true;
        await user.save();
        
        // Notify Admins via Email
        const admins = await User.find({ roles: "admin" }).select("email");
        admins.forEach(admin => {
            sendEmail(admin.email, 'Reactivation Request', 
                      `User with email ${email} has requested reactivation.`);
        });
        
        // Create in-app notification for admin
        const notification = await Notification.create({
            recipient: 'admin',
            type: 'reactivation_request',
            message: `User ${user.userName} (${email}) has requested account reactivation.`,
            relatedUser: user._id,
            read: false,
        });
        
        // Send confirmation email to user
        sendEmail(
            email,
            'Account Reactivation Request Received',
            `We've received your request to reactivate your account. Our admin team will review it and get back to you shortly.`
        );
        
        console.log(`Reactivation request received for ${email}`);
        return res.status(200).json({
            success: true,
            message: "Reactivation request submitted. Admin will review it.",
            notification: notification
        });
    } catch (error) {
        console.error("Error requesting reactivation:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
  
export const approveReactivation = async (req, res) => {
    try {
      // Change from req.body to req.params to match the frontend API call
      const userId = req.params.userId;
      
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Ensure the user requested reactivation
      if (!user.reactivationRequested) {
        return res.status(400).json({ success: false, message: "No reactivation request found" });
      }
      
      // Update status to active
      user.status = "active";
      user.reactivationRequested = false;
      await user.save();
      
      // Send email notification to the user
      await sendEmail(
        user.email, 
        'Account Reactivation Approved', 
        `Hello ${user.userName}, your account has been successfully reactivated. You can now log in.`
      );
      
      return res.status(200).json({ success: true, message: "Account reactivated successfully" });
    } catch (error) {
      console.error("Error approving reactivation:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  export const denyReactivation = async (req, res) => {
    try {
      // Change from req.body to req.params to match the frontend API call
      const userId = req.params.userId;
      
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Deny reactivation request (update reactivationRequested flag)
      user.reactivationRequested = false;
      await user.save();
      
      // Send email notification to the user
      await sendEmail(
        user.email, 
        'Reactivation request denied', 
        `Hello ${user.userName}, your reactivation request has been denied.`
      );
      
      return res.status(200).json({ success: true, message: "Reactivation request denied." });
    } catch (error) {
      console.error("Error denying reactivation:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

/**
 * Gets all pending reactivation requests from users
 */
export const getReactivationRequests = async (req, res) => {
    try {
      // Find all users with reactivationRequested flag set to true
      const users = await User.find({ reactivationRequested: true })
        .select('_id userName email updatedAt')
        .sort({ updatedAt: -1 }); // Show newest requests first
  
      // Log the number of requests found for monitoring purposes
      console.log(`Retrieved ${users.length} pending reactivation requests`);
      
      return res.status(200).json({ 
        success: true, 
        users,
        count: users.length
      });
    } catch (error) {
      console.error("Error fetching reactivation requests:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  /**
   * Gets all notifications for admin, including unread count
   */
  export const getAdminNotifications = async (req, res) => {
    try {
      // Log incoming request for debugging
      console.log("Received request for admin notifications");
  
      // Find all notifications for admin
      const notifications = await Notification.find({ recipient: 'admin' })
        .populate('relatedUser', 'userName email') // Populate user details if needed
        .sort({ createdAt: -1 })
        .limit(50); // Limit to recent 50 notifications
  
      // Get count of unread notifications
      const unreadCount = await Notification.countDocuments({
        recipient: 'admin',
        read: false
      });
  
      // Log data before sending response for debugging
      console.log("Fetched notifications:", notifications);
      console.log("Unread notifications count:", unreadCount);
  
      return res.status(200).json({
        success: true,
        notifications,
        unreadCount,
        totalCount: notifications.length
      });
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  /*Marks a specific notification as read*/
export const markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
  
      // Validate notification ID format
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({ success: false, message: "Invalid notification ID format" });
      }
  
      // Find and update the notification
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
  
      // Only update if it's not already read
      if (!notification.read) {
        notification.read = true;
        await notification.save();
        console.log(`Notification ${notificationId} marked as read`);
      }
  
      return res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  /* Marks all admin notifications as read*/
  export const markAllNotificationsAsRead = async (req, res) => {
    try {
      // Update all unread notifications for admin
      const result = await Notification.updateMany(
        { recipient: 'admin', read: false },
        { $set: { read: true } }
      );
  
      console.log(`Marked ${result.modifiedCount} notifications as read`);
      
      return res.status(200).json({ 
        success: true, 
        message: `${result.modifiedCount} notifications marked as read`,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  /**
   * Deletes a specific notification
   */
  export const deleteNotification = async (req, res) => {
    console.log("Authenticated User:", req.user); // Debugging line
  
    try {
      const { notificationId } = req.params;
  
      // Check if the notificationId is valid
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({ success: false, message: "Invalid notification ID format" });
      }
  
      const notification = await Notification.findByIdAndDelete(notificationId);
  
      if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
  
      console.log(`Notification ${notificationId} deleted`);
  
      return res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  /**
   * Clears all notifications for admin (removes them completely)
   */
export const clearAllNotifications = async (req, res) => {
    try {
      // Delete all notifications for admin
      const result = await Notification.deleteMany({ recipient: 'admin' });
  
      console.log(`Deleted ${result.deletedCount} admin notifications`);
      
      return res.status(200).json({ 
        success: true, 
        message: `${result.deletedCount} notifications deleted`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

 // updating user status
 export const updateUserStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.roles.includes("admin")) {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }

        const userId = req.params.userId; // ✅ Ensure this matches frontend route
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true }).select("userName email roles status");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (status === "inactive") {
            await sendEmail(
                updatedUser.email, // ✅ Fix: Send as a string, not an object
                "Account Deactivated",
                `Hello ${updatedUser.userName},\n\nYour account has been deactivated. Contact support if this is an error.`
            );
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ success: false, message: "Error updating user status" });
    }
};

// Fetch notification settings for all users (admin only)
export const getAllNotificationSettings = async (req, res) => {
    try {
        // Ensure the user has an admin role
        if (!req.user || !req.user.roles.includes('admin')) {
            return res.status(403).json({ success: false, message: "You don't have permission to view all users' settings." });
        }

        // Fetch all users' notification settings
        const settings = await NotificationSettings.find().lean();

        if (!settings || settings.length === 0) {
            return res.status(404).json({ success: false, message: "No notification settings found." });
        }

        return res.json({ success: true, settings });
    } catch (error) {
        console.error("Error retrieving all notification settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Save notification settings for all users (admin only)
export const saveAllNotificationSettings = async (req, res) => {
    try {
        // Ensure the user has an admin role
        if (!req.user || !req.user.roles.includes('admin')) {
            return res.status(403).json({ success: false, message: "You don't have permission to update all users' settings." });
        }

        // Destructure settings from the request body
        const { push, email, sms } = req.body;

        // Ensure all values are booleans
        if (typeof push !== "boolean" || typeof email !== "boolean" || typeof sms !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid input data. Push, email, and sms must be boolean values." });
        }

        // Update notification settings for all users
        const updatedSettings = await NotificationSettings.updateMany(
            {},
            { $set: { push, email, sms } }
        );

        return res.json({ success: true, message: "Notification settings updated for all users.", updatedSettings });
    } catch (error) {
        console.error("Error saving notification settings for all users:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};









//For a user at a time 
// // Get notification settings for all users (for admins or authorized roles)
// export const getNotificationSettings = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { targetUserId } = req.query;  // Added query param to specify which user's settings to fetch

//         // If the logged-in user is an admin, allow fetching settings of other users
//         if (req.user.roles.includes('admin')) {
//             // Fetch settings of the target user
//             const settings = await NotificationSettings.findOne({ userId: targetUserId }).lean();
//             if (!settings) {
//                 return res.status(404).json({ success: false, message: "Settings not found." });
//             }
//             return res.json({ success: true, settings });
//         } 

//         // Default: Return the settings of the logged-in user
//         const settings = await NotificationSettings.findOne({ userId }).lean();
//         if (!settings) {
//             return res.status(404).json({ success: false, message: "Settings not found." });
//         }

//         return res.json({ success: true, settings });
//     } catch (error) {
//         console.error("Error retrieving notification settings:", error);
//         return res.status(500).json({ success: false, message: "Internal server error." });
//     }
// };

// // Save Notification Settings for a specific user (only for admins)
// export const saveNotificationSettings = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { targetUserId, push, email, sms } = req.body;

//         // Only allow admins to change settings of other users
//         if (!req.user.roles.includes('admin')) {
//             return res.status(403).json({ success: false, message: "You don't have permission to update other users' settings" });
//         }

//         // Validate notification setting inputs
//         if (typeof push !== "boolean" || typeof email !== "boolean" || typeof sms !== "boolean") {
//             return res.status(400).json({ success: false, message: "Invalid input data." });
//         }

//         // Update the settings of the target user
//         const settings = await NotificationSettings.findOneAndUpdate(
//             { userId: targetUserId },
//             { push, email, sms },
//             { new: true, upsert: true, setDefaultsOnInsert: true }
//         );

//         return res.json({ success: true, settings });
//     } catch (error) {
//         console.error("Error saving notification settings:", error);
//         return res.status(500).json({ success: false, message: "Internal server error." });
//     }
// };






