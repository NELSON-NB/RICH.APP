import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  book: String,
  author: String,
  date: String,
  time: String,
  location: String,
  type: { type: String, default: 'in-person' },
  maxAttendees: { type: Number, default: 20 },
  currentAttendees: { type: Number, default: 1 },
  description: String,
  hostName: String,
  status: { type: String, default: 'upcoming' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Event', EventSchema)
