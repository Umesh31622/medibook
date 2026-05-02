const ClinicalVisit = require('../models/ClinicalVisit');
const Patient = require('../models/Patient');

// @desc    Create Clinical Visit
const createClinicalVisit = async (req, res) => {
    try {
        // If new patient, create patient first
        if (req.body.isNewPatient && req.body.patientName) {
            const newPatient = await Patient.create({
                name: req.body.patientName,
                mobileNumber: req.body.mobileNumber || '',
                dob: req.body.dob || new Date(),
                gender: req.body.gender || 'Male',
                clinicType: req.body.clinicType || 'Dental Plus',
                createdBy: req.user._id
            });
            req.body.patientId = newPatient._id;
        }
        
        const visit = await ClinicalVisit.create({
            ...req.body,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Clinical visit created successfully',
            visit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all Clinical Visits
const getAllClinicalVisits = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const visits = await ClinicalVisit.find(filter)
            .populate('patientId', 'name mobileNumber')
            .sort({ createdAt: -1 });
            
        res.json({
            success: true,
            count: visits.length,
            visits
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single Clinical Visit
const getClinicalVisitById = async (req, res) => {
    try {
        const visit = await ClinicalVisit.findById(req.params.id)
            .populate('patientId', 'name mobileNumber age gender');
            
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            });
        }
        
        if (req.user.role !== 'admin' && visit.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            visit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update Clinical Visit
const updateClinicalVisit = async (req, res) => {
    try {
        const visit = await ClinicalVisit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            });
        }
        
        if (req.user.role !== 'admin' && visit.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const updated = await ClinicalVisit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Visit updated successfully',
            visit: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete Clinical Visit
const deleteClinicalVisit = async (req, res) => {
    try {
        const visit = await ClinicalVisit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            });
        }
        
        if (req.user.role !== 'admin' && visit.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await visit.deleteOne();
        res.json({
            success: true,
            message: 'Visit deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add Clinical Note Item (Complaint/Observation/Investigation/Diagnosis)
const addClinicalNote = async (req, res) => {
    try {
        const { type, text } = req.body;
        const visit = await ClinicalVisit.findById(req.params.id);
        
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            });
        }
        
        const noteItem = { text, addedAt: new Date() };
        
        switch(type) {
            case 'complaint':
                visit.complaints.push(noteItem);
                break;
            case 'observation':
                visit.observations.push(noteItem);
                break;
            case 'investigation':
                visit.investigations.push(noteItem);
                break;
            case 'diagnosis':
                visit.diagnosis.push(noteItem);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid type' });
        }
        
        await visit.save();
        
        res.json({
            success: true,
            message: `${type} added successfully`,
            visit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove Clinical Note Item
const removeClinicalNote = async (req, res) => {
    try {
        const { type, index } = req.params;
        const visit = await ClinicalVisit.findById(req.params.id);
        
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'Visit not found'
            });
        }
        
        switch(type) {
            case 'complaint':
                visit.complaints.splice(index, 1);
                break;
            case 'observation':
                visit.observations.splice(index, 1);
                break;
            case 'investigation':
                visit.investigations.splice(index, 1);
                break;
            case 'diagnosis':
                visit.diagnosis.splice(index, 1);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid type' });
        }
        
        await visit.save();
        
        res.json({
            success: true,
            message: `${type} removed successfully`,
            visit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createClinicalVisit,
    getAllClinicalVisits,
    getClinicalVisitById,
    updateClinicalVisit,
    deleteClinicalVisit,
    addClinicalNote,
    removeClinicalNote
};