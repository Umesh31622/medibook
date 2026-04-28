const express = require('express');
const router = express.Router();
const {
    createQuickBill,
    getAllQuickBills,
    getQuickBillById,
    updateQuickBill,
    deleteQuickBill
} = require('../controllers/quickBillController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createQuickBill);
router.get('/', getAllQuickBills);
router.get('/:id', getQuickBillById);
router.put('/:id', updateQuickBill);
router.delete('/:id', deleteQuickBill);

module.exports = router;