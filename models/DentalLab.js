const mongoose = require('mongoose');

const dentalLabSchema = new mongoose.Schema({
    // Doctor & Lab Details
    doctorName: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    labName: {
        type: String,
        required: [true, 'Lab name is required'],
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },

    // Dental Chart
    isPediatric: {
        type: Boolean,
        default: false
    },
    selectedTeeth: [{
        type: String
    }],

    // Type of Prosthesis
    prosthesisType: {
        type: [String],
        enum: ['Crown', 'Bridge', 'Inlay', 'Onlay', 'Veneer', 'Post & Core', 'Denture']
    },

    // Surface Cluster
    surfaceCluster: {
        type: String,
        enum: ['Smooth', 'Course', 'Glossy']
    },

    // Pontic Type
    ponticType: {
        type: String,
        enum: ['Ovate', 'Ridge Lap', 'Modified Ridge Lap', 'Sanitary']
    },

    // Implant Type
    implantType: {
        type: String,
        enum: ['Screw Retained', 'Cement Retained', 'Others']
    },

    // Others
    others: {
        type: String,
        trim: true
    },

    // Expected Delivery Dates
    expectedDelivery: {
        metalTrial: Date,
        bisqueTrial: Date,
        final: Date
    },

    // Charges
    charges: {
        quantity: {
            type: Number,
            default: 1
        },
        rate: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },

    // Work Delivery Status
    workStatus: {
        type: String,
        enum: ['Handover to Lab', 'In Progress', 'Completed'],
        default: 'Handover to Lab'
    },

    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Calculate total before save
dentalLabSchema.pre('save', function(next) {
    const subtotal = this.charges.quantity * this.charges.rate;
    const taxAmount = subtotal * (this.charges.tax / 100);
    const discountAmount = subtotal * (this.charges.discount / 100);
    this.charges.total = subtotal + taxAmount - discountAmount;
    next();
});

module.exports = mongoose.model('DentalLab', dentalLabSchema);