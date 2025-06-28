import express from 'express';
import Event from '../models/event.model.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create new event
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      book,
      author,
      date,
      time,
      location,
      type,
      maxAttendees,
      description,
      hostName
    } = req.body;

    const newEvent = new Event({
      title,
      book,
      author,
      date,
      time,
      location,
      type,
      maxAttendees,
      currentAttendees: 1,
      description,
      hostName,
      status: 'upcoming',
      createdBy: req.user.id
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Event creation failed:', err.message);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Update event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Join event
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.currentAttendees < event.maxAttendees) {
      event.currentAttendees += 1;
      await event.save();
      return res.json(event);
    } else {
      return res.status(400).json({ message: 'Event is full' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error joining event' });
  }
});

export default router;
