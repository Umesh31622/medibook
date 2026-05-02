const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userGoogleId: {
        type: String,
        index: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'active'
    },
    paymentId: {
        type: String
    },
    orderId: {
        type: String
    },
    billingInterval: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    }
}, { timestamps: true });

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);