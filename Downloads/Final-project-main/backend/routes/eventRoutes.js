import express from 'express';
import { 
    addEvent, 
    editEvent, 
    deleteEvent, 
    getAllEvents, 
    getEventStatistics,
    getEventOverview,
    getCategoryDistribution,
    searchEvents
} from '../controllers/eventController.js';
import userAuth from '../middleware/userAuth.js';

const eventRouter = express.Router()

// Route to create a new event
eventRouter.post("/add-event", userAuth, addEvent);

// Route to edit an existing event
eventRouter.put("/edit-event/:id", userAuth, editEvent);

// Route to delete an event
eventRouter.delete("/delete-event/:id", userAuth, deleteEvent);

// Route to get all events for a user
eventRouter.get("/get-all-events", userAuth, getAllEvents);

eventRouter.get("/search-events", userAuth, searchEvents);

eventRouter.get("/event-statistics", userAuth, getEventStatistics);

// Route to get event overview statistics
eventRouter.get("/event-overview", userAuth, getEventOverview);

// Route to get event category distribution
eventRouter.get("/category-distribution", userAuth, getCategoryDistribution);

export default eventRouter;
