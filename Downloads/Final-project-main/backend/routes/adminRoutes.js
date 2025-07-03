import express from 'express';
import { addUser, approveReactivation, clearAllNotifications, deleteNotification, deleteUser, denyReactivation, editUser, getAdminNotifications, getAllAdminEvents, getAllCategoryDistribution, getAllEventOverview, getAllEventStatistics, getAllEventTypes, getAllNotificationSettings, getAllUsers, getEventOverviewByType, getUserOverview, getUserOverviewByRole, getUserRoleDistribution, getUserStatistics, getUserStatus, getUserStatusSummary, markAllNotificationsAsRead, markNotificationAsRead, requestReactivation, saveAllNotificationSettings, searchUsers, updateUserStatus } from '../controllers/adminController.js';
import userAuth from '../middleware/userAuth.js';
import roleAuth from '../middleware/roleAuth.js';


const adminRouter = express.Router();

// Admin-only routes
adminRouter.post('/add-user', userAuth, roleAuth('admin'), addUser);
adminRouter.put('/edit-user/:userId', userAuth, roleAuth('admin'), editUser);
adminRouter.delete('/delete-user/:userId', userAuth, roleAuth('admin'), deleteUser);
adminRouter.get('/search-users', userAuth, roleAuth('admin'), searchUsers);
adminRouter.get('/get-all-users', userAuth, roleAuth('admin'), getAllUsers);
adminRouter.get('/user-statistics', userAuth, roleAuth('admin'), getUserStatistics);
adminRouter.get('/role-distribution', userAuth, roleAuth('admin'), getUserRoleDistribution);
adminRouter.get('/user-overview', userAuth, roleAuth('admin'), getUserOverview);

//Admin-only routes for events
adminRouter.get('/get-all-category-distribution', userAuth, roleAuth('admin'), getAllCategoryDistribution);
adminRouter.get('/get-all-event-statistics', userAuth, roleAuth('admin'), getAllEventStatistics);
adminRouter.get("/get-all-event-overview", userAuth, roleAuth("admin"), getAllEventOverview);
adminRouter.get("/get-all-event-type", userAuth, roleAuth("admin"), getAllEventTypes);
adminRouter.get("/get-all-admin-event", userAuth, roleAuth("admin"), getAllAdminEvents);
adminRouter.get("/get-event-overview-type", userAuth, roleAuth("admin"), getEventOverviewByType);
adminRouter.get("/get-user-status", userAuth, roleAuth("admin"), getUserStatus)
adminRouter.get("/get-user-status-summary", userAuth, roleAuth("admin"), getUserStatusSummary);
adminRouter.get("/get-all-user-roles", userAuth, roleAuth("admin"), getUserOverviewByRole);
adminRouter.put("/update-user-status/:userId", userAuth, roleAuth("admin"), updateUserStatus);
adminRouter.post("/request-reactivation", requestReactivation);
adminRouter.get("/request-reactivation", requestReactivation);
adminRouter.put("/approve-reactivation/:userId", userAuth, roleAuth("admin"), approveReactivation);
adminRouter.put("/deny-reactivation/:userId", userAuth, roleAuth("admin"), denyReactivation);

// Notification routes
adminRouter.get('/notifications',userAuth, roleAuth("admin"), getAdminNotifications);
adminRouter.put('/notifications/:notificationId/read', userAuth, roleAuth("admin"),  markNotificationAsRead);
adminRouter.put('/notifications/mark-all-read', userAuth, roleAuth("admin"),  markAllNotificationsAsRead);
adminRouter.delete('/notifications/:notificationId', userAuth, roleAuth("admin"),  deleteNotification);
adminRouter.delete('/notifications', userAuth, roleAuth("admin"),  clearAllNotifications);

adminRouter.get('/get-all-notification-settings', userAuth, roleAuth('admin'), getAllNotificationSettings);
adminRouter.post('/save-all-notification-settings', userAuth, roleAuth('admin'), saveAllNotificationSettings);

// adminRouter.get('/get-notification-settings', userAuth, roleAuth('admin'), getNotificationSettings);
// adminRouter.post('/save-notification-settings', userAuth, roleAuth('admin'), saveNotificationSettings);


export default adminRouter;

