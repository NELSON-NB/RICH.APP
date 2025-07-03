import mongoose from 'mongoose';
const { Schema } = mongoose;

const accountRecoveryOTPSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['deletion', 'recovery', 'password_reset'],
        default: 'recovery'
    },
    expiration: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index that expires documents after their expiration date
accountRecoveryOTPSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 });

// Composite index to efficiently query by email, type, and expiration
accountRecoveryOTPSchema.index({ userId: 1, email: 1, type: 1, expiration: 1 });

const AccountRecoveryOTP = mongoose.model('AccountRecoveryOTP', accountRecoveryOTPSchema);

export default AccountRecoveryOTP;