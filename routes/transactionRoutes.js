const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/summary', getSummary);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;