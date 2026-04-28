const express = require('express');
const router = express.Router();
const {
    createDentalLab,
    getAllDentalLabs,
    getDentalLabById,
    updateDentalLab,
    deleteDentalLab,
    updateWorkStatus
} = require('../controllers/dentalLabController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createDentalLab);
router.get('/', getAllDentalLabs);
router.get('/:id', getDentalLabById);
router.put('/:id', updateDentalLab);
router.delete('/:id', deleteDentalLab);
router.patch('/:id/status', updateWorkStatus);

module.exports = router;