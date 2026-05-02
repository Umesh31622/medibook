const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userGoogleId: {
        type: String,
        index: true
    },
    userEmail: {
        type: String,
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPlan'
    },
    planName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    billingInterval: {
        type: String,
        enum: ['monthly', 'yearly']
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);