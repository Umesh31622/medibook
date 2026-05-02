const mongoose = require('mongoose');

const clinicalVisitSchema = new mongoose.Schema({
    // Basic Info
    visitDate: {
        type: Date,
        default: Date.now
    },
    visitTime: {
        type: String,
        default: () => new Date().toLocaleTimeString('en-IN', { hour12: false })
    },
    doctorName: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    
    // Patient Info
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    isNewPatient: {
        type: Boolean,
        default: false
    },
    
    // Dental Chart
    isPediatric: {
        type: Boolean,
        default: false
    },
    selectedTeeth: [{
        toothNumber: String,
        status: {
            type: String,
            enum: ['Treatment Done', 'Treatment Planned', 'History'],
            default: 'Treatment Planned'
        }
    }],
    
    // Clinical Notes
    complaints: [{
        text: String,
        addedAt: Date
    }],
    observations: [{
        text: String,
        addedAt: Date
    }],
    investigations: [{
        text: String,
        addedAt: Date
    }],
    diagnosis: [{
        text: String,
        addedAt: Date
    }],
    
    // Treatment Suggested
    treatmentSuggested: {
        treatments: [{
            name: String,
            teeth: [String],
            amount: Number
        }],
        medicines: [{
            name: String,
            dosage: String,
            duration: String,
            timing: String
        }],
        fees: {
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
    
    // Vital Signs
    vitalSigns: {
        bp: String,
        pulse: String,
        temperature: String,
        weight: String,
        height: String,
        notes: String
    },
    
    // Documents
    documents: [{
        url: String,
        publicId: String,
        fileName: String,
        uploadDate: Date
    }],
    
    // Status
    status: {
        type: String,
        enum: ['Draft', 'Completed', 'Billed'],
        default: 'Draft'
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Calculate total before save
clinicalVisitSchema.pre('save', function(next) {
    const subtotal = this.treatmentSuggested.fees;
    const discountAmount = subtotal * (this.treatmentSuggested.discount / 100);
    this.treatmentSuggested.total = subtotal - discountAmount;
    next();
});

module.exports = mongoose.model('ClinicalVisit', clinicalVisitSchema);