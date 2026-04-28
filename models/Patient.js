const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    age: {
        type: Number,
        required: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    clinicType: {
        type: String,
        enum: ['Toth Care', 'Dental Plus'],
        required: true
    },

    // Personal Information
    personalInfo: {
        anniversary: Date,
        emergencyContact: {
            name: String,
            phoneNumber: String,
            relation: String
        },
        alternatePhoneNumber: String,
        profileImage: {
            url: String,
            publicId: String
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: String
        },
        adharNumber: {
            type: String,
            sparse: true
        },
        notes: String
    },

    // Medical Details
    medicalDetails: {
        conditions: [{
            name: String,
            diagnosedDate: Date,
            notes: String
        }],
        attachments: [{
            url: String,
            publicId: String,
            fileName: String,
            uploadDate: Date
        }]
    },

    // Preferences
    preferences: {
        language: {
            type: String,
            enum: ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'],
            default: 'English'
        },
        membership: {
            type: String,
            enum: ['Gold', 'Silver'],
            default: 'Silver'
        },
        group: {
            type: String,
            enum: ['VIP', 'Regular', 'Group'],
            default: 'Regular'
        }
    },

    // Medical Conditions List (for dropdown)
    availableConditions: [{
        type: String,
        enum: ['Diabetes', 'Tuberculosis', 'Heart Patient', 'BP', 'Migraine', 'HIV']
    }],

    isActive: {
        type: Boolean,
        default: true
    },

    // ✅ YEH FIELD HONA CHAHIYE
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });

// Calculate age before saving
patientSchema.pre('save', function(next) {
    if (this.dob) {
        const today = new Date();
        const birthDate = new Date(this.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
    }
    next();
});

module.exports = mongoose.model('Patient', patientSchema);