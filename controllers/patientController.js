const Patient = require('../models/Patient');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create new patient
const createPatient = async (req, res) => {
    try {
        const {
            name, mobileNumber, dob, gender, clinicType,
            personalInfo, medicalDetails, preferences
        } = req.body;

        const parsedPersonalInfo = typeof personalInfo === 'string' ? JSON.parse(personalInfo) : personalInfo;
        const parsedMedicalDetails = typeof medicalDetails === 'string' ? JSON.parse(medicalDetails) : medicalDetails;
        const parsedPreferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;

        let profileImage = null;
        if (req.files && req.files.profileImage) {
            profileImage = {
                url: req.files.profileImage[0].path,
                publicId: req.files.profileImage[0].filename
            };
        }

        let attachments = [];
        if (req.files && req.files.attachments) {
            attachments = req.files.attachments.map(file => ({
                url: file.path,
                publicId: file.filename,
                fileName: file.originalname,
                uploadDate: new Date()
            }));
        }

        const patient = await Patient.create({
            name,
            mobileNumber,
            dob,
            gender,
            clinicType,
            personalInfo: {
                ...parsedPersonalInfo,
                profileImage
            },
            medicalDetails: {
                ...parsedMedicalDetails,
                attachments
            },
            preferences: parsedPreferences,
            createdBy: req.user._id  // ✅ Current user
        });

        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all patients (Admin: sab, User: apna)
const getAllPatients = async (req, res) => {
    try {
        let filter = {};
        
        // ✅ Admin: sab data, Normal User: sirf apna data
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const patients = await Patient.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: patients.length,
            patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single patient
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        // ✅ Check access
        if (req.user.role !== 'admin' && patient.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update patient
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        if (req.user.role !== 'admin' && patient.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const {
            name, mobileNumber, dob, gender, clinicType,
            personalInfo, medicalDetails, preferences
        } = req.body;

        const parsedPersonalInfo = typeof personalInfo === 'string' ? JSON.parse(personalInfo) : personalInfo;
        const parsedMedicalDetails = typeof medicalDetails === 'string' ? JSON.parse(medicalDetails) : medicalDetails;
        const parsedPreferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;

        if (req.files && req.files.profileImage) {
            if (patient.personalInfo.profileImage?.publicId) {
                await cloudinary.uploader.destroy(patient.personalInfo.profileImage.publicId);
            }
            parsedPersonalInfo.profileImage = {
                url: req.files.profileImage[0].path,
                publicId: req.files.profileImage[0].filename
            };
        } else {
            parsedPersonalInfo.profileImage = patient.personalInfo.profileImage;
        }

        let attachments = [...(patient.medicalDetails.attachments || [])];
        if (req.files && req.files.attachments) {
            const newAttachments = req.files.attachments.map(file => ({
                url: file.path,
                publicId: file.filename,
                fileName: file.originalname,
                uploadDate: new Date()
            }));
            attachments = [...attachments, ...newAttachments];
        }
        parsedMedicalDetails.attachments = attachments;

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                name,
                mobileNumber,
                dob,
                gender,
                clinicType,
                personalInfo: parsedPersonalInfo,
                medicalDetails: parsedMedicalDetails,
                preferences: parsedPreferences
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Patient updated successfully',
            patient: updatedPatient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete patient
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        if (req.user.role !== 'admin' && patient.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (patient.personalInfo.profileImage?.publicId) {
            await cloudinary.uploader.destroy(patient.personalInfo.profileImage.publicId);
        }

        for (const attachment of patient.medicalDetails.attachments || []) {
            if (attachment.publicId) {
                await cloudinary.uploader.destroy(attachment.publicId);
            }
        }

        await patient.deleteOne();
        res.json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete attachment
const deleteAttachment = async (req, res) => {
    try {
        const { patientId, attachmentId } = req.params;
        const patient = await Patient.findById(patientId);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        if (req.user.role !== 'admin' && patient.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const attachment = patient.medicalDetails.attachments.id(attachmentId);
        if (attachment) {
            if (attachment.publicId) {
                await cloudinary.uploader.destroy(attachment.publicId);
            }
            attachment.remove();
            await patient.save();
        }

        res.json({
            success: true,
            message: 'Attachment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add medical condition
const addMedicalCondition = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { name, diagnosedDate, notes } = req.body;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        if (req.user.role !== 'admin' && patient.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        patient.medicalDetails.conditions.push({ name, diagnosedDate, notes });
        await patient.save();

        res.json({
            success: true,
            message: 'Medical condition added successfully',
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove medical condition
const removeMedicalCondition = async (req, res) => {
    try {
        const { patientId, conditionId } = req.params;
        const patient = await Patient.findById(patientId);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        if (req.user.role !== 'admin' && patient.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        patient.medicalDetails.conditions = patient.medicalDetails.conditions.filter(
            c => c._id.toString() !== conditionId
        );
        await patient.save();

        res.json({
            success: true,
            message: 'Medical condition removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    deleteAttachment,
    addMedicalCondition,
    removeMedicalCondition
};