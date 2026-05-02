const MarketingCampaign = require('../models/MarketingCampaign');
const Patient = require('../models/Patient');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create marketing campaign
const createCampaign = async (req, res) => {
    try {
        const campaignData = {
            ...req.body,
            createdBy: req.user._id
        };
        
        // Handle image upload if present
        if (req.file) {
            campaignData.imageUrl = req.file.path;
            campaignData.imagePublicId = req.file.filename;
        }
        
        const campaign = await MarketingCampaign.create(campaignData);
        
        res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            campaign
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all campaigns
const getAllCampaigns = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const campaigns = await MarketingCampaign.find(filter)
            .populate('selectedPatients', 'name mobileNumber email')
            .sort({ createdAt: -1 });
            
        res.json({
            success: true,
            count: campaigns.length,
            campaigns
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single campaign
const getCampaignById = async (req, res) => {
    try {
        const campaign = await MarketingCampaign.findById(req.params.id)
            .populate('selectedPatients', 'name mobileNumber email');
            
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }
        
        if (req.user.role !== 'admin' && campaign.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            campaign
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update campaign
const updateCampaign = async (req, res) => {
    try {
        const campaign = await MarketingCampaign.findById(req.params.id);
        
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }
        
        if (req.user.role !== 'admin' && campaign.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const updateData = { ...req.body };
        
        // Handle new image upload
        if (req.file) {
            // Delete old image from cloudinary
            if (campaign.imagePublicId) {
                await cloudinary.uploader.destroy(campaign.imagePublicId);
            }
            updateData.imageUrl = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }
        
        const updated = await MarketingCampaign.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Campaign updated successfully',
            campaign: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete campaign
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await MarketingCampaign.findById(req.params.id);
        
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }
        
        if (req.user.role !== 'admin' && campaign.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        // Delete image from cloudinary
        if (campaign.imagePublicId) {
            await cloudinary.uploader.destroy(campaign.imagePublicId);
        }
        
        await campaign.deleteOne();
        
        res.json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Send campaign
const sendCampaign = async (req, res) => {
    try {
        const campaign = await MarketingCampaign.findById(req.params.id);
        
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }
        
        // Get recipients based on sendTo
        let recipients = [];
        
        if (campaign.sendTo === 'All Patients') {
            let patientFilter = {};
            if (req.user.role !== 'admin') {
                patientFilter.createdBy = req.user._id;
            }
            const patients = await Patient.find(patientFilter);
            recipients = patients;
        } else if (campaign.sendTo === 'Selected Patients' && campaign.selectedPatients.length > 0) {
            recipients = await Patient.find({ _id: { $in: campaign.selectedPatients } });
        } else if (campaign.sendTo === 'Selected Groups' && campaign.selectedGroups.length > 0) {
            let groupFilter = { 'preferences.group': { $in: campaign.selectedGroups } };
            if (req.user.role !== 'admin') {
                groupFilter.createdBy = req.user._id;
            }
            const patients = await Patient.find(groupFilter);
            recipients = patients;
        }
        
        // Update campaign status
        campaign.status = 'Sent';
        campaign.sentCount = recipients.length;
        await campaign.save();
        
        // Here you would integrate actual email/SMS sending service
        // For now, just return success
        
        res.json({
            success: true,
            message: `Campaign sent to ${recipients.length} recipients`,
            recipientsCount: recipients.length
        });
    } catch (error) {
        campaign.status = 'Failed';
        await campaign.save();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    sendCampaign
};
