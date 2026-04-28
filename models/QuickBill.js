const mongoose = require('mongoose');

const quickBillSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    isPediatric: {
        type: Boolean,
        default: false
    },
    selectedTeeth: [{
        type: String
    }],
    treatments: [{
        name: String,
        price: Number
    }],
    medicines: [{
        name: String,
        price: Number
    }],
    discount: {
        type: Number,
        default: 0
    },
    fees: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('QuickBill', quickBillSchema);