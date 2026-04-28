const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: ''
    },
    timing: {
        type: String,
        default: ''
    }
});

const prescriptionSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    doctorName: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    medicines: [medicineSchema],
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required'],
        trim: true
    },
    instructions: {
        type: String,
        trim: true
    },
    followUpDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Expired'],
        default: 'Active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);