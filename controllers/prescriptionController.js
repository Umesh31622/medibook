const Prescription = require('../models/Prescription');

// @desc    Create prescription
const createPrescription = async (req, res) => {
    try {
        const { patientName, doctorName, medicines, diagnosis, instructions, followUpDate, status } = req.body;
        
        const prescription = await Prescription.create({
            patientName,
            doctorName,
            medicines,
            diagnosis,
            instructions,
            followUpDate,
            status,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all prescriptions (Admin: sab, User: apna)
const getAllPrescriptions = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: prescriptions.length,
            prescriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single prescription
const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }
        
        if (req.user.role !== 'admin' && prescription.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update prescription
const updatePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }
        
        if (req.user.role !== 'admin' && prescription.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { patientName, doctorName, medicines, diagnosis, instructions, followUpDate, status } = req.body;
        
        prescription.patientName = patientName || prescription.patientName;
        prescription.doctorName = doctorName || prescription.doctorName;
        prescription.medicines = medicines || prescription.medicines;
        prescription.diagnosis = diagnosis || prescription.diagnosis;
        prescription.instructions = instructions || prescription.instructions;
        prescription.followUpDate = followUpDate || prescription.followUpDate;
        prescription.status = status || prescription.status;
        
        await prescription.save();
        
        res.json({
            success: true,
            message: 'Prescription updated successfully',
            prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete prescription
const deletePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }
        
        if (req.user.role !== 'admin' && prescription.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await prescription.deleteOne();
        res.json({
            success: true,
            message: 'Prescription deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update prescription status
const updatePrescriptionStatus = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }
        
        if (req.user.role !== 'admin' && prescription.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { status } = req.body;
        prescription.status = status;
        await prescription.save();
        
        res.json({
            success: true,
            message: 'Prescription status updated',
            prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    updatePrescriptionStatus
};