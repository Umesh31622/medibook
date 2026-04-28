const express = require('express');
const router = express.Router();
const {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    updateQuantity
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createInventory);
router.get('/', getAllInventory);
router.get('/:id', getInventoryById);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);
router.patch('/:id/quantity', updateQuantity);

module.exports = router;