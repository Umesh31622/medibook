const express = require('express');
const router = express.Router();
const {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    updatePrescriptionStatus
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createPrescription);
router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);
router.patch('/:id/status', updatePrescriptionStatus);

module.exports = router;