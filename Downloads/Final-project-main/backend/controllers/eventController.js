import Event from '../models/event.model.js';

// Create a new event
export const addEvent = async (req, res) => {
    try {
        const { eventName, description, startDateTime, endDateTime, eventType } = req.body;
        const userId = req.user?.user?._id || req.user?.id; // Extract user ID from token

        // Validate input fields
        if (!eventName || !description || !startDateTime || !endDateTime || !eventType) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (new Date(startDateTime) >= new Date(endDateTime)) {
            return res.status(400).json({ success: false, message: "End time must be after start time." });
        }

        const newEvent = new Event({
            eventName,
            description,
            startDateTime,
            endDateTime,
            userId,
            eventType
        });

        await newEvent.save();
        return res.json({ success: true, message: "Event added successfully!", event: newEvent });
    } catch (error) {
        console.error("Error adding event:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Edit an existing event
export const editEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user?._id || req.user?.id;
        const { eventName, description, startDateTime, endDateTime, eventType } = req.body;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        if (String(event.userId) !== String(userId)) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this event." });
        }

        if (startDateTime && endDateTime && new Date(startDateTime) >= new Date(endDateTime)) {
            return res.status(400).json({ success: false, message: "End time must be after start time." });
        }

        event.eventName = eventName || event.eventName;
        event.description = description || event.description;
        event.startDateTime = startDateTime || event.startDateTime;
        event.endDateTime = endDateTime || event.endDateTime;
        event.eventType = eventType || event.eventType;

        await event.save();
        return res.json({ success: true, message: "Event updated successfully!", event });
    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user?._id || req.user?.id;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        if (String(event.userId) !== String(userId)) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this event." });
        }

        await Event.deleteOne({ _id: id });

        return res.json({ success: true, message: "Event deleted successfully." });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//get all events
export const getAllEvents = async (req, res) => {
    try {
        const userId = req.user?.user?._id || req.user?.id;

        const events = await Event.find({ userId });

        return res.json({ success: true, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Search events
export const searchEvents = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        // Search in event name and description
        const events = await Event.find({
            userId,
            $or: [
                { eventName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort({ startDateTime: 1 });

        res.json({ success: true, events });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ success: false, message: "Error searching events" });
    }
}; 

// Get event statistics
export const getEventStatistics = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;

    try {
        // Total events
        const totalEvents = await Event.countDocuments({ userId });

        // New events created today
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const newEventsToday = await Event.countDocuments({ 
            userId, 
            createdAt: { $gte: startOfToday } // Only count events created today
        });

        // Active events (ongoing events)
        const activeEvents = await Event.countDocuments({
            userId,
            startDateTime: { $lte: new Date() },
            endDateTime: { $gte: new Date() },
        });

        // Past events
        const pastEvents = await Event.countDocuments({ userId, endDateTime: { $lt: new Date() } });

        // Churn rate calculation
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
    } catch (error) {
        console.error("Error fetching event statistics:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Event overview statistics
export const getEventOverview = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;

    try {
        const events = await Event.find({ userId });

        // Initialize an array to hold monthly event counts
        const monthlyCounts = Array(12).fill(0);

        events.forEach(event => {
            const eventDate = new Date(event.startDateTime);
            const monthIndex = eventDate.getMonth();
            monthlyCounts[monthIndex] += 1;
        });

        // Format data for charts
        const formattedData = monthlyCounts.map((count, index) => ({
            name: new Date(0, index).toLocaleString('default', { month: 'short' }),
            Events: count,
        }));

        return res.json({
            success: true,
            events: formattedData,
        });
    } catch (error) {
        console.error("Error fetching event overview:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Category distribution data
export const getCategoryDistribution = async (req, res) => {
    const userId = req.user?.user?._id || req.user?.id;

    try {
        const events = await Event.find({ userId });

        const eventTypeCounts = {};
        const allEventTypes = ['work', 'personal', 'vacation', 'meeting'];

        events.forEach(event => {
            const eventType = event.eventType;
            if (eventType) {
                eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
            }
        });

        // Prepare response
        const categoryData = allEventTypes.map(type => ({
            name: type,
            value: eventTypeCounts[type] || 0,
        }));

        return res.json({
            success: true,
            categories: categoryData,
        });
    } catch (error) {
        console.error("Error fetching category distribution:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
