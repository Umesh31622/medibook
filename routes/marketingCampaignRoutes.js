// const express = require('express');
// const router = express.Router();
// const {
//     createCampaign,
//     getAllCampaigns,
//     getCampaignById,
//     updateCampaign,
//     deleteCampaign,
//     sendCampaign
// } = require('../controllers/marketingCampaignController');
// const { protect } = require('../middleware/auth');
// const { upload } = require('../middleware/upload');

// router.use(protect);

// router.post('/', upload.single('image'), createCampaign);
// router.get('/', getAllCampaigns);
// router.get('/:id', getCampaignById);
// router.put('/:id', upload.single('image'), updateCampaign);
// router.delete('/:id', deleteCampaign);
// router.post('/:id/send', sendCampaign);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// ✅ Test route (no auth required)
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Marketing campaign routes working!' });
});

// ✅ Get all campaigns (requires auth)
router.get('/', protect, async (req, res) => {
    try {
        // Temporary response for testing
        res.json({ 
            success: true, 
            campaigns: [],
            message: 'Marketing campaigns endpoint working'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Create campaign (requires auth)
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        // Temporary response
        res.status(201).json({ 
            success: true, 
            message: 'Campaign created successfully (test)',
            campaign: req.body
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
