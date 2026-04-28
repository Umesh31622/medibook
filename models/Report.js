const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['doctor_wise_visit', 'doctor_wise_payment', 'clinic_wise_payment', 
               'birthday', 'followup_due', 'doctor_wise_fees', 'treatment_wise',
               'new_repeat_patients', 'fees', 'outstanding', 'payment', 'appointment',
               'payment_summary', 'cash_flow', 'outstanding_income'],
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);