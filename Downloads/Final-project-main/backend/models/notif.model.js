import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotificationSchema = new Schema({
    recipient: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Notification = mongoose.model('Notification', NotificationSchema);
  export default Notification;