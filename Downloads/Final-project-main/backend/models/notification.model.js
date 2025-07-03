import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSettingsSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },  // New field for soft delete
    deletedAt: { type: Date, default: null }    // New field for soft delete timestamp
}, { timestamps: true });

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);
export default NotificationSettings;
