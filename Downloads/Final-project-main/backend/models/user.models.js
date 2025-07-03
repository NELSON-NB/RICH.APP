import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    userName: { type: String, required: true }, // Keep as userName
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Make password optional for add user 
    createdOn: { type: Date, default: Date.now },
    verifyOtp: { type: String, default: null },
    verifyOtpExpireAt: { type: Number, default: null },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: null },
    resetOtpExpireAt: { type: Number, default: null },
    isNightMode: { type: Boolean, default: false },  // Added field for theme preference
    roles: {
        type: [String],
        default: ['user'],
        enum: ['user', 'admin', 'moderator']  // Restrict to valid roles
    },
    status: { // Added field for account status
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'  // Default status is active
    },
    deleted: { type: Boolean, default: false },  // New field for soft delete
    deletedAt: { type: Date, default: null },    // New field for soft delete timestamp
    reactivationRequested: { type: Boolean, default: false }, // Added field for reactivation request
    profileImage: {
        type: String,
        default: null
      },
      bio: {
        type: String,
        maxlength: [200, 'Bio cannot exceed 200 characters'],
        default: ''
      },
      lastLoginAt: {
        type: Date,
        default: null
      }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
export default User;


