const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    department: {
        type: String,
        enum: ['Dental', 'Orthodontics', 'Implant'],
        required: [true, 'Department is required']
    },
    doctorName: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    appointmentTime: {
        type: String,
        required: [true, 'Appointment time is required']
    },
    visitType: {
        type: String,
        enum: ['Consultation', 'Follow-up', 'Emergency'],
        required: [true, 'Visit type is required']
    },
    description: {
        type: String,
        trim: true
    },
    patientName: {
        type: String,
        trim: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
        default: 'Scheduled'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // ✅ YEH FIELD ADD KARO - User-specific data ke liye
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);