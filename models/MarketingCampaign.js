const mongoose = require('mongoose');

const marketingCampaignSchema = new mongoose.Schema({
    campaignType: {
        type: String,
        enum: ['SMS', 'Email'],
        required: true
    },
    sendTo: {
        type: String,
        enum: ['All Patients', 'Selected Patients', 'Selected Groups'],
        required: true
    },
    selectedPatients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    selectedGroups: [{
        type: String,
        enum: ['VIP', 'Regular', 'Group', 'Gold', 'Silver']
    }],
    emailSubject: {
        type: String,
        trim: true
    },
    header: {
        type: String,
        trim: true
    },
    subHeader: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    imagePublicId: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        default: 'Regards, MediBook Team'
    },
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Scheduled', 'Failed'],
        default: 'Draft'
    },
    scheduledDate: {
        type: Date
    },
    sentCount: {
        type: Number,
        default: 0
    },
    deliveredCount: {
        type: Number,
        default: 0
    },
    failedCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('MarketingCampaign', marketingCampaignSchema);
