const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Standard', 'Premium', 'Basic', 'Professional', 'Enterprise', 'Lifetime'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    yearlyPrice: {
        type: Number,
        default: 0
    },
    duration: {
        value: { type: Number, default: 1 },
        unit: { type: String, enum: ['months', 'years', 'lifetime'], default: 'years' }
    },
    features: [{
        type: String
    }],
    // Clinicia specific features (from your image)
    featuresDetail: {
        sms: { type: String, default: 'Limited' },
        localLanguage: { type: Boolean, default: false },
        socialMediaIntegration: { type: Boolean, default: false },
        onlineBookingWidget: { type: Boolean, default: false },
        onlinePayment: { type: Boolean, default: false },
        additionalDoctors: { type: String, default: 'Unlimited' },
        supportStaff: { type: String, default: 'Unlimited' },
        numberOfClinics: { type: Number, default: 1 },
        additionalClinicCharge: { type: Number, default: 3500 }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    popular: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);