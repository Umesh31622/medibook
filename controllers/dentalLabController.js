const DentalLab = require('../models/DentalLab');

// @desc    Create Dental Lab Case
const createDentalLab = async (req, res) => {
    try {
        const labWork = await DentalLab.create({
            ...req.body,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Lab work created successfully',
            labWork
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all Dental Lab Cases
const getAllDentalLabs = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const labWorks = await DentalLab.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: labWorks.length,
            labWorks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single Dental Lab Case
const getDentalLabById = async (req, res) => {
    try {
        const labWork = await DentalLab.findById(req.params.id);
        if (!labWork) {
            return res.status(404).json({
                success: false,
                message: 'Lab work not found'
            });
        }
        
        if (req.user.role !== 'admin' && labWork.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            labWork
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update Dental Lab Case
const updateDentalLab = async (req, res) => {
    try {
        const labWork = await DentalLab.findById(req.params.id);
        if (!labWork) {
            return res.status(404).json({
                success: false,
                message: 'Lab work not found'
            });
        }
        
        if (req.user.role !== 'admin' && labWork.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const updated = await DentalLab.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Lab work updated successfully',
            labWork: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete Dental Lab Case
const deleteDentalLab = async (req, res) => {
    try {
        const labWork = await DentalLab.findById(req.params.id);
        if (!labWork) {
            return res.status(404).json({
                success: false,
                message: 'Lab work not found'
            });
        }
        
        if (req.user.role !== 'admin' && labWork.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await labWork.deleteOne();
        res.json({
            success: true,
            message: 'Lab work deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update Work Status
const updateWorkStatus = async (req, res) => {
    try {
        const { workStatus } = req.body;
        const labWork = await DentalLab.findById(req.params.id);
        
        if (!labWork) {
            return res.status(404).json({
                success: false,
                message: 'Lab work not found'
            });
        }
        
        labWork.workStatus = workStatus;
        if (workStatus === 'Completed') {
            labWork.status = 'Completed';
        } else if (workStatus === 'In Progress') {
            labWork.status = 'In Progress';
        }
        
        await labWork.save();
        
        res.json({
            success: true,
            message: 'Work status updated',
            labWork
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDentalLab,
    getAllDentalLabs,
    getDentalLabById,
    updateDentalLab,
    deleteDentalLab,
    updateWorkStatus
};