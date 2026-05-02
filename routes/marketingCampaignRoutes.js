const express = require('express');
const router = express.Router();
const {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    sendCampaign
} = require('../controllers/marketingCampaignController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(protect);

router.post('/', upload.single('image'), createCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', upload.single('image'), updateCampaign);
router.delete('/:id', deleteCampaign);
router.post('/:id/send', sendCampaign);

module.exports = router;
