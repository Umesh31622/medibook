const Inventory = require('../models/Inventory');

// @desc    Create inventory item
const createInventory = async (req, res) => {
    try {
        const { productName, quantity, expireDate, category, price, warningLevel, description } = req.body;
        
        const existingProduct = await Inventory.findOne({ productName, createdBy: req.user._id });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product already exists'
            });
        }
        
        const inventory = await Inventory.create({
            productName,
            quantity,
            expireDate,
            category,
            price,
            warningLevel,
            description,
            createdBy: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Product added to inventory',
            inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all inventory (Admin: sab, User: apna)
const getAllInventory = async (req, res) => {
    try {
        let filter = {};
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.search) {
            filter.productName = { $regex: req.query.search, $options: 'i' };
        }
        
        const inventory = await Inventory.find(filter).sort({ expireDate: 1 });
        
        const totalItems = inventory.length;
        const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
        const lowStock = inventory.filter(item => item.status === 'Low Stock').length;
        const expired = inventory.filter(item => item.status === 'Expired').length;
        const outOfStock = inventory.filter(item => item.status === 'Out of Stock').length;
        
        res.json({
            success: true,
            count: inventory.length,
            inventory,
            summary: {
                totalItems,
                totalQuantity,
                lowStock,
                expired,
                outOfStock
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single inventory item
const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        if (req.user.role !== 'admin' && inventory.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update inventory item
const updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        if (req.user.role !== 'admin' && inventory.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { productName, quantity, expireDate, category, price, warningLevel, description } = req.body;
        
        inventory.productName = productName || inventory.productName;
        inventory.quantity = quantity !== undefined ? quantity : inventory.quantity;
        inventory.expireDate = expireDate || inventory.expireDate;
        inventory.category = category || inventory.category;
        inventory.price = price !== undefined ? price : inventory.price;
        inventory.warningLevel = warningLevel || inventory.warningLevel;
        inventory.description = description || inventory.description;
        
        await inventory.save();
        
        res.json({
            success: true,
            message: 'Inventory updated successfully',
            inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete inventory item
const deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        if (req.user.role !== 'admin' && inventory.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await inventory.deleteOne();
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update quantity (add or remove stock)
const updateQuantity = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        if (req.user.role !== 'admin' && inventory.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { quantity, operation } = req.body;
        
        if (operation === 'add') {
            inventory.quantity += quantity;
        } else if (operation === 'remove') {
            if (inventory.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }
            inventory.quantity -= quantity;
        }
        
        await inventory.save();
        
        res.json({
            success: true,
            message: 'Stock updated successfully',
            inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    updateQuantity
};