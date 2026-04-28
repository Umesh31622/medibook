const express = require('express');
const router = express.Router();
const {
    createBill,
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    updateBillStatus
} = require('../controllers/billController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createBill);
router.get('/', getAllBills);
router.get('/:id', getBillById);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);
router.patch('/:id/status', updateBillStatus);

module.exports = router;