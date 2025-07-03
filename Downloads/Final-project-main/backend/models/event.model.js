import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
    },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    eventType: { 
        type: String, 
        enum: ['work', 'personal', 'vacation', 'meeting'], 
        required: true 
    },
    deleted: { type: Boolean, default: false },  // New field for soft delete
    deletedAt: { type: Date, default: null }    // New field for soft delete timestamp
}, { timestamps: true });

// Create the Event model from the schema
const Event = mongoose.model('Event', eventSchema);

export default Event;

